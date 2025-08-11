import Header from "@/components/layout/Header";
import { Helmet } from "react-helmet-async";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { useState } from "react";
import { Invoice } from "@/store/invoices";

export default function InvoiceNew() {
  const [preview, setPreview] = useState<Invoice>({
    id: "PREVIEW",
    clientName: "Client Name",
    clientEmail: "client@email.com",
    currency: "USD",
    items: [
      { id: "1", description: "Design", quantity: 10, unitPrice: 80 },
      { id: "2", description: "Development", quantity: 20, unitPrice: 100 },
    ],
    taxRate: 10,
    discount: 0,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    notes: "Thanks!",
    status: "draft",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return (
    <div>
      <Helmet>
        <title>Create Invoice — InvoiceFlow</title>
        <meta name="description" content="Create an invoice with real-time PDF preview in InvoiceFlow." />
        <link rel="canonical" href="/invoices/new" />
      </Helmet>
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-semibold mb-4">Create Invoice</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="order-2 lg:order-1">
            <InvoiceForm onChange={(data) => setPreview((p) => ({ ...p, ...data, updatedAt: Date.now() }))} />
          </div>
          <div className="order-1 lg:order-2">
            <InvoicePreview invoice={preview} allowDownload={false} />
          </div>
        </div>
      </main>
    </div>
  );
}
