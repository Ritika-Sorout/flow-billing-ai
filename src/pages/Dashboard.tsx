import Header from "@/components/layout/Header";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { useInvoices } from "@/store/invoices";

export default function Dashboard() {
  const navigate = useNavigate();
  const { invoices } = useInvoices();

  const total = invoices.length;
  const paid = invoices.filter((i) => i.status === "paid").length;
  const pending = invoices.filter((i) => i.status === "pending").length;
  const overdue = invoices.filter((i) => i.status === "overdue").length;

  return (
    <div>
      <Helmet>
        <title>InvoiceFlow Dashboard — Modern Invoice Management</title>
        <meta name="description" content="Create, approve, and send invoices fast with live PDF preview." />
        <link rel="canonical" href="/" />
      </Helmet>
      <Header />
      <main className="container py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">InvoiceFlow Dashboard</h1>
          <p className="text-muted-foreground">Step 1: Create • Step 2: Approve • Step 3: Send</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="animate-enter">
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{total}</CardContent>
          </Card>
          <Card className="animate-enter">
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{pending}</CardContent>
          </Card>
          <Card className="animate-enter">
            <CardHeader>
              <CardTitle>Paid</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{paid}</CardContent>
          </Card>
          <Card className="animate-enter">
            <CardHeader>
              <CardTitle>Overdue</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{overdue}</CardContent>
          </Card>
        </section>

        <section className="mt-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Get started</h2>
            <p className="text-muted-foreground">Build a new invoice and preview the PDF instantly.</p>
          </div>
          <Button onClick={() => navigate("/invoices/new")}>Create Invoice</Button>
        </section>

        <section className="mt-6">
          <Link to="/invoices" className="underline">View all invoices →</Link>
        </section>
      </main>
    </div>
  );
}
