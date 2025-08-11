import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "sent"
  | "paid"
  | "overdue";

export type Invoice = {
  id: string;
  clientName: string;
  clientEmail: string;
  currency: string; // e.g., USD, EUR
  items: InvoiceItem[];
  taxRate: number; // percent
  discount: number; // amount
  dueDate?: string; // ISO date
  notes?: string;
  status: InvoiceStatus;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "invoiceflow_invoices_v1";

function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

function calcSubtotal(items: InvoiceItem[]) {
  return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
}

export function calcTotals(inv: Pick<Invoice, "items" | "taxRate" | "discount">) {
  const subtotal = calcSubtotal(inv.items);
  const tax = (subtotal * (inv.taxRate || 0)) / 100;
  const total = subtotal + tax - (inv.discount || 0);
  return { subtotal, tax, total };
}

export type InvoicesContextValue = {
  invoices: Invoice[];
  createInvoice: (data: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "status"> & { status?: InvoiceStatus }) => Invoice;
  updateStatus: (id: string, status: InvoiceStatus) => void;
  getInvoice: (id: string) => Invoice | undefined;
};

const InvoicesContext = createContext<InvoicesContextValue | undefined>(
  undefined
);

export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Invoice[];
        setInvoices(parsed);
        return;
      } catch {}
    }
    // seed dummy data
    const seed: Invoice[] = [
      {
        id: uid(),
        clientName: "Acme Corp",
        clientEmail: "billing@acme.com",
        currency: "USD",
        items: [
          { id: uid(), description: "Design Services", quantity: 10, unitPrice: 75 },
          { id: uid(), description: "Frontend Development", quantity: 20, unitPrice: 95 },
        ],
        taxRate: 8,
        discount: 50,
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        notes: "Thank you for your business!",
        status: "sent",
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now() - 86400000 * 2,
      },
      {
        id: uid(),
        clientName: "Globex LLC",
        clientEmail: "ap@globex.com",
        currency: "EUR",
        items: [
          { id: uid(), description: "API Integration", quantity: 15, unitPrice: 120 },
        ],
        taxRate: 20,
        discount: 0,
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
        notes: "Net 7 days.",
        status: "pending",
        createdAt: Date.now() - 86400000 * 1,
        updatedAt: Date.now() - 86400000 * 1,
      },
    ];
    setInvoices(seed);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const value = useMemo<InvoicesContextValue>(() => ({
    invoices,
    createInvoice: (data) => {
      const now = Date.now();
      const inv: Invoice = {
        ...data,
        id: uid(),
        status: (data as any).status || "pending",
        createdAt: now,
        updatedAt: now,
      };
      setInvoices((prev) => [inv, ...prev]);
      return inv;
    },
    updateStatus: (id, status) => {
      setInvoices((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status, updatedAt: Date.now() } : i))
      );
    },
    getInvoice: (id) => invoices.find((i) => i.id === id),
  }), [invoices]);

  return (
    <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoicesContext);
  if (!ctx) throw new Error("useInvoices must be used within InvoicesProvider");
  return ctx;
}
