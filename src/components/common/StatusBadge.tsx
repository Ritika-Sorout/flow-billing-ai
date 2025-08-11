import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "Draft", cls: "bg-muted text-foreground" },
    pending: { label: "Pending", cls: "bg-accent text-accent-foreground" },
    approved: { label: "Approved", cls: "bg-secondary text-secondary-foreground" },
    rejected: { label: "Rejected", cls: "bg-destructive text-destructive-foreground" },
    sent: { label: "Sent", cls: "bg-muted text-foreground" },
    paid: { label: "Paid", cls: "bg-primary text-primary-foreground" },
    overdue: { label: "Overdue", cls: "bg-destructive text-destructive-foreground" },
  };
  const v = map[status] || { label: status, cls: "bg-muted" };
  return <Badge className={v.cls}>{v.label}</Badge>;
}
