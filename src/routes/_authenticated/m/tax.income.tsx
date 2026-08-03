import { createFileRoute } from "@tanstack/react-router";
import { Coins, TrendingUp, Calculator, AlertTriangle, Sparkles, ShieldCheck, ChevronRight } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { EmptyState, InsightPanel, MetricCard, ProgressBar, StatusPill, TimelineItem } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax/income")({ component: IncomeTaxHub });

function IncomeTaxHub() {
  const { metrics } = useTaxModule();

  return (
    <TaxLayout
      title="Income Tax"
      subtitle="State of tax position, forecast and compliance"
      headerIcon={Coins}
      cards={[
        { label: "Projected Profit", icon: TrendingUp },
        { label: "Estimated Tax", icon: Calculator },
        { label: "Compliance", icon: ShieldCheck },
        { label: "Risk Signal", icon: AlertTriangle },
      ]}
      sections={[
        {
          title: "Core Areas",
          icon: Coins,
          items: [
            { label: "Projected Annual Profit", icon: TrendingUp },
            { label: "Estimated Income Tax", icon: Calculator },
            { label: "Compliance Status", icon: ShieldCheck },
            { label: "Business Recommendations", icon: Sparkles },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <InsightPanel title="Tax Risk Intelligence" icon={AlertTriangle} tone="amber" action={<StatusPill label={metrics.riskLevel} tone={metrics.riskLevel === "Low" ? "emerald" : metrics.riskLevel === "Medium" ? "amber" : "rose"} />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Projected Annual Profit" value={formatCurrency(metrics.projectedProfit)} hint="Versus plan" tone="emerald" />
            <MetricCard label="Estimated Income Tax" value={formatCurrency(metrics.estimatedTax)} hint="30% corporate rate applied" tone="amber" />
          </div>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            <ProgressBar label="Current year tax exposure" value={Math.round(Math.min(100, metrics.complianceScore + 5))} tone="amber" />
            <ProgressBar label="Compliance readiness" value={Math.round(metrics.complianceScore)} tone="emerald" />
          </div>
        </InsightPanel>

        <InsightPanel title="Tax Forecast" icon={Sparkles} tone="violet">
          <MetricCard label="Current Profit" value={formatCurrency(metrics.projectedProfit / 5)} hint="Month to date" tone="violet" />
          <MetricCard label="Year-end projection" value={formatCurrency(metrics.projectedProfit)} hint="Based on current records" tone="blue" />
          <MetricCard label="Tax health" value={metrics.complianceScore > 85 ? "Healthy" : "Needs review"} hint="Low exposure risk" tone="emerald" />
        </InsightPanel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <InsightPanel title="Tax Timeline" icon={ChevronRight} tone="slate">
          <TimelineItem title="Quarterly estimate due" detail="Prepare provisional tax estimate for the next reporting cycle." status="Upcoming" />
          <TimelineItem title="Annual review checkpoint" detail="Reconcile profit recognitions and deductible adjustments before close." status="Planned" />
          <TimelineItem title="Compliance review" detail="Archive supporting schedules and expense evidence for audit readiness." status="Ready" />
        </InsightPanel>

        <InsightPanel title="Recommendations" icon={ShieldCheck} tone="emerald">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
            Accelerate deductible expense validation, preserve capital allowance evidence, and review provision timing to maintain a stable tax profile.
          </div>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            Alert: projected annual profit is climbing faster than expected. Increase tax planning review in the next 30 days.
          </div>
        </InsightPanel>
      </div>

      <div className="mt-6">
        <EmptyState
          title="Income tax workspace ready"
          description="Connect your accounting data to populate projected profit, tax calculations, and compliance insights automatically."
          icon={Calculator}
        />
      </div>
    </TaxLayout>
  );
}
