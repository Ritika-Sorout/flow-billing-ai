import { useEffect, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { calcTotals, Invoice } from "@/store/invoices";
import { Button } from "@/components/ui/button";

export default function InvoicePreview({ invoice, allowDownload = true }: { invoice: Invoice; allowDownload?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const totals = useMemo(() => calcTotals(invoice), [invoice]);

  async function downloadPDF() {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    const marginX = (pageWidth - imgWidth) / 2;
    const marginY = 24;
    pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
    pdf.save(`Invoice_${invoice.id}.pdf`);
  }

  useEffect(() => {
    // helpful: recalc on invoice change
  }, [invoice]);

  return (
    <div className="space-y-3">
      {allowDownload && (
        <div className="flex justify-end">
          <Button onClick={downloadPDF}>Download PDF</Button>
        </div>
      )}
      <div ref={ref} className="bg-card text-foreground rounded-lg shadow-md border p-6 w-full mx-auto max-w-[800px]">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Invoice</h2>
            <p className="text-sm text-muted-foreground">ID: {invoice.id}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">InvoiceFlow</div>
            <div className="text-sm text-muted-foreground">invoiceflow.app</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-muted-foreground">Bill To</div>
            <div className="font-medium">{invoice.clientName}</div>
            <div className="text-sm text-muted-foreground">{invoice.clientEmail}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Due Date</div>
            <div className="font-medium">{invoice.dueDate || "-"}</div>
            <div className="text-sm text-muted-foreground">Currency: {invoice.currency}</div>
          </div>
        </div>

        <div className="mt-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Unit</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((it) => (
                <tr key={it.id} className="border-b last:border-0">
                  <td className="py-2">{it.description}</td>
                  <td className="py-2 text-right">{it.quantity}</td>
                  <td className="py-2 text-right">{it.unitPrice.toFixed(2)}</td>
                  <td className="py-2 text-right">{(it.quantity * it.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 items-start">
          <div>
            {invoice.notes && (
              <div>
                <div className="font-medium">Notes</div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{totals.subtotal.toFixed(2)} {invoice.currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>{totals.tax.toFixed(2)} {invoice.currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span>-{invoice.discount.toFixed(2)} {invoice.currency}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Total</span>
              <span>{totals.total.toFixed(2)} {invoice.currency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
