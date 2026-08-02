import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Crown, TrendingUp, Sparkles, Repeat, Plus, Trash2, Edit2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { TopDrawer, Field, inputCls } from "@/components/crm/top-drawer";
import { money } from "@/lib/format";

export function SegmentsPanel() {
  const qc = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", min_spend: 0, min_orders: 0 });

  const { data: customers = [] } = useQuery({
    queryKey: ["crm-customers-all"],
    queryFn: async () => (await supabase.from("customers").select("id,name,customer_type,phone,email")).data ?? [],
  });
  const { data: sales = [] } = useQuery({
    queryKey: ["crm-sales-all"],
    queryFn: async () =>
      (await supabase.from("sales").select("customer_id,total,created_at,status").eq("status", "completed")).data ?? [],
  });
  const { data: segments = [] } = useQuery({
    queryKey: ["crm-segments"],
    queryFn: async () =>
      (await supabase.from("customer_segments").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const stats = useMemo(() => {
    const map = new Map<string, { spend: number; orders: number; firstAt: string; lastAt: string }>();
    for (const s of sales as any[]) {
      if (!s.customer_id) continue;
      const cur = map.get(s.customer_id) ?? { spend: 0, orders: 0, firstAt: s.created_at, lastAt: s.created_at };
      cur.spend += Number(s.total || 0);
      cur.orders += 1;
      if (s.created_at < cur.firstAt) cur.firstAt = s.created_at;
      if (s.created_at > cur.lastAt) cur.lastAt = s.created_at;
      map.set(s.customer_id, cur);
    }
    return map;
  }, [sales]);

  const now = Date.now();
  const day30 = now - 30 * 86400_000;
  const day90 = now - 90 * 86400_000;

  const presetGroups = useMemo(() => {
    const vip = (customers as any[]).filter((c) => c.customer_type === "vip");
    const highValue = (customers as any[]).filter((c) => (stats.get(c.id)?.spend ?? 0) >= 500_000);
    const newC = (customers as any[]).filter((c) => {
      const st = stats.get(c.id);
      return st && new Date(st.firstAt).getTime() >= day30;
    });
    const returning = (customers as any[]).filter((c) => {
      const st = stats.get(c.id);
      return st && st.orders >= 2 && new Date(st.lastAt).getTime() >= day90;
    });
    return {
      vip: { label: "VIP Customers", icon: Crown, list: vip, hint: "Marked as VIP" },
      high_value: { label: "High Value", icon: TrendingUp, list: highValue, hint: "Spent ≥ TZS 500K" },
      new: { label: "New Customers", icon: Sparkles, list: newC, hint: "First order last 30 days" },
      returning: { label: "Returning", icon: Repeat, list: returning, hint: "2+ orders in 90 days" },
    };
  }, [customers, stats]);

  const save = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Name required");
      const payload = {
        name: form.name.trim(),
        description: form.description || null,
        rule_type: "custom",
        min_spend: Number(form.min_spend) || 0,
        min_orders: Number(form.min_orders) || 0,
      };
      const { error } = editing
        ? await supabase.from("customer_segments").update(payload).eq("id", editing.id)
        : await supabase.from("customer_segments").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(editing ? "Updated" : "Segment created");
      qc.invalidateQueries({ queryKey: ["crm-segments"] });
      setDrawerOpen(false);
      setEditing(null);
      setForm({ name: "", description: "", min_spend: 0, min_orders: 0 });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => (await supabase.from("customer_segments").delete().eq("id", id)).error,
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["crm-segments"] });
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", min_spend: 0, min_orders: 0 });
    setDrawerOpen(true);
  };
  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description ?? "", min_spend: s.min_spend, min_orders: s.min_orders });
    setDrawerOpen(true);
  };

  const customSegmentCustomers = (seg: any) =>
    (customers as any[]).filter((c) => {
      const st = stats.get(c.id) ?? { spend: 0, orders: 0 };
      return st.spend >= (seg.min_spend ?? 0) && st.orders >= (seg.min_orders ?? 0);
    });

  const selectedList = (() => {
    if (!selected) return null;
    if (selected in presetGroups) return (presetGroups as any)[selected];
    const seg = (segments as any[]).find((s) => s.id === selected);
    if (!seg) return null;
    return {
      label: seg.name,
      icon: Sparkles,
      list: customSegmentCustomers(seg),
      hint: seg.description ?? "Custom segment",
    };
  })();

  const panel = "rounded-2xl border border-white/10 bg-white/[0.03]";

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/50">Grouped by behaviour and spend</p>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/60 px-4 py-2.5 text-sm font-semibold text-amber-400 transition hover:bg-amber-400/10"
        >
          <Plus className="h-4 w-4" /> Custom Segment
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Object.entries(presetGroups).map(([key, g]) => (
          <button
            key={key}
            onClick={() => setSelected(selected === key ? null : key)}
            className={`rounded-2xl border p-4 text-left transition ${
              selected === key
                ? "border-amber-400/60 bg-amber-400/10"
                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10">
                <g.icon className="h-5 w-5 text-amber-400" />
              </div>
              <p className="font-display text-2xl font-bold leading-none text-white">{g.list.length}</p>
            </div>
            <p className="mt-3 text-sm font-semibold leading-tight text-white">{g.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-white/50">{g.hint}</p>
          </button>
        ))}
      </div>

      <div className={`mt-4 p-5 ${panel}`}>
        <h3 className="font-display text-base font-bold text-white">Custom Segments</h3>
        <div className="mt-3 space-y-2">
          {segments.length === 0 && <p className="text-sm text-white/50">No custom segments yet.</p>}
          {(segments as any[]).map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <button onClick={() => setSelected(s.id)} className="min-w-0 flex-1 text-left">
                <p className="truncate font-semibold text-white">{s.name}</p>
                <p className="truncate text-xs text-white/50">
                  {s.description || `Min spend ${money(s.min_spend)} · ${s.min_orders}+ orders`}
                </p>
              </button>
              <span className="text-xs text-white/50">{customSegmentCustomers(s).length}</span>
              <button
                onClick={() => openEdit(s)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 hover:bg-white/20"
              >
                <Edit2 className="h-3.5 w-3.5 text-white" />
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete segment?")) del.mutate(s.id);
                }}
                className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/20 hover:bg-red-500/30"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-300" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedList && (
        <div className={`mt-4 p-5 ${panel}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-white">{selectedList.label}</h3>
              <p className="text-xs text-white/50">{selectedList.list.length} customers</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-xs text-white/50 hover:text-white">
              Close
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {selectedList.list.length === 0 && <p className="text-sm text-white/50">No customers match.</p>}
            {selectedList.list.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-white">{c.name}</p>
                  <p className="text-xs text-white/50">{c.phone ?? c.email ?? "—"}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-white/40" />
              </div>
            ))}
          </div>
        </div>
      )}

      <TopDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Segment" : "New Custom Segment"}
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDrawerOpen(false)}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              disabled={save.isPending}
              onClick={() => save.mutate()}
              className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        }
      >
        <div className="grid gap-4">
          <Field label="Segment Name *">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="Top Wholesalers"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputCls + " min-h-20"}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Min Spend (TZS)">
              <input
                type="number"
                value={form.min_spend}
                onChange={(e) => setForm({ ...form, min_spend: Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
            <Field label="Min Orders">
              <input
                type="number"
                value={form.min_orders}
                onChange={(e) => setForm({ ...form, min_orders: Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </TopDrawer>
    </div>
  );
}
