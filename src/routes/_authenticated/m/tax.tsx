import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Landmark, ShoppingCart, ShoppingBag, Receipt, Percent, Coins, HandCoins,
  Building2, FolderArchive, Upload, BarChart3, ChevronRight,
} from "lucide-react";
import { TaxModuleProvider, useTaxModule } from "@/components/tax-module-provider";
import { TaxBottomNav } from "@/components/tax/tax-workspace";

export const Route = createFileRoute("/_authenticated/m/tax")({ component: TaxHub });

const WORKSPACES = [
  { label: "EFD Sales", icon: ShoppingCart, to: "/m/tax/sales", hint: "Taxable sales & VAT" },
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
  useTaxModule();

  const cards = [
    { label: "EFD Sales", icon: ShoppingCart, to: "/m/tax/sales" },
    { label: "Purchases", icon: ShoppingBag, to: "/m/tax/purchases" },
    { label: "Expenses", icon: Receipt, to: "/m/tax/expenses" },
    { label: "VAT", icon: Percent, to: "/m/tax/vat" },
  ];

  const moreItems = [
    { label: "Income Tax", icon: Coins, to: "/m/tax/income" },
    { label: "Withholding Tax", icon: HandCoins, to: "/m/tax/withholding" },
    { label: "Capital Assets", icon: Building2, to: "/m/tax/assets" },
    { label: "Documents", icon: FolderArchive, to: "/m/tax/documents" },
    { label: "Import Center", icon: Upload, to: "/m/tax/import" },
    { label: "Tax Reports", icon: BarChart3, to: "/m/tax/reports" },
  ];

  return (
    <div className="mx-auto max-w-md px-5 pb-28 pt-6 text-white md:max-w-6xl md:px-10 md:pb-12 md:pt-10">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl">
          <Landmark className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Tax Management</h1>
          <p className="text-sm text-white/80">Track filings, tax records and compliance</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-4 md:gap-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="group flex flex-col items-center gap-3 transition hover:scale-110 md:gap-4"
          >
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-amber-300/30 bg-amber-400/15 backdrop-blur-xl transition group-hover:bg-amber-400/25 group-hover:shadow-lg group-hover:shadow-amber-400/20 md:h-28 md:w-28 md:rounded-3xl">
              <card.icon className="h-6 w-6 text-amber-400 md:h-10 md:w-10" />
            </div>
            <span className="text-center text-[11px] font-semibold text-white md:text-sm">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-white/30 bg-white/10 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-display text-lg font-bold text-white">More Options</h2>
        </div>
        <div className="mt-3 h-px bg-white/20" />
        <ul className="mt-2 divide-y divide-white/20">
          {moreItems.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-white/10">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400/15 backdrop-blur">
                  <item.icon className="h-4 w-4 text-amber-400" />
                </div>
                <span className="flex-1 text-[15px] font-medium text-white">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-white/60" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/m/tax/reports" className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-white/30 bg-white/15 p-5 text-left transition hover:scale-[1.02] hover:bg-white/25">
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-amber-300/30 bg-amber-400/15 backdrop-blur">
          <BarChart3 className="h-6 w-6 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-white">Tax Reports</h3>
          <p className="text-xs text-white/70">Compliance position, filings and export views</p>
        </div>
        <ChevronRight className="h-5 w-5 text-white/60" />
      </Link>
    </div>
  );
}
