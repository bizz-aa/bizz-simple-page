import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft, Users, UserPlus, TrendingUp, UserSearch, Filter, RotateCcw,
  Coins, ShoppingBag, ClipboardList, Wallet, MoreVertical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/m/crm/analytics")({ component: AnalyticsPage });

const RANGES = [
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "365 days", days: 365 },
];

function AnalyticsPage() {
  const navigate = useNavigate();
  const [days, setDays] = useState(30);

  const { data: customers = [] } = useQuery({
    queryKey: ["crm-analytics-customers"],
    queryFn: async () => (await supabase.from("customers").select("id,created_at")).data ?? [],
  });
  const { data: sales = [] } = useQuery({
    queryKey: ["crm-analytics-sales"],
    queryFn: async () => (await supabase.from("sales").select("customer_id,total,created_at,status").eq("status", "completed")).data ?? [],
  });

  const stats = useMemo(() => {
    const now = Date.now();
    const from = now - days * 86400_000;
    const total = customers.length;
    const newInRange = customers.filter((c: any) => new Date(c.created_at).getTime() >= from).length;
    const salesInRange = (sales as any[]).filter((s) => new Date(s.created_at).getTime() >= from);
    const revenue = salesInRange.reduce((a, s) => a + Number(s.total || 0), 0);
    const uniqueBuyers = new Set(salesInRange.map((s) => s.customer_id).filter(Boolean)).size;
    const orders = salesInRange.length;
    const clv = uniqueBuyers > 0 ? revenue / uniqueBuyers : 0;
    const freq = uniqueBuyers > 0 ? orders / uniqueBuyers : 0;
    const acquisition = days > 0 ? (newInRange / days).toFixed(2) : "0";
    const conversion = total > 0 ? (uniqueBuyers / total) * 100 : 0;
    const priorFrom = now - days * 2 * 86400_000;
    const priorBuyers = new Set((sales as any[]).filter((s) => {
      const t = new Date(s.created_at).getTime();
      return t >= priorFrom && t < from;
    }).map((s) => s.customer_id).filter(Boolean));
    const retention = priorBuyers.size > 0
      ? (Array.from(priorBuyers).filter((id) => salesInRange.some((s) => s.customer_id === id)).length / priorBuyers.size) * 100
      : 0;
    const priorNew = customers.filter((c: any) => {
      const t = new Date(c.created_at).getTime();
      return t >= priorFrom && t < from;
    }).length;
    const growth = priorNew > 0 ? ((newInRange - priorNew) / priorNew) * 100 : newInRange > 0 ? 100 : 0;
    return { total, newInRange, growth, clv, freq, acquisition, conversion, retention, orders, revenue };
  }, [customers, sales, days]);

  const cards: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Total Customers", value: String(stats.total), icon: Users },
    { label: "New (period)", value: String(stats.newInRange), icon: UserPlus },
    { label: "Growth", value: `${stats.growth.toFixed(1)}%`, icon: TrendingUp },
    { label: "Acquisition/day", value: String(stats.acquisition), icon: UserSearch },
    { label: "Conversion", value: `${stats.conversion.toFixed(1)}%`, icon: Filter },
    { label: "Retention", value: `${stats.retention.toFixed(1)}%`, icon: RotateCcw },
    { label: "Lifetime Value", value: money(stats.clv), icon: Coins },
    { label: "Purchase Frequency", value: stats.freq.toFixed(2), icon: ShoppingBag },
    { label: "Orders", value: String(stats.orders), icon: ClipboardList },
    { label: "Revenue", value: money(stats.revenue), icon: Wallet },
  ];

  const summary = [
    { label: "New Customers", value: String(stats.newInRange), icon: Users },
    { label: "Orders", value: String(stats.orders), icon: ClipboardList },
    { label: "Revenue (TZS)", value: String(Math.round(stats.revenue)), icon: Wallet },
  ];

  const trendDays = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="relative -m-6 min-h-[calc(100vh-4.5rem)] bg-[#0a0a0a] px-4 pb-12 pt-4 text-white md:px-8 md:pt-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate({ to: "/m/crm" })}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 transition hover:bg-white/10"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-[26px]">Analytics</h2>
            <p className="mt-0.5 text-xs text-white/55 md:text-sm">Last {days} days performance</p>
          </div>
        </div>
        <div className="flex gap-1 rounded-full bg-white/[0.04] p-1 md:ml-auto">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`flex-1 rounded-full px-4 py-1.5 text-xs font-semibold transition md:flex-none ${
                days === r.days ? "bg-amber-400 text-black" : "text-white/65 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics panel */}
      <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4 md:p-6">
        <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4 md:gap-x-8">
          {cards.map((c, i) => (
            <div
              key={c.label}
              className={`flex items-start gap-3 md:px-2 ${i % 4 !== 0 ? "md:border-l md:border-white/8 md:pl-6" : ""}`}
            >
              <c.icon className="mt-1 h-5 w-5 shrink-0 text-amber-400/90" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-white/50">{c.label}</p>
                <p className="mt-1 font-display text-xl font-bold leading-tight text-white md:text-2xl">{c.value}</p>
                <p className="mt-1 text-[11px] text-white/35">— 0%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend + Summary */}
      <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">Performance Trend</h3>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs text-white/70">Daily</span>
              <MoreVertical className="h-4 w-4 text-white/40" />
            </div>
          </div>
          <div className="mt-5 flex gap-5">
            <ul className="space-y-3 text-xs text-white/65">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" />New Customers</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-400" />Orders</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Revenue (TZS)</li>
            </ul>
            <div className="relative min-w-0 flex-1">
              <div className="space-y-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-dashed border-white/8" />
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between">
                {trendDays.map((d) => (
                  <span key={d} className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-white/35">
            {["May 02", "May 06", "May 10", "May 14", "May 18", "May 22", "May 26", "May 30"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <h3 className="font-display text-base font-bold text-white">Summary</h3>
          <div className="mt-4 space-y-3">
            {summary.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-400/10">
                  <s.icon className="h-4 w-4 text-amber-400" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-white/60">{s.label}</p>
                  <p className="font-display text-lg font-bold text-white">{s.value}</p>
                </div>
                <span className="text-[11px] text-white/35">— 0%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
