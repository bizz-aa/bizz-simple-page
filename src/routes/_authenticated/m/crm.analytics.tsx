import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CrmShell, GlassCard } from "@/components/crm/crm-shell";
import { money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/m/crm/analytics")({ component: AnalyticsPage });

const RANGES = [
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "365 days", days: 365 },
];

function AnalyticsPage() {
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

  const cards = [
    { label: "Total Customers", value: String(stats.total) },
    { label: "New (period)", value: String(stats.newInRange) },
    { label: "Growth", value: `${stats.growth.toFixed(1)}%` },
    { label: "Acquisition/day", value: String(stats.acquisition) },
    { label: "Conversion", value: `${stats.conversion.toFixed(1)}%` },
    { label: "Retention", value: `${stats.retention.toFixed(1)}%` },
    { label: "Lifetime Value", value: money(stats.clv) },
    { label: "Purchase Frequency", value: stats.freq.toFixed(2) },
    { label: "Orders", value: String(stats.orders) },
    { label: "Revenue", value: money(stats.revenue) },
  ];

  return (
    <CrmShell
      title="Analytics"
      subtitle={`Last ${days} days performance`}
      action={
        <div className="flex w-full md:w-auto gap-1 rounded-2xl border border-white/20 bg-white/5 p-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`flex-1 md:flex-none rounded-xl px-3 py-1.5 text-xs font-semibold transition ${days === r.days ? "bg-amber-500 text-black shadow" : "text-white/70 hover:text-white"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <GlassCard key={c.label} className="p-4">
            <p className="text-[10px] md:text-[11px] uppercase tracking-wider text-white/60 leading-tight">{c.label}</p>
            <p className="mt-2 font-display text-xl md:text-2xl font-bold leading-tight break-words">{c.value}</p>
          </GlassCard>
        ))}
      </div>
    </CrmShell>
  );
}
