import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { SummaryStrip, TaxWorkspace } from "@/components/tax/tax-workspace";
import { buildTaxReportPdf, type ReportSection } from "@/lib/tax-pdf";

export const Route = createFileRoute("/_authenticated/m/tax/reports")({ component: TaxReportsHub });

function TaxReportsHub() {
  const { metrics, sales, purchases, expenses, vatReturns, withholding, paye, incomeTax, assets, documents, obligations } = useTaxModule();
  const [busy, setBusy] = useState(false);

  const sections: ReportSection[] = [
    {
      title: "Overview",
      rows: [
        ["Total sales", formatCurrency(metrics.salesTotal)],
        ["Output VAT", formatCurrency(metrics.salesVat)],
        ["Total purchases", formatCurrency(metrics.purchaseTotal)],
        ["Deductible expenses", formatCurrency(metrics.deductibleExpenses ?? 0)],
        ["Estimated income tax", formatCurrency(metrics.estimatedTax)],
        ["VAT payable", formatCurrency(metrics.vatPayable)],
      ],
    },
    {
      title: "Records",
      rows: [
        ["EFD sales records", String(sales.length)],
        ["Purchase records", String(purchases.length)],
        ["Expense records", String(expenses.length)],
        ["VAT returns", String(vatReturns.length)],
        ["Withholding certificates", String(withholding.length)],
        ["PAYE records", String(paye.length)],
        ["Income tax records", String(incomeTax.length)],
        ["Capital assets", String(assets.length)],
        ["Documents archived", String(documents.length)],
      ],
    },
    {
      title: "Compliance",
      rows: [
        ["Overdue obligations", String(metrics.overdue)],
        ["Due soon", String(metrics.dueSoon)],
        ...obligations
          .filter((row) => row.status !== "Paid")
          .slice(0, 12)
          .map((row) => [`${row.taxType} · ${row.period}`, `${row.dueDate} (${row.status})`] as [string, string]),
      ],
    },
  ];

  const download = () => {
    setBusy(true);
    try {
      buildTaxReportPdf(sections, `tax-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Full tax report downloaded");
    } catch {
      toast.error("Could not build the report");
    } finally {
      setBusy(false);
    }
  };

  return (
    <TaxWorkspace
      title="Tax Reports"
      subtitle="One consolidated report across the whole tax module"
      icon={BarChart3}
      actions={
        <Button size="sm" className="h-9 bg-amber-400 text-black hover:bg-amber-300" onClick={download} disabled={busy}>
          {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileDown className="mr-1.5 h-4 w-4" />} Download PDF
        </Button>
      }
    >
      <SummaryStrip
        items={[
          { label: "Sales", value: formatCurrency(metrics.salesTotal), hint: `${sales.length} records`, accent: true },
          { label: "Purchases", value: formatCurrency(metrics.purchaseTotal), hint: `${purchases.length} records` },
          { label: "VAT payable", value: formatCurrency(metrics.vatPayable), hint: `${vatReturns.length} returns` },
          { label: "Estimated tax", value: formatCurrency(metrics.estimatedTax), hint: `${metrics.overdue} overdue` },
        ]}
      />

      <div className="mt-6 space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <h2 className="font-display text-base font-bold text-white">{section.title}</h2>
            <div className="mt-3 divide-y divide-white/10">
              {section.rows.map(([label, value]) => (
                <div key={label} className="flex min-w-0 items-center justify-between gap-3 py-2 text-sm">
                  <span className="min-w-0 break-words text-white/70">{label}</span>
                  <span className="shrink-0 font-medium text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TaxWorkspace>
  );
}
