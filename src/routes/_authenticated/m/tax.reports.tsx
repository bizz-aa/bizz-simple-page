import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Percent, Coins, ShoppingBag, Receipt, CalendarDays, CalendarRange, FileDown, FileSpreadsheet } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { EmptyState, InsightPanel, MetricCard, StatusPill } from "@/components/tax-workspace-ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/m/tax/reports")({ component: TaxReportsHub });

function TaxReportsHub() {
  const { metrics, sales, purchases, expenses, vatReturns, assets, documents } = useTaxModule();

  const exportReport = (type: string) => {
    window.alert(`Exporting ${type} report with current tax data.`);
  };

  return (
    <TaxLayout
      title="Tax Reports"
      subtitle="Professional reporting, export and print workflows"
      headerIcon={BarChart3}
      cards={[
        { label: "VAT", icon: Percent },
        { label: "Income Tax", icon: Coins },
        { label: "Expenses", icon: Receipt },
        { label: "Assets", icon: ShoppingBag },
      ]}
      sections={[
        {
          title: "Report Types",
          icon: BarChart3,
          items: [
            { label: "VAT Reports", icon: Percent },
            { label: "Income Tax Reports", icon: Coins },
            { label: "Expense Reports", icon: Receipt },
            { label: "Capital Asset Reports", icon: ShoppingBag },
            { label: "Quarterly Reports", icon: CalendarDays },
            { label: "Annual Reports", icon: CalendarRange },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel title="Reporting Suite" icon={BarChart3} tone="emerald" action={<StatusPill label="Ready" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Sales records" value={sales.length.toString()} tone="emerald" />
            <MetricCard label="Documents" value={documents.length.toString()} tone="amber" />
          </div>
        </InsightPanel>

        <InsightPanel title="Export Options" icon={FileDown} tone="violet">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => exportReport("PDF")}>PDF</Button>
            <Button size="sm" variant="outline" onClick={() => exportReport("Excel")}>Excel</Button>
            <Button size="sm" variant="outline" onClick={() => exportReport("CSV")}>CSV</Button>
            <Button size="sm" variant="outline" onClick={() => exportReport("Print")}>Print</Button>
          </div>
        </InsightPanel>
      </div>

      <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Sales total" value={formatCurrency(metrics.salesTotal)} tone="emerald" />
          <MetricCard label="Purchases total" value={formatCurrency(metrics.purchaseTotal)} tone="blue" />
          <MetricCard label="Estimated tax" value={formatCurrency(metrics.estimatedTax)} tone="amber" />
          <MetricCard label="VAT payable" value={formatCurrency(metrics.vatPayable)} tone="violet" />
        </div>
        <div className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
          <p>VAT returns: {vatReturns.length}</p>
          <p>Assets tracked: {assets.length}</p>
          <p>Expenses logged: {expenses.length}</p>
          <p>Purchases logged: {purchases.length}</p>
        </div>
      </div>

      <div className="mt-6">
        <EmptyState title="Reports workspace is ready" description="Generate compliance, annual, quarterly, and tax-specific reports with export options for PDF, Excel, CSV, and print." icon={FileSpreadsheet} />
      </div>
    </TaxLayout>
  );
}
