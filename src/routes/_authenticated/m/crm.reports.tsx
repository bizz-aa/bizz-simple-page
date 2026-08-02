import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, MapPin, Megaphone } from "lucide-react";
import { CrmShell, GlassCard } from "@/components/crm/crm-shell";
import { money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/m/crm/reports")({ component: ReportsPage });

const REPORTS = [
  { key: "growth", label: "Customer Growth", icon: TrendingUp },
  { key: "sales", label: "Sales by Customer", icon: Users },
  { key: "location", label: "Location Analysis", icon: MapPin },
  { key: "marketing", label: "Marketing Reports", icon: Megaphone },
] as const;

function ReportsPage() {
  const [active, setActive] = useState<(typeof REPORTS)[number]["key"]>("growth");
  const [days, setDays] = useState(90);

  const { data: customers = [] } = useQuery({
    queryKey: ["rep-customers"],
    queryFn: async () => (await supabase.from("customers").select("id,name,location,created_at")).data ?? [],
  });
  const { data: sales = [] } = useQuery({
    queryKey: ["rep-sales"],
    queryFn: async () => (await supabase.from("sales").select("id,customer_id,total,created_at,status").eq("status", "completed")).data ?? [],
  });
  const { data: campaigns = [] } = useQuery({
    queryKey: ["rep-campaigns"],
    queryFn: async () => (await supabase.from("marketing_campaigns").select("*")).data ?? [],
  });

  const from = Date.now() - days * 86400_000;

  const growth = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const c of customers as any[]) {
      const d = new Date(c.created_at);
      if (d.getTime() < from) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return Array.from(buckets.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [customers, from]);

  const salesBy = useMemo(() => {
    const map = new Map<string, { name: string; total: number; orders: number }>();
    const nameOf = new Map((customers as any[]).map((c) => [c.id, c.name]));
    for (const s of sales as any[]) {
      if (!s.customer_id) continue;
      if (new Date(s.created_at).getTime() < from) continue;
      const cur = map.get(s.customer_id) ?? { name: nameOf.get(s.customer_id) ?? "Unknown", total: 0, orders: 0 };
      cur.total += Number(s.total || 0);
      cur.orders += 1;
      map.set(s.customer_id, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 20);
  }, [sales, customers, from]);

  const byLocation = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of customers as any[]) {
      const key = (c.location || "Unknown").trim() || "Unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [customers]);

  return (
    <CrmShell
      title="Reports"
      subtitle="Growth, sales, location & marketing"
      action={
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full md:w-auto rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last 365 days</option>
        </select>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {REPORTS.map((r) => (
          <button
            key={r.key}
            onClick={() => setActive(r.key)}
            className={`rounded-2xl border p-4 text-left backdrop-blur transition ${active === r.key ? "border-amber-400/60 bg-amber-400/15 shadow-lg shadow-amber-500/10" : "border-white/15 bg-white/[0.06] hover:bg-white/10"}`}
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/15">
              <r.icon className="h-5 w-5 text-amber-400" />
            </div>
            <p className="mt-3 text-sm font-semibold leading-tight">{r.label}</p>
          </button>
        ))}
      </div>

      <GlassCard className="mt-4 p-5">
        {active === "growth" && (
          <>
            <h3 className="font-display text-lg font-bold">Customer Growth</h3>
            <div className="mt-3 space-y-2">
              {growth.length === 0 && <p className="text-sm text-white/60">No new customers in this period.</p>}
              {growth.map(([month, count]) => (
                <div key={month} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-white/70">{month}</div>
                  <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, count * 10)}%` }} />
                  </div>
                  <div className="w-10 text-right text-sm font-semibold">{count}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {active === "sales" && (
          <>
            <h3 className="font-display text-lg font-bold">Top Customers by Sales</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-white/60">
                  <tr><th className="py-2">Customer</th><th>Orders</th><th className="text-right">Revenue</th></tr>
                </thead>
                <tbody>
                  {salesBy.length === 0 && <tr><td colSpan={3} className="py-4 text-white/60">No sales in this period.</td></tr>}
                  {salesBy.map((r, i) => (
                    <tr key={i} className="border-t border-white/10">
                      <td className="py-2">{r.name}</td>
                      <td>{r.orders}</td>
                      <td className="text-right font-semibold">{money(r.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {active === "location" && (
          <>
            <h3 className="font-display text-lg font-bold">Customers by Location</h3>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {byLocation.map(([loc, count]) => (
                <div key={loc} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <span>{loc}</span><span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {active === "marketing" && (
          <>
            <h3 className="font-display text-lg font-bold">Marketing Campaigns</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-white/60">
                  <tr><th className="py-2">Campaign</th><th>Channel</th><th>Status</th><th className="text-right">Budget</th></tr>
                </thead>
                <tbody>
                  {campaigns.length === 0 && <tr><td colSpan={4} className="py-4 text-white/60">No campaigns yet.</td></tr>}
                  {(campaigns as any[]).map((c) => (
                    <tr key={c.id} className="border-t border-white/10">
                      <td className="py-2">{c.name}</td><td>{c.channel}</td><td>{c.status}</td>
                      <td className="text-right font-semibold">{money(c.budget)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </GlassCard>
    </CrmShell>
  );
}
