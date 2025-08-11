import Header from "@/components/layout/Header";
import { Helmet } from "react-helmet-async";
import { useInvoices } from "@/store/invoices";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoicesList() {
  const { invoices } = useInvoices();

  return (
    <div>
      <Helmet>
        <title>Invoices — InvoiceFlow</title>
        <meta name="description" content="Browse all invoices and track their status in InvoiceFlow." />
        <link rel="canonical" href="/invoices" />
      </Helmet>
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-semibold mb-4">Invoices</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((inv) => (
            <Card key={inv.id} className="animate-enter">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{inv.clientName}</CardTitle>
                <StatusBadge status={inv.status} />
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-muted-foreground">Due</div>
                    <div>{inv.dueDate || "-"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground">Currency</div>
                    <div>{inv.currency}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Link to={`/invoice/${inv.id}`} className="underline">Open →</Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
