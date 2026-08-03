import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Landmark, ShoppingCart, ShoppingBag, Receipt, Percent, Coins, HandCoins,
  Building2, FolderArchive, Upload, BarChart3, ShieldCheck, AlertTriangle,
} from "lucide-react";
import { TaxModuleProvider, formatCurrency, useTaxModule } from "@/components/tax-module-provider";
import { SummaryStrip, RelatedList, StatusBadge, TaxBottomNav } from "@/components/tax/tax-workspace";

export const Route = createFileRoute("/_authenticated/m/tax")({ component: TaxHub });

const WORKSPACES = [
  { label: "Tax Sales", icon: ShoppingCart, to: "/m/tax/sales", hint: "Taxable sales & VAT" },
  { label: "Purchases", icon: ShoppingBag, to: "/m/tax/purchases", hint: "Suppliers & deductions" },
  { label: "Expenses", icon: Receipt, to: "/m/tax/expenses", hint: "Deductible spending" },
  { label: "VAT", icon: Percent, to: "/m/tax/vat", hint: "Returns & balance" },
  { label: "Income Tax", icon: Coins, to: "/m/tax/income", hint: "Profit & 30% tax" },
  { label: "Withholding Tax", icon: HandCoins, to: "/m/tax/withholding", hint: "Certificates" },
  { label: "Capital Assets", icon: Building2, to: "/m/tax/assets", hint: "Depreciation" },
  { label: "Document Center", icon: FolderArchive, to: "/m/tax/documents", hint: "Tax archive" },
  { label: "Import Center", icon: Upload, to: "/m/tax/import", hint: "Excel & CSV" },
  { label: "Tax Reports", icon: BarChart3, to: "/m/tax/reports", hint: "Export & print" },
];

function TaxHub() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isNested = pathname !== "/m/tax" && pathname.startsWith("/m/tax/");

  return (
    <TaxModuleProvider>
      <div className="-m-6 min-h-[calc(100vh-4rem)] px-5 pb-28 pt-6 text-white md:px-10 md:pt-8 lg:pb-10">
        {isNested ? <Outlet /> : <TaxOverview />}
      </div>
      <TaxBottomNav />
    </TaxModuleProvider>
  );
}

function TaxOverview() {
  const { metrics, vatReturns, documents, sales, expenses } = useTaxModule();
  const openReturns = vatReturns.filter((item) => item.status !== "Filed");
  const pendingDocs = documents.filter((item) => item.status === "Pending");

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-amber-300/30 bg-amber-400/15">
            <Landmark className="h-5 w-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl">Tax Management</h1>
            <p className="truncate text-sm text-white/60">Independent tax records, compliance and filing</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge value={`${metrics.riskLevel} risk`} />
        </div>
      </header>

      <div className="mt-6 space-y-6">
        <SummaryStrip
          items={[
            { label: "Estimated Tax", value: formatCurrency(metrics.estimatedTax), hint: "30% of projected profit", accent: true },
            { label: "VAT Payable", value: formatCurrency(metrics.vatPayable), hint: `${openReturns.length} return(s) open` },
            { label: "Current Profit", value: formatCurrency(metrics.currentProfit), hint: "After deductions" },
            { label: "Compliance", value: `${metrics.complianceScore}%`, hint: `${metrics.riskLevel} risk level` },
          ]}
        />

        <section>
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Workspaces</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {WORKSPACES.map((workspace) => (
              <Link
                key={workspace.label}
                to={workspace.to}
                className="group rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-amber-400/10"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-300/25 bg-amber-400/15">
                  <workspace.icon className="h-5 w-5 text-amber-400" />
                </span>
                <p className="mt-3 truncate text-sm font-semibold text-white">{workspace.label}</p>
                <p className="truncate text-xs text-white/50">{workspace.hint}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <RelatedList
            title="Needs attention"
            items={[
              { label: "VAT returns not filed", value: String(openReturns.length), icon: AlertTriangle, to: "/m/tax/vat" },
              { label: "Documents pending review", value: String(pendingDocs.length), icon: FolderArchive, to: "/m/tax/documents" },
              { label: "Expenses without receipt", value: String(expenses.filter((item) => !item.receipt).length), icon: Receipt, to: "/m/tax/expenses" },
            ]}
          />
          <RelatedList
            title="Position"
            items={[
              { label: "Output VAT", value: formatCurrency(metrics.outputVat), icon: Percent },
              { label: "Input VAT", value: formatCurrency(metrics.inputVat), icon: Percent },
              { label: "Taxable sales recorded", value: String(sales.length), icon: ShoppingCart, to: "/m/tax/sales" },
              { label: "Compliance status", value: metrics.complianceScore >= 80 ? "Healthy" : "Review", icon: ShieldCheck, to: "/m/tax/reports" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
