import { createFileRoute } from "@tanstack/react-router";
import {
  Landmark, ShoppingCart, ShoppingBag, Receipt, Percent,
  Coins, HandCoins, Building2, FolderArchive, Upload, BarChart3,
  CalendarDays, AlertTriangle, Activity, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax")({ component: TaxHub });

function TaxHub() {
  return (
    <TaxLayout
      title="Tax Management"
      subtitle="Independent tax records & compliance"
      headerIcon={Landmark}
      cards={[
        { label: "Tax Sales", icon: ShoppingCart, to: "/m/tax/sales" },
        { label: "Tax Purchases", icon: ShoppingBag, to: "/m/tax/purchases" },
        { label: "Tax Expenses", icon: Receipt, to: "/m/tax/expenses" },
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
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Output VAT", value: "TZS 0" },
          { label: "Input VAT", value: "TZS 0" },
          { label: "Net VAT", value: "TZS 0" },
          { label: "Filings Due", value: "0" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/60">{s.label}</p>
            <p className="mt-1 font-display text-lg font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => toast.info("Tax Overview — coming soon")}
        className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white/15 backdrop-blur-xl p-5 text-left transition hover:scale-[1.02] hover:bg-white/25 border border-white/30"
      >
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-amber-300/30 bg-amber-400/15 backdrop-blur">
          <BarChart3 className="h-6 w-6 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-white">Tax Overview</h3>
          <p className="text-xs text-white/70">Consolidated tax position &amp; obligations</p>
        </div>
        <ChevronRight className="h-5 w-5 text-white/60" />
      </button>
    </TaxLayout>
  );
}
