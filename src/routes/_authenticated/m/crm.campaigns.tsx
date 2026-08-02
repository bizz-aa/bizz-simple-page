import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { CrmShell, GlassCard } from "@/components/crm/crm-shell";
import { TopDrawer, Field, inputCls } from "@/components/crm/top-drawer";
import { money, dateFmt } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/m/crm/campaigns")({ component: CampaignsPage });

const CHANNELS = ["sms", "email", "social", "whatsapp"] as const;
const STATUSES = ["draft", "active", "paused", "completed"] as const;

type Form = {
  name: string; description: string; budget: number; channel: string;
  status: string; start_date: string; end_date: string; target_segment_id: string;
};
const empty: Form = { name: "", description: "", budget: 0, channel: "sms", status: "draft", start_date: "", end_date: "", target_segment_id: "" };

function CampaignsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [selected, setSelected] = useState<any | null>(null);

  const { data: segments = [] } = useQuery({
    queryKey: ["crm-segments"],
    queryFn: async () => (await supabase.from("customer_segments").select("id,name")).data ?? [],
  });
  const { data: campaigns = [] } = useQuery({
    queryKey: ["crm-campaigns"],
    queryFn: async () => (await supabase.from("marketing_campaigns").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: customers = [] } = useQuery({
    queryKey: ["crm-customers-count"],
    queryFn: async () => (await supabase.from("customers").select("id", { count: "exact", head: true })).count ?? 0,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Name required");
      const payload = {
        name: form.name.trim(),
        description: form.description || null,
        budget: Number(form.budget) || 0,
        channel: form.channel,
        status: form.status,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        target_segment_id: form.target_segment_id || null,
      };
      const { error } = editing
        ? await supabase.from("marketing_campaigns").update(payload).eq("id", editing.id)
        : await supabase.from("marketing_campaigns").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(editing ? "Updated" : "Campaign saved");
      qc.invalidateQueries({ queryKey: ["crm-campaigns"] });
      setOpen(false); setEditing(null); setForm(empty);
    },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await supabase.from("marketing_campaigns").delete().eq("id", id)).error,
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["crm-campaigns"] }); },
  });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name, description: c.description ?? "", budget: c.budget,
      channel: c.channel, status: c.status,
      start_date: c.start_date ?? "", end_date: c.end_date ?? "",
      target_segment_id: c.target_segment_id ?? "",
    });
    setOpen(true);
  };

  return (
    <CrmShell
      title="Marketing Campaigns"
      subtitle={`${campaigns.length} campaigns`}
      action={
        <button onClick={openCreate} className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-2xl border border-amber-300/40 bg-amber-400/20 px-4 py-2.5 text-sm font-semibold hover:bg-amber-400/30">
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      }
    >
      <div className="space-y-3">
        {campaigns.length === 0 && <GlassCard className="p-8 text-center text-white/70">No campaigns yet.</GlassCard>}
        {(campaigns as any[]).map((c) => (
          <GlassCard key={c.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400/20"><Megaphone className="h-5 w-5 text-amber-400" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{c.name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider">{c.status}</span>
                  <span className="rounded-full bg-amber-400/15 text-amber-300 px-2 py-0.5 text-[10px] uppercase tracking-wider">{c.channel}</span>
                </div>
                {c.description && <p className="mt-2 text-xs text-white/60 line-clamp-2">{c.description}</p>}
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/70">
                  <span>Budget: <b className="text-white">{money(c.budget)}</b></span>
                  {c.start_date && <span>{dateFmt.format(new Date(c.start_date))}{c.end_date ? ` → ${dateFmt.format(new Date(c.end_date))}` : ""}</span>}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
              <button onClick={() => setSelected(c)} className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20">Performance</button>
              <button onClick={() => openEdit(c)} className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-white/20"><Edit2 className="h-3.5 w-3.5" /></button>
              <button onClick={() => { if (confirm("Delete campaign?")) del.mutate(c.id); }} className="grid h-9 w-9 place-items-center rounded-lg bg-red-500/20 hover:bg-red-500/30"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </GlassCard>
        ))}
      </div>

      {selected && (
        <GlassCard className="mt-4 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">{selected.name} — Performance</h3>
            <button onClick={() => setSelected(null)} className="text-xs text-white/60">Close</button>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Budget" value={money(selected.budget)} />
            <Stat label="Reach (est.)" value={String((customers as number) || 0)} />
            <Stat label="Channel" value={selected.channel} />
            <Stat label="Status" value={selected.status} />
          </div>
          <p className="mt-3 text-xs text-white/50">ROI tracking will populate once delivery is wired to your SMS/Email provider.</p>
        </GlassCard>
      )}

      <TopDrawer
        open={open}
        onClose={() => { setOpen(false); setEditing(null); }}
        title={editing ? "Edit Campaign" : "New Campaign"}
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm">Cancel</button>
            <button disabled={save.isPending} onClick={() => save.mutate()} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50">Save</button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Campaign Name *"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
          <Field label="Budget (TZS)"><input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} className={inputCls} /></Field>
          <Field label="Channel">
            <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className={inputCls}>
              {CHANNELS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
              {STATUSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Target Segment">
            <select value={form.target_segment_id} onChange={(e) => setForm({ ...form, target_segment_id: e.target.value })} className={inputCls}>
              <option value="">All customers</option>
              {(segments as any[]).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3 md:col-span-1">
            <Field label="Start"><input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={inputCls} /></Field>
            <Field label="End"><input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={inputCls} /></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls + " min-h-20"} /></Field>
          </div>
        </div>
      </TopDrawer>
    </CrmShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-[10px] uppercase tracking-wider text-white/60">{label}</p>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </div>
  );
}
