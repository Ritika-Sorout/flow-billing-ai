-- Enable uuid generation
create extension if not exists pgcrypto;

-- Generic updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Invoices table
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_name text not null,
  client_email text,
  currency text not null default 'USD' check (currency in ('USD','INR')),
  tax_rate numeric(5,2) not null default 0,
  discount numeric(12,2) not null default 0,
  due_date date,
  notes text,
  status text not null default 'pending' check (status in ('draft','pending','approved','rejected','sent','paid','overdue')),
  subtotal numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Invoice items table
create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

-- Policies for invoices
create policy "select own invoices" on public.invoices
for select using (auth.uid() = user_id);

create policy "insert own invoices" on public.invoices
for insert with check (auth.uid() = user_id);

create policy "update own invoices" on public.invoices
for update using (auth.uid() = user_id);

create policy "delete own invoices" on public.invoices
for delete using (auth.uid() = user_id);

-- Policies for invoice_items (scoped via parent invoice)
create policy "select own items" on public.invoice_items
for select using (
  exists (
    select 1 from public.invoices inv where inv.id = invoice_id and inv.user_id = auth.uid()
  )
);

create policy "insert own items" on public.invoice_items
for insert with check (
  exists (
    select 1 from public.invoices inv where inv.id = invoice_id and inv.user_id = auth.uid()
  )
);

create policy "update own items" on public.invoice_items
for update using (
  exists (
    select 1 from public.invoices inv where inv.id = invoice_id and inv.user_id = auth.uid()
  )
);

create policy "delete own items" on public.invoice_items
for delete using (
  exists (
    select 1 from public.invoices inv where inv.id = invoice_id and inv.user_id = auth.uid()
  )
);

-- updated_at triggers
create trigger set_invoices_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

create trigger set_invoice_items_updated_at
before update on public.invoice_items
for each row execute function public.set_updated_at();

-- Totals recalculation
create or replace function public.recalc_invoice_totals(p_invoice_id uuid)
returns void
language plpgsql
as $$
declare
  v_subtotal numeric(12,2) := 0;
  v_tax_rate numeric(5,2) := 0;
  v_discount numeric(12,2) := 0;
  v_tax_amount numeric(12,2) := 0;
  v_total numeric(12,2) := 0;
begin
  select coalesce(sum(quantity * unit_price), 0) into v_subtotal
  from public.invoice_items where invoice_id = p_invoice_id;

  select tax_rate, discount into v_tax_rate, v_discount
  from public.invoices where id = p_invoice_id;

  v_tax_amount := round((v_subtotal * coalesce(v_tax_rate,0) / 100.0)::numeric, 2);
  v_total := v_subtotal + v_tax_amount - coalesce(v_discount,0);

  update public.invoices
  set subtotal = round(v_subtotal::numeric, 2),
      tax_amount = v_tax_amount,
      discount_amount = round(coalesce(v_discount,0)::numeric, 2),
      total_amount = round(v_total::numeric, 2),
      updated_at = now()
  where id = p_invoice_id;
end;
$$;

create or replace function public.trigger_recalc_invoice_totals()
returns trigger
language plpgsql
as $$
begin
  if tg_table_name = 'invoice_items' then
    if (tg_op = 'DELETE') then
      perform public.recalc_invoice_totals(old.invoice_id);
    else
      perform public.recalc_invoice_totals(new.invoice_id);
    end if;
  else
    perform public.recalc_invoice_totals(new.id);
  end if;
  return null;
end;
$$;

create trigger recalc_on_item_change
after insert or update or delete on public.invoice_items
for each row execute function public.trigger_recalc_invoice_totals();

create trigger recalc_on_invoice_change
after insert or update of tax_rate, discount on public.invoices
for each row execute function public.trigger_recalc_invoice_totals();

-- Indexes for efficient filtering
create index if not exists idx_invoices_user_status on public.invoices(user_id, status);
create index if not exists idx_invoices_due_date on public.invoices(due_date);
create index if not exists idx_invoices_created_at on public.invoices(created_at desc);
create index if not exists idx_invoices_currency on public.invoices(currency);
create index if not exists idx_invoices_total_amount on public.invoices(total_amount);
create index if not exists idx_invoices_client_name on public.invoices(client_name);
