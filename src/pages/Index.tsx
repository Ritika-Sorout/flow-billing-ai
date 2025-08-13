import Header from "@/components/layout/Header";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FilePlus2, Eye, CheckCircle2 } from "lucide-react";

const Index = () => {
  return (
    <div>
      <Helmet>
        <title>Flow Billing AI — Invoice Generator & Tracker</title>
        <meta name="description" content="Create invoices with live PDF preview, approve, and share. A simple demo for freelancers and small businesses." />
        <link rel="canonical" href="/" />
      </Helmet>
      <Header />
      <main className="container py-12">
        <section className="text-center max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Flow Billing AI – Invoice Generator & Tracker
          </h1>
          <p className="mt-4 text-muted-foreground">
            Create Invoice → Preview → Approval → Download/Share. Fast, modern, and mobile‑first.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild>
              <Link to="/invoices/new">Create Invoice</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/invoices">View demo invoices</Link>
            </Button>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm animate-enter">
            <FilePlus2 className="h-6 w-6 mb-3 text-primary" />
            <h3 className="font-semibold">Create in seconds</h3>
            <p className="text-sm text-muted-foreground">Use dummy clients and items. Add quantities, prices, tax, due date, and notes.</p>
          </article>
          <article className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm animate-enter">
            <Eye className="h-6 w-6 mb-3 text-primary" />
            <h3 className="font-semibold">Live PDF preview</h3>
            <p className="text-sm text-muted-foreground">See totals update instantly with a clean, shareable layout.</p>
          </article>
          <article className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm animate-enter">
            <CheckCircle2 className="h-6 w-6 mb-3 text-primary" />
            <h3 className="font-semibold">Approve and share</h3>
            <p className="text-sm text-muted-foreground">Simulate approval, then download as PDF or copy a share link.</p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Index;

