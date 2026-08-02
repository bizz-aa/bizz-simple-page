import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  ShoppingCart, Package, FileText, Users, Home, BarChart3, Camera, Landmark, MoreHorizontal, X, Shield,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import sunsetBg from "@/assets/sunset-bg.jpg";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function formatTZS(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

function Dashboard() {
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: todaySales = 0 } = useQuery({
    queryKey: ["today-sales"],
    queryFn: async () => {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("sales")
        .select("total")
        .gte("created_at", start.toISOString());
      return (data ?? []).reduce((s, r: any) => s + Number(r.total ?? 0), 0);
    },
    refetchInterval: 30000,
  });

  const { data: lowStock = 0 } = useQuery({
    queryKey: ["low-stock-count-dash"],
    queryFn: async () => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .lt("stock_quantity", 5);
      return count ?? 0;
    },
  });

  const { data: recentSalesCount = 0 } = useQuery({
    queryKey: ["today-sales-count"],
    queryFn: async () => {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("sales")
        .select("*", { count: "exact", head: true })
        .gte("created_at", start.toISOString());
      return count ?? 0;
    },
    refetchInterval: 30000,
  });

  const tabs: { label: string; to: string; active?: boolean }[] = [
    { label: "SALES", to: "/m/sales" },
    { label: "INVENTORY", to: "/m/inventory" },
    { label: "FINANCE", to: "/m/finance" },
    { label: "EMPLOYEES", to: "/m/employees" },
  ];

  const quickActions = [
    { label: "New Sale", icon: ShoppingCart, onClick: () => toast.info("New Sale — coming soon") },
    { label: "Invoice", icon: FileText, onClick: () => toast.info("Invoice — coming soon") },
    { label: "Customer", icon: Users, onClick: () => toast.info("Customer — coming soon") },
    { label: "Reports", icon: BarChart3, onClick: () => navigate({ to: "/m/reports" }) },
  ] as const;

  return (
    <div
      className="relative -m-6 min-h-[calc(100vh-4rem)] overflow-hidden text-white"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(14,14,14,0.85) 0%, rgba(14,14,14,0.6) 40%, rgba(14,14,14,0.3) 70%, rgba(14,14,14,0.9) 100%), url(${sunsetBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      <style>{`
        @keyframes goldGlow {
          0%, 100% { 
            box-shadow: 0 0 40px rgba(218, 165, 32, 0.4), inset 0 0 20px rgba(218, 165, 32, 0.1);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 60px rgba(218, 165, 32, 0.6), inset 0 0 30px rgba(218, 165, 32, 0.2);
            transform: scale(1.02);
          }
        }
        .gold-ring {
          animation: goldGlow 3s ease-in-out infinite;
          background: conic-gradient(from 0deg, #8B4513, #FFD700, #DAA520, #8B4513);
        }
      `}</style>
      <div className="mx-auto w-full max-w-md px-4 pb-28 pt-3 md:max-w-7xl md:px-10 md:pb-12 md:pt-4">
        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0" />
          <div className="flex shrink-0 gap-2">
            <button className="h-9 w-9 rounded-full bg-white/10 backdrop-blur" aria-label="notifications" />
            <button className="h-9 w-9 rounded-full bg-white/10 backdrop-blur" aria-label="profile" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 grid grid-cols-4 items-center gap-1 rounded-full border border-white/10 bg-black/15 p-1 text-center text-[10px] sm:text-xs md:mt-5 md:flex md:w-full md:items-center md:justify-between md:gap-3 md:rounded-full md:border md:border-white/15 md:bg-white/10 md:px-3 md:py-2 md:backdrop-blur-xl md:text-sm">
          {tabs.map((t) =>
            t.active ? (
              <span key={t.label} className="min-w-0 truncate rounded-full border border-white/30 bg-white/20 px-2 py-2 font-semibold text-white shadow-lg shadow-white/20 backdrop-blur-xl md:flex md:flex-1 md:items-center md:justify-center md:px-4 md:py-2">
                {t.label}
              </span>
            ) : (
              <button key={t.label} onClick={() => navigate({ to: t.to as any })} className="min-w-0 truncate rounded-full px-1 py-2 font-semibold text-white/55 hover:text-white/80 md:flex md:flex-1 md:items-center md:justify-center md:px-4 md:py-2 md:font-normal">
                {t.label}
              </button>
            )
          )}
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-10 md:items-start">
          {/* Circular ring */}
          <div className="mt-5 md:mt-6 flex justify-center">
            <div className="relative grid h-56 w-56 md:h-72 md:w-72 place-items-center">
              <div className="gold-ring absolute inset-0 rounded-full border-[6px]" />
              <div className="absolute inset-6 rounded-full border border-white/10 bg-black/60 backdrop-blur" />
              <div className="relative text-center">
                <p className="text-xs uppercase tracking-widest text-white/50">Today Sales</p>
                <p className="mt-2 font-display text-2xl font-bold">TZS</p>
                <p className="font-display text-3xl md:text-4xl font-bold text-yellow-400">{formatTZS(Number(todaySales))}</p>
              </div>
            </div>
          </div>

          <div>
            {/* Indicators */}
            <div className="mt-6 md:mt-8 grid grid-cols-3 text-center text-xs md:text-sm">
              <div>
                <p className="text-white/60">Stock</p>
                <p className="mt-1 font-semibold text-white">{lowStock} low</p>
              </div>
              <div>
                <p className="text-white/60">Sales</p>
                <p className="mt-1 font-semibold text-white">{recentSalesCount}</p>
              </div>
              <div>
                <p className="text-white/60">Expenses</p>
                <p className="mt-1 font-semibold text-white">—</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-4 gap-2 md:gap-5">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className="flex min-w-0 flex-col items-center gap-2 md:gap-3"
                >
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-400/15 backdrop-blur transition hover:bg-amber-400/25 sm:h-16 sm:w-16 md:h-20 md:w-20">
                    <a.icon className="h-6 w-6 md:h-8 md:w-8 text-amber-400" />
                  </div>
                  <span className="max-w-full truncate text-[10px] text-white/70 sm:text-[11px] md:text-xs">{a.label}</span>
                </button>
              ))}
            </div>

            {/* Recent activity card */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <h3 className="font-display text-base md:text-lg font-bold text-white">Recent Activity</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>• {recentSalesCount} Sales Completed today</li>
                <li>• {lowStock} Low Stock Alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden camera input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) toast.success(`Picha imepigwa: ${file.name}`);
          e.target.value = "";
        }}
      />

      {/* Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/70 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <BottomBtn label="Home" active icon={Home} onClick={() => navigate({ to: "/dashboard" })} />
          <BottomBtn label="Stock" icon={Package} onClick={() => toast.info("Stock — coming soon")} />
          <BottomBtn label="Add" icon={Camera} big onClick={() => fileRef.current?.click()} />
          <BottomBtn label="Tax" icon={Landmark} onClick={() => navigate({ to: "/m/tax" })} />
          <BottomBtn label="More" icon={MoreHorizontal} onClick={() => setMoreOpen(true)} />
        </div>
      </nav>

      {/* More bottom sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute inset-x-0 bottom-0 flex h-[75vh] flex-col rounded-t-3xl border-t border-white/10 bg-neutral-900 p-5 pb-8 animate-in slide-in-from-bottom duration-300 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">More</h3>
              <button onClick={() => setMoreOpen(false)} className="rounded-full bg-white/10 p-1.5">
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => { setMoreOpen(false); navigate({ to: "/m/admin" }); }}
                className="flex w-full items-center gap-3 rounded-2xl bg-white/5 p-4 text-left hover:bg-white/10"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400/15">
                  <Shield className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Administration</p>
                  <p className="text-xs text-white/60">Users, roles, settings</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
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
