import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  ShoppingCart, Package, FileText, Users, Home, BarChart3, Camera, Landmark, MoreHorizontal, X, Shield,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function formatTZS(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

function Dashboard() {
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const [tab, setTab] = useState("SALES");
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: todaySales = 0 } = useQuery({
    queryKey: ["today-sales"],
    queryFn: async () => {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("sales")
        .select("total")
        .gte("created_at", start.toISOString());
      return (data ?? []).reduce((s: number, r: any) => s + Number(r.total ?? 0), 0);
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

  const tabs = [
    { label: "SALES", to: "/m/sales" },
    { label: "INVENTORY", to: "/m/inventory" },
    { label: "FINANCE", to: "/m/finance" },
    { label: "EMPLOYEES", to: "/m/employees" },
  ];

  const stats = [
    { label: "Stock", value: `${lowStock} low`, icon: Package },
    { label: "Sales", value: String(recentSalesCount), icon: ShoppingCart },
    { label: "Expenses", value: "—", icon: BarChart3 },
  ];

  const quickActions = [
    { label: "New Sale", icon: ShoppingCart, onClick: () => toast.info("New Sale — coming soon") },
    { label: "Invoice", icon: FileText, onClick: () => toast.info("Invoice — coming soon") },
    { label: "Customer", icon: Users, onClick: () => navigate({ to: "/m/crm/customers" }) },
    { label: "Reports", icon: BarChart3, onClick: () => navigate({ to: "/m/reports" }) },
  ] as const;

  return (
    <div className="relative -mx-3 -mt-6 min-h-[calc(100vh-4.5rem)] overflow-hidden text-white sm:-mx-6">
      <style>{`
        @keyframes goldSpin { to { transform: rotate(360deg); } }
        .gold-ring {
          background: conic-gradient(from 200deg, rgba(255,255,255,0.04) 0deg, #DAA520 40deg, #FFD700 150deg, #B8860B 260deg, rgba(255,255,255,0.04) 330deg);
          filter: drop-shadow(0 0 35px rgba(218,165,32,0.35));
          animation: goldSpin 14s linear infinite;
        }
      `}</style>

      <div className="mx-auto w-full max-w-md px-3 pb-28 pt-4 sm:px-4 md:max-w-6xl md:px-8 md:pb-12 md:pt-6">
        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 rounded-2xl border border-white/8 bg-white/[0.03] p-1.5 text-center text-[10px] sm:text-xs md:text-sm">
          {tabs.map((t) => {
            const active = tab === t.label;
            return (
              <button
                key={t.label}
                onClick={() => { setTab(t.label); navigate({ to: t.to as any }); }}
                className={`relative min-w-0 truncate rounded-xl border px-2 py-2.5 font-semibold tracking-wide backdrop-blur-xl transition md:py-3 ${
                  active
                    ? "border-amber-300/50 bg-amber-400/25 text-amber-300 shadow-lg shadow-amber-400/20"
                    : "border-amber-300/30 bg-amber-400/15 text-amber-400/90 hover:bg-amber-400/25"
                }`}
              >
                {t.label}
                {active && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-amber-400 shadow-[0_0_12px_2px_rgba(250,204,21,0.6)]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
          {/* Circular ring */}
          <div className="flex justify-center">
            <div className="relative grid h-48 w-48 sm:h-60 sm:w-60 md:h-72 md:w-72 place-items-center">
              <div className="gold-ring absolute inset-0 rounded-full" />
              <div className="absolute inset-[14px] rounded-full bg-[#111111]/90" />
              <div className="absolute inset-[26px] rounded-full bg-[#0d0d0d]/90 shadow-[inset_0_0_50px_rgba(218,165,32,0.15)]" />
              <div className="relative text-center">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/45">Today Sales</p>
                <p className="mt-3 font-display text-2xl font-bold text-white">TZS</p>
                <p className="font-display text-3xl font-bold text-amber-400 sm:text-4xl">{formatTZS(Number(todaySales))}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3">
                  <s.icon className="h-4 w-4 text-white/45" />
                  <p className="mt-2 text-[11px] text-white/45 md:text-xs">{s.label}</p>
                  <p className="mt-0.5 font-display text-sm font-semibold text-white/80 md:text-base">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-amber-400/40 bg-gradient-to-b from-amber-400/20 to-amber-500/[0.06] px-2 py-6 shadow-[0_6px_24px_-8px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:border-amber-400/70 hover:from-amber-400/30 hover:shadow-[0_10px_30px_-8px_rgba(250,204,21,0.6)] md:py-8"
                >
                  <a.icon className="h-8 w-8 text-amber-400 transition group-hover:scale-110 md:h-9 md:w-9" />
                  <span className="max-w-full truncate text-[11px] font-semibold text-white md:text-sm">{a.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Recent activity */}
        <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-5 md:p-6">
          <h3 className="inline-block border-b-2 border-amber-400 pb-1 font-display text-base font-bold text-white md:text-lg">
            Recent Activity
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-white/75">
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-400/10">
                <ShoppingCart className="h-4 w-4 text-amber-400" />
              </span>
              {recentSalesCount} Sales Completed today
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-400/10">
                <Package className="h-4 w-4 text-amber-400" />
              </span>
              {lowStock} Low Stock Alerts
            </li>
          </ul>
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
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/80 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <BottomBtn label="Home" active icon={Home} onClick={() => navigate({ to: "/dashboard" })} />
          <BottomBtn label="Stock" icon={Package} onClick={() => navigate({ to: "/m/inventory" })} />
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
