import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Package, Tags, Truck, ShoppingBag, ArrowLeftRight, Warehouse,
  Home, ShoppingCart, Scan, MoreHorizontal, ChevronRight, BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import sunsetBg from "@/assets/sunset-bg.jpg";

export const Route = createFileRoute("/_authenticated/m/inventory")({ component: InventoryHub });

function InventoryHub() {
  const navigate = useNavigate();

  const cards = [
    { label: "Products", icon: Package, onClick: () => toast.info("Products — coming soon") },
    { label: "Stock", icon: Warehouse, onClick: () => toast.info("Stock — coming soon") },
    { label: "Suppliers", icon: Truck, onClick: () => toast.info("Suppliers — coming soon") },
    { label: "Purchases", icon: ShoppingBag, onClick: () => toast.info("Purchases — coming soon") },
  ];

  const moreItems = [
    { label: "Categories", icon: Tags, onClick: () => toast.info("Categories — coming soon") },
    { label: "Stock Movement", icon: ArrowLeftRight, onClick: () => toast.info("Stock Movement — coming soon") },
    { label: "Transfers", icon: Truck, onClick: () => toast.info("Transfers — coming soon") },
    { label: "Warehouses", icon: Warehouse, onClick: () => toast.info("Warehouses — coming soon") },
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
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Inventory</h1>
            <p className="text-sm text-white/80">Track products and stock</p>
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

        {/* Operations Section - Glass */}
        <div className="mt-8 rounded-3xl border border-white/30 bg-white/10 backdrop-blur-xl p-5">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur">
              <ArrowLeftRight className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-display text-lg font-bold text-white">Operations</h2>
          </div>
          <div className="mt-3 h-px bg-white/20" />
          <ul className="mt-2 divide-y divide-white/20">
            {moreItems.map((t) => (
              <li key={t.label}>
                <button
                  onClick={t.onClick}
                  className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-white/10"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400/15 backdrop-blur">
                    <t.icon className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="flex-1 text-[15px] text-white font-medium">{t.label}</span>
                  <ChevronRight className="h-4 w-4 text-white/60" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Stock Overview Card - Glass */}
        <button
          onClick={() => toast.info("Stock Overview — coming soon")}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white/15 backdrop-blur-xl p-5 text-left transition hover:scale-[1.02] hover:bg-white/25 border border-white/30"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-amber-300/30 bg-amber-400/15 backdrop-blur">
            <BarChart3 className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-white">Stock Overview</h3>
            <p className="text-xs text-white/70">Live stock levels &amp; low-stock alerts</p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/60" />
        </button>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/20 bg-black/40 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <BottomBtn label="Home" icon={Home} onClick={() => navigate({ to: "/dashboard" })} />
          <BottomBtn label="Sales" icon={ShoppingCart} onClick={() => navigate({ to: "/m/sales" })} />
          <BottomBtn label="Scan" icon={Scan} big onClick={() => navigate({ to: "/pos" })} />
          <BottomBtn label="Stock" icon={Package} active onClick={() => navigate({ to: "/m/inventory" })} />
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
