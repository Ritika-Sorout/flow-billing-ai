import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoices, Invoice, InvoiceItem } from "@/store/invoices";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

function newItem(): InvoiceItem {
  return { id: Math.random().toString(36).slice(2), description: "", quantity: 1, unitPrice: 0 };
}

export default function InvoiceForm({
  initial,
  onChange,
}: {
  initial?: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "status">;
  onChange?: (data: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "status">) => void;
}) {
  const { createInvoice } = useInvoices();
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<Invoice, "id" | "createdAt" | "updatedAt" | "status">>(
    initial ?? {
      clientName: "",
      clientEmail: "",
      currency: "USD",
      items: [newItem()],
      taxRate: 0,
      discount: 0,
      dueDate: "",
      notes: "",
    }
  );

  const update = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const updateItem = (id: string, patch: Partial<InvoiceItem>) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  };

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, newItem()] }));
  const removeItem = (id: string) =>
    setForm((f) => ({ ...f, items: f.items.filter((i) => i.id !== id) }));

  useEffect(() => {
    onChange?.(form);
  }, [form, onChange]);

  function onSubmit() {
    const inv = createInvoice({ ...form });
    toast({ title: "Invoice created", description: `ID ${inv.id} submitted for approval.` });
    navigate(`/approval/${inv.id}`);
  }

  return (
    <Card className="animate-enter">
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client name</Label>
            <Input id="clientName" value={form.clientName} onChange={(e) => update({ clientName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Client email</Label>
            <Input id="clientEmail" type="email" value={form.clientEmail} onChange={(e) => update({ clientEmail: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" value={form.currency} onChange={(e) => update({ currency: e.target.value.toUpperCase() })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due date</Label>
            <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => update({ dueDate: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Items</Label>
          <div className="space-y-3">
            {form.items.map((it) => (
              <div key={it.id} className="grid grid-cols-12 gap-2">
                <Input className="col-span-6" placeholder="Description" value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} />
                <Input className="col-span-2" type="number" min={1} placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })} />
                <Input className="col-span-3" type="number" step="0.01" placeholder="Unit price" value={it.unitPrice} onChange={(e) => updateItem(it.id, { unitPrice: Number(e.target.value) })} />
                <Button variant="secondary" className="col-span-1" onClick={() => removeItem(it.id)}>-</Button>
              </div>
            ))}
            <Button onClick={addItem}>Add item</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax rate (%)</Label>
            <Input id="taxRate" type="number" step="0.01" value={form.taxRate} onChange={(e) => update({ taxRate: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Discount</Label>
            <Input id="discount" type="number" step="0.01" value={form.discount} onChange={(e) => update({ discount: Number(e.target.value) })} />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" value={form.notes} onChange={(e) => update({ notes: e.target.value })} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSubmit}>Submit for approval</Button>
        </div>
      </CardContent>
    </Card>
  );
}
