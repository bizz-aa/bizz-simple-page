import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Landmark, Receipt, CreditCard, ArrowLeftRight,
  Home, ShoppingCart, Scan, Package, MoreHorizontal, Wallet,
  BarChart3, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/m/finance")({ component: FinanceHub });

function FinanceHub() {
  const navigate = useNavigate();

  const cards = [
    { label: "Accounts", icon: Landmark, onClick: () => toast.info("Accounts — coming soon") },
    { label: "Expenses", icon: Receipt, onClick: () => toast.info("Expenses — coming soon") },
    { label: "Payments", icon: CreditCard, onClick: () => toast.info("Payments — coming soon") },
    { label: "Transfers", icon: ArrowLeftRight, onClick: () => toast.info("Transfers — coming soon") },
  ];


  return (
    <div
      className="relative -m-6 min-h-[calc(100vh-4rem)] overflow-hidden text-white"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(14,14,14,0.85) 0%, rgba(14,14,14,0.6) 40%, rgba(14,14,14,0.3) 70%, rgba(14,14,14,0.9) 100%), url(${sunsetBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      <div className="mx-auto max-w-md md:max-w-6xl px-5 md:px-10 pb-28 md:pb-12 pt-6 md:pt-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Finance</h1>
            <p className="text-sm text-white/80">Business financial management</p>
          </div>
        </div>

        {/* Main Cards - Icon Only - Glass Effect */}
        <div className="mt-8 md:mt-12 grid grid-cols-4 gap-4 md:gap-8">
          {cards.map((c) => (
            <button
              key={c.label}
              onClick={c.onClick}
              className="group flex flex-col items-center gap-3 md:gap-4 transition hover:scale-110"
            >
              <div className="grid h-16 w-16 md:h-28 md:w-28 place-items-center rounded-2xl md:rounded-3xl border border-amber-300/30 bg-amber-400/15 backdrop-blur-xl transition group-hover:bg-amber-400/25 group-hover:shadow-lg group-hover:shadow-amber-400/20">
                <c.icon className="h-6 w-6 md:h-10 md:w-10 text-amber-400" />
              </div>
              <span className="text-center text-[11px] md:text-sm font-semibold text-white">{c.label}</span>
            </button>
          ))}
        </div>




        {/* Financial Reports - Glass */}
        <button
          onClick={() => navigate({ to: "/m/reports" })}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white/15 backdrop-blur-xl p-5 text-left transition hover:scale-[1.02] hover:bg-white/25 border border-white/30"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-amber-300/30 bg-amber-400/15 backdrop-blur">
            <BarChart3 className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-white">Financial Reports</h3>
            <p className="text-xs text-white/70">Revenue, profit &amp; loss, analytics</p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/60" />
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/20 bg-black/40 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <BottomBtn label="Home" icon={Home} onClick={() => navigate({ to: "/dashboard" })} />
          <BottomBtn label="Sales" icon={ShoppingCart} onClick={() => navigate({ to: "/m/sales" })} />
          <BottomBtn label="Scan" icon={Scan} big onClick={() => navigate({ to: "/pos" })} />
          <BottomBtn label="Stock" icon={Package} onClick={() => navigate({ to: "/m/inventory" })} />
          <BottomBtn label="More" icon={MoreHorizontal} onClick={() => navigate({ to: "/m/admin" })} />
        </div>
      </nav>
    </div>
  );
}

function BottomBtn({
  label, icon: Icon, active, big, onClick,
}: { label: string; icon: any; active?: boolean; big?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <span
        className={`grid place-items-center rounded-full transition ${
          big ? "h-14 w-14 -mt-6 shadow-lg shadow-amber-500/40" : "h-10 w-10"
        } ${active || big ? "bg-amber-500 text-white" : "bg-white/10 text-white/70"}`}
      >
        <Icon className={big ? "h-6 w-6" : "h-5 w-5"} />
      </span>
      <span className={`text-[10px] ${active ? "text-white" : "text-white/60"}`}>{label}</span>
    </button>
  );
}
