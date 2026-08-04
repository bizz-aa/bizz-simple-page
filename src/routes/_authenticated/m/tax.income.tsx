import { createFileRoute } from "@tanstack/react-router";
import { Coins, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { InsightPanel, ProgressBar, StatusPill } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax/income")({ component: IncomeTaxHub });

function IncomeTaxHub() {
  const { metrics } = useTaxModule();
  const [projectedAnnualProfit, setProjectedAnnualProfit] = useState<number>(metrics.currentProfit);
  const [taxRate, setTaxRate] = useState<number>(30);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const actualProfit = metrics.currentProfit;
  const completion = Math.min(100, Math.max(0, Math.round((actualProfit / Math.max(1, projectedAnnualProfit)) * 100)));
  const estimatedTax = projectedAnnualProfit * (taxRate / 100);
  const currentTrend = Math.round(projectedAnnualProfit * (1 + Math.max(0.1, completion / 100)));
  const expectedTax = currentTrend * (taxRate / 100);
  const taxDifference = expectedTax - estimatedTax;

  const riskState =
    taxDifference > estimatedTax * 0.2
      ? { label: "HIGH RISK", tone: "rose" as const, bar: "from-rose-500 to-orange-400", text: "text-rose-200" }
      : taxDifference > estimatedTax * 0.08
        ? { label: "WARNING", tone: "amber" as const, bar: "from-amber-400 to-amber-300", text: "text-amber-200" }
        : { label: "SAFE", tone: "emerald" as const, bar: "from-emerald-400 to-emerald-300", text: "text-emerald-200" };

  return (
    <TaxLayout
      title="Income Tax"
      subtitle="Live view of tax health, risk and forecast"
      headerIcon={Coins}
      backTo="/m/tax"
      showBottomNav={false}
      cards={[
        { label: "Projected Profit", icon: TrendingUp, onClick: () => setIsDrawerOpen(true) },
      ]}
      sections={[]}
    >
      <div className="mt-8">
        <InsightPanel title="Income Tax Snapshot" icon={Coins} tone="slate" action={<StatusPill label={riskState.label} tone={riskState.tone} />}>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Projected Annual Profit</p>
                <p className="mt-2 font-display text-3xl font-semibold text-white">{formatCurrency(projectedAnnualProfit)}</p>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">
                {completion}% completed
              </div>
            </div>

            <div className="mt-4 h-2.5 rounded-full bg-white/10">
              <div className={`h-2.5 rounded-full bg-gradient-to-r ${riskState.bar}`} style={{ width: `${completion}%` }} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Actual Profit</p>
                <p className="mt-2 font-display text-2xl font-semibold text-white">{formatCurrency(actualProfit)}</p>
                <p className="mt-1 text-sm text-white/65">Current business performance</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Estimated Income Tax ({taxRate}%)</p>
                <p className="mt-2 font-display text-2xl font-semibold text-white">{formatCurrency(estimatedTax)}</p>
                <p className="mt-1 text-sm text-white/65">Risk level is {riskState.label.toLowerCase()}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <ProgressBar label="Completion against projection" value={completion} tone="emerald" />
          </div>
        </InsightPanel>
      </div>

      <div className="mt-6">
        <InsightPanel title="Intelligence Message" icon={AlertTriangle} tone="slate">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/10 text-lg text-white/80">
                ⚠
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Projected annual profit {formatCurrency(projectedAnnualProfit)}</p>
                <p className="mt-1 text-sm text-white/70">Current trend shows {formatCurrency(currentTrend)}</p>
                <p className="mt-1 text-sm text-white/70">Estimated tax will increase by {formatCurrency(Math.abs(taxDifference))}</p>
              </div>
            </div>
          </div>
        </InsightPanel>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="mx-auto max-w-xl rounded-t-3xl rounded-b-3xl bg-background text-foreground sm:mx-4 sm:my-6 sm:max-h-[85vh] sm:overflow-y-auto sm:rounded-3xl">
          <DrawerHeader className="px-4 pb-2 pt-4 text-left">
            <DrawerTitle className="text-foreground">Input Business Data</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">Adjust the tax rate. Profit values are derived automatically from your records.</DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4 px-4 pb-6">
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Auto-calculated profit</p>
              <p className="mt-1">Actual profit is calculated from EFD sales minus purchases, expenses, and asset depreciation.</p>
            </div>
            <label className="block text-sm text-muted-foreground">
              <span className="mb-1 block text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80">Projected annual profit</span>
              <input
                type="number"
                value={projectedAnnualProfit}
                onChange={(event) => setProjectedAnnualProfit(Number(event.target.value))}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-foreground outline-none ring-0"
              />
            </label>
            <label className="block text-sm text-muted-foreground">
              <span className="mb-1 block text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80">Tax rate (%)</span>
              <input
                type="number"
                value={taxRate}
                onChange={(event) => setTaxRate(Number(event.target.value))}
                className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-foreground outline-none ring-0"
              />
            </label>
            <DrawerClose asChild>
              <button className="w-full rounded-2xl bg-primary px-4 py-2 font-semibold text-primary-foreground">
                Save changes
              </button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </TaxLayout>
  );
}
