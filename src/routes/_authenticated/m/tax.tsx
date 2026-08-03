import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Landmark, ShoppingCart, ShoppingBag, Receipt, Percent,
  Coins, HandCoins, Building2, FolderArchive, Upload, BarChart3,
  CalendarDays, AlertTriangle, Activity, Sparkles, BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { TaxLayout } from "@/components/tax-layout";
import { TaxModuleProvider, formatCurrency, useTaxModule } from "@/components/tax-module-provider";
import { EmptyState, InsightPanel, MetricCard, ProgressBar, StatusPill, TimelineItem } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax")({ component: TaxHub });

function TaxHub() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isNestedRoute = pathname !== "/m/tax" && pathname.startsWith("/m/tax/");

  if (isNestedRoute) {
    return (
      <TaxModuleProvider>
        <Outlet />
      </TaxModuleProvider>
    );
  }

  return (
    <TaxModuleProvider>
      <TaxOverview />
    </TaxModuleProvider>
  );
}

function TaxOverview() {
  const { metrics } = useTaxModule();

  return (
    <TaxLayout
      title="Tax Management"
      subtitle="Independent tax records & compliance"
      headerIcon={Landmark}
      cards={[
        { label: "Tax Sales", icon: ShoppingCart, to: "/m/tax/sales" },
        { label: "Purchases", icon: ShoppingBag, to: "/m/tax/purchases" },
        { label: "Expenses", icon: Receipt, to: "/m/tax/expenses" },
        { label: "VAT", icon: Percent, to: "/m/tax/vat" },
      ]}
      sections={[
        {
          title: "Tax Workspaces",
          icon: Landmark,
          items: [
            { label: "Income Tax", icon: Coins, to: "/m/tax/income" },
            { label: "Withholding Tax", icon: HandCoins, to: "/m/tax/withholding" },
            { label: "Capital Assets", icon: Building2, to: "/m/tax/assets" },
            { label: "Document Center", icon: FolderArchive, to: "/m/tax/documents" },
            { label: "Import Center", icon: Upload, to: "/m/tax/import" },
            { label: "Tax Reports", icon: BarChart3, to: "/m/tax/reports" },
          ],
        },
        {
          title: "Tax Calendar",
          icon: CalendarDays,
          items: [
            { label: "VAT Return — filing window open", icon: CalendarDays, onClick: () => toast.info("Tax Calendar — coming soon") },
            { label: "PAYE — due end of month", icon: CalendarDays, onClick: () => toast.info("Tax Calendar — coming soon") },
            { label: "Provisional Income Tax — quarterly", icon: CalendarDays, onClick: () => toast.info("Tax Calendar — coming soon") },
          ],
        },
        {
          title: "Upcoming Deadlines",
          icon: AlertTriangle,
          items: [
            { label: "No upcoming deadlines configured", icon: AlertTriangle, onClick: () => toast.info("Deadlines — coming soon") },
          ],
        },
        {
          title: "Recent Activities",
          icon: Activity,
          items: [
            { label: "No recent tax activity", icon: Activity, onClick: () => toast.info("Activity feed — coming soon") },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel title="Tax Health" icon={BadgeCheck} tone="emerald" action={<StatusPill label="Stable" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Projected Annual Profit" value={formatCurrency(metrics.projectedProfit)} hint="Above plan" tone="emerald" />
            <MetricCard label="Estimated Tax" value={formatCurrency(metrics.estimatedTax)} hint="30% applied" tone="amber" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <ProgressBar label="Compliance readiness" value={Math.round(metrics.complianceScore)} tone="emerald" />
          </div>
        </InsightPanel>

        <InsightPanel title="Intelligent Summary" icon={Sparkles} tone="violet">
          <MetricCard label="VAT status" value={metrics.vatPayable > 0 ? "Payable" : "Balanced"} hint="Returns prepared" tone="violet" />
          <MetricCard label="Deductible spend" value={formatCurrency(metrics.deductibleExpenses)} hint="Tracked" tone="blue" />
          <MetricCard label="Document coverage" value={`${Math.round(metrics.complianceScore)}%`} hint="Verified" tone="slate" />
        </InsightPanel>
      </div>

      <div className="mt-6">
        <InsightPanel title="Tax Timeline" icon={CalendarDays} tone="slate">
          <TimelineItem title="Quarterly estimate due" detail="Prepare provisional tax estimate for the next reporting cycle." status="Upcoming" />
          <TimelineItem title="VAT return window" detail="Review output and input balances before filing." status="Open" />
          <TimelineItem title="Annual review checkpoint" detail="Reconcile profits and deductible expenses before close." status="Planned" />
        </InsightPanel>
      </div>

      <div className="mt-6">
        <EmptyState title="Tax management center is ready" description="Connect your data sources to surface projections, tax risk, deductions and reports in one place." icon={Landmark} />
      </div>
    </TaxLayout>
  );
}
