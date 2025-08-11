import Header from "@/components/layout/Header";
import { Helmet } from "react-helmet-async";

export default function Settings() {
  return (
    <div>
      <Helmet>
        <title>Settings — InvoiceFlow</title>
        <meta name="description" content="Configure branding, currencies and notifications." />
        <link rel="canonical" href="/settings" />
      </Helmet>
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">Branding and templates coming soon.</p>
      </main>
    </div>
  );
}
