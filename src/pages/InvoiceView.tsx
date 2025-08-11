import Header from "@/components/layout/Header";
import { Helmet } from "react-helmet-async";
import { useInvoices } from "@/store/invoices";
import { useParams } from "react-router-dom";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function InvoiceView() {
  const { id } = useParams();
  const { getInvoice, updateStatus } = useInvoices();
  const invoice = id ? getInvoice(id) : undefined;

  if (!invoice) return (
    <div>
      <Header />
      <main className="container py-8"><p>Invoice not found.</p></main>
    </div>
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "Share this URL with your client." });
    } catch {
      toast({ title: "Copy failed", description: "Please copy the URL from the address bar." });
    }
  };

  const markPaid = () => {
    updateStatus(invoice.id, "paid");
    toast({ title: "Marked as paid", description: `Invoice ${invoice.id} is now paid.` });
  };

  return (
    <div>
      <Helmet>
        <title>Invoice {invoice.id} — InvoiceFlow</title>
        <meta name="description" content={`Invoice for ${invoice.clientName}. View, download, or share.`} />
        <link rel="canonical" href={`/invoice/${invoice.id}`} />
      </Helmet>
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Invoice {invoice.id}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyLink}>Copy Share Link</Button>
            <Button onClick={markPaid}>Mark as Paid</Button>
          </div>
        </div>
        <InvoicePreview invoice={invoice} />
      </main>
    </div>
  );
}
