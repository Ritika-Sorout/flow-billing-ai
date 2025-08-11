import Header from "@/components/layout/Header";
import { Helmet } from "react-helmet-async";
import { useInvoices } from "@/store/invoices";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Approval() {
  const { id } = useParams();
  const { getInvoice, updateStatus } = useInvoices();
  const navigate = useNavigate();
  const invoice = id ? getInvoice(id) : undefined;

  if (!invoice) return (
    <div>
      <Header />
      <main className="container py-8"><p>Invoice not found.</p></main>
    </div>
  );

  const onApprove = () => {
    updateStatus(invoice.id, "approved");
    toast({ title: "Approved", description: `Invoice ${invoice.id} approved.` });
  };
  const onReject = () => {
    updateStatus(invoice.id, "rejected");
    toast({ title: "Rejected", description: `Invoice ${invoice.id} rejected.` });
  };
  const onSend = () => {
    updateStatus(invoice.id, "sent");
    toast({ title: "Sent", description: `Invoice ${invoice.id} sent to client.` });
    navigate(`/invoice/${invoice.id}`);
  };

  return (
    <div>
      <Helmet>
        <title>Approval — InvoiceFlow</title>
        <meta name="description" content="Approve or reject the invoice with a single click." />
        <link rel="canonical" href={`/approval/${invoice.id}`} />
      </Helmet>
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-semibold mb-4">Approval</h1>
        <p className="text-muted-foreground mb-6">Review invoice {invoice.id} for {invoice.clientName}.</p>
        <div className="flex gap-3">
          <Button onClick={onApprove}>Approve</Button>
          <Button variant="secondary" onClick={onReject}>Reject</Button>
          <Button variant="outline" onClick={onSend}>Send</Button>
        </div>
      </main>
    </div>
  );
}
