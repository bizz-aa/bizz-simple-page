import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  UserRound, UserPlus, Users, Megaphone, BarChart3, Radio, FileBarChart,
  Home, Scan, Package, MoreHorizontal, ChevronRight, Landmark,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/m/crm/")({ component: CrmHub });

function CrmHub() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["crm-hub-stats"],
    queryFn: async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const [totalRes, thisMonthRes, prevMonthRes, salesRes] = await Promise.all([
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
        supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", prevStart).lt("created_at", monthStart),
        supabase.from("sales").select("total,customer_id").eq("status", "completed"),
      ]);
      const total = totalRes.count ?? 0;
      const thisMonth = thisMonthRes.count ?? 0;
      const prev = prevMonthRes.count ?? 0;
      const growth = prev > 0 ? ((thisMonth - prev) / prev) * 100 : thisMonth > 0 ? 100 : 0;
      const withCust = (salesRes.data ?? []).filter((s) => s.customer_id);
      const totalRevenue = withCust.reduce((a, s) => a + Number(s.total || 0), 0);
      const uniqueBuyers = new Set(withCust.map((s) => s.customer_id)).size;
      const avg = uniqueBuyers > 0 ? totalRevenue / uniqueBuyers : 0;
      return { total, thisMonth, growth, avg };
    },
  });

  const cards = [
    { label: "Customers", icon: Users, onClick: () => navigate({ to: "/m/crm/customers" }) },
    { label: "Channels", icon: Radio, onClick: () => navigate({ to: "/m/crm/channels" }) },
    { label: "Campaigns", icon: Megaphone, onClick: () => navigate({ to: "/m/crm/campaigns" }) },
    { label: "Analytics", icon: BarChart3, onClick: () => navigate({ to: "/m/crm/analytics" }) },
  ];

  const moreItems = [
    { label: "All Customers", icon: Users, onClick: () => navigate({ to: "/m/crm/customers" }) },
    { label: "New Customer", icon: UserPlus, onClick: () => navigate({ to: "/m/crm/customers", search: { new: 1 } as any }) },
    { label: "Customer Reports", icon: FileBarChart, onClick: () => navigate({ to: "/m/crm/reports" }) },
  ];

  const statCards = [
    { label: "Total Customers", value: String(stats?.total ?? 0) },
    { label: "New This Month", value: String(stats?.thisMonth ?? 0) },
    { label: "Growth", value: `${(stats?.growth ?? 0).toFixed(0)}%` },
    { label: "Avg Value", value: money(stats?.avg ?? 0) },
  ];

  return (
    <div
      className="relative -m-6 min-h-[calc(100vh-4rem)] overflow-hidden text-white"
    >
      <div className="mx-auto max-w-md md:max-w-6xl px-5 md:px-10 pb-28 md:pb-12 pt-6 md:pt-10">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20">
            <UserRound className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Customers & CRM</h1>
            <p className="text-sm text-white/80">Relationships & campaigns</p>
          </div>
        </div>

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

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-4">
              <p className="text-[11px] uppercase tracking-wider text-white/60">{s.label}</p>
              <p className="mt-1 font-display text-lg font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/30 bg-white/10 backdrop-blur-xl p-5">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-display text-lg font-bold text-white">More Options</h2>
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

        <button
          onClick={() => navigate({ to: "/m/crm/reports" })}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white/15 backdrop-blur-xl p-5 text-left transition hover:scale-[1.02] hover:bg-white/25 border border-white/30"
        >
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-amber-300/30 bg-amber-400/15 backdrop-blur">
            <FileBarChart className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-white">Customer Reports</h3>
            <p className="text-xs text-white/70">Growth, sales by customer, marketing</p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/60" />
        </button>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/20 bg-black/40 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <BottomBtn label="Home" icon={Home} onClick={() => navigate({ to: "/dashboard" })} />
          <BottomBtn label="Stock" icon={Package} onClick={() => navigate({ to: "/m/inventory" })} />
          <BottomBtn label="Scan" icon={Scan} big onClick={() => navigate({ to: "/pos" })} />
          <BottomBtn label="Tax" icon={Landmark} onClick={() => navigate({ to: "/m/tax" })} />
          <BottomBtn label="More" icon={MoreHorizontal} onClick={() => navigate({ to: "/m/admin" })} />
        </div>
      </nav>
    </div>
  );
}

function BottomBtn({
  label, icon: Icon, big, onClick,
}: { label: string; icon: any; big?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <span
        className={`grid place-items-center rounded-full transition ${
          big ? "h-14 w-14 -mt-6 shadow-lg shadow-amber-500/40 bg-amber-500 text-white" : "h-10 w-10 bg-white/10 text-white/70"
        }`}
      >
        <Icon className={big ? "h-6 w-6" : "h-5 w-5"} />
      </span>
      <span className="text-[10px] text-white/60">{label}</span>
    </button>
  );
}
