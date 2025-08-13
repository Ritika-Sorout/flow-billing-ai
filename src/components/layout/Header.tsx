import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Settings as Gear, LayoutGrid } from "lucide-react";

export default function Header() {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-secondary text-foreground" : "hover:bg-muted"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md" style={{ backgroundImage: "var(--gradient-primary)" }} />
            <span className="text-lg font-semibold">InvoiceFlow</span>
          </Link>
          <nav className="ml-6 hidden md:flex items-center gap-1">
            <NavLink to="/" end className={linkCls}>
              <LayoutGrid className="h-4 w-4 mr-2" /> Home
            </NavLink>
            <NavLink to="/invoices" className={linkCls}>
              <FileText className="h-4 w-4 mr-2" /> Invoices
            </NavLink>
            <NavLink to="/settings" className={linkCls}>
              <Gear className="h-4 w-4 mr-2" /> Settings
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link to="/invoices/new">
              <Plus className="h-4 w-4 mr-2" /> Create Invoice
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
