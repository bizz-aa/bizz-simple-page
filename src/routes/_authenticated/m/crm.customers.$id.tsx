import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Trash2, ShoppingBag, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { CrmShell, GlassCard } from "@/components/crm/crm-shell";
import { TopDrawer, Field, inputCls } from "@/components/crm/top-drawer";
import { money, dateFmt } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/m/crm/customers/$id")({ component: ProfilePage });

const TYPES = ["retail", "wholesale", "vip", "corporate"];
const STATUSES = ["active", "inactive"];

function ProfilePage() {
  const { id } = useParams({ from: "/_authenticated/m/crm/customers/$id" });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const { data: customer } = useQuery({
    queryKey: ["crm-customer", id],
    queryFn: async () => (await supabase.from("customers").select("*").eq("id", id).maybeSingle()).data,
  });
  const { data: sales = [] } = useQuery({
    queryKey: ["crm-customer-sales", id],
    queryFn: async () => (await supabase.from("sales").select("id,invoice_number,total,created_at,status,payment_method").eq("customer_id", id).order("created_at", { ascending: false })).data ?? [],
  });

  const totalPurchases = sales.filter((s: any) => s.status === "completed").reduce((a, s: any) => a + Number(s.total || 0), 0);
  const lastPurchase = sales[0]?.created_at;

  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "", customer_type: "retail", status: "active" });
  useEffect(() => {
    if (customer) setForm({
      name: customer.name ?? "",
      phone: customer.phone ?? "",
      email: customer.email ?? "",
      location: (customer as any).location ?? "",
      customer_type: (customer as any).customer_type ?? "retail",
      status: (customer as any).status ?? "active",
    });
  }, [customer]);

  const update = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("customers").update({
        name: form.name.trim(),
        phone: form.phone || null,
        email: form.email || null,
        location: form.location || null,
        customer_type: form.customer_type,
        status: form.status,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["crm-customer", id] });
      qc.invalidateQueries({ queryKey: ["crm-customers"] });
      setEditOpen(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["crm-customers"] });
      navigate({ to: "/m/crm/customers" });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  return (
    <CrmShell
      title={customer?.name ?? "Customer"}
      subtitle={customer ? `${(customer as any).customer_type} · ${(customer as any).status}` : ""}
      backTo="/m/crm/customers"
      action={
        <div className="flex flex-1 md:flex-none gap-2">
          <button onClick={() => setEditOpen(true)} className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20">
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => { if (confirm("Delete this customer?")) del.mutate(); }}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-red-400/30 bg-red-500/20 hover:bg-red-500/30"
          ><Trash2 className="h-4 w-4" /></button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-5 md:col-span-2">
          <h3 className="font-display text-lg font-bold">Details</h3>
          <div className="mt-3 grid gap-3 text-sm">
            {customer?.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-amber-400" /> {customer.phone}</div>}
            {customer?.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-amber-400" /> {customer.email}</div>}
            {(customer as any)?.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-400" /> {(customer as any).location}</div>}
            {customer?.address && <div className="text-white/70">{customer.address}</div>}
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wider text-white/60">Total Purchases</p>
          <p className="mt-1 font-display text-2xl font-bold">{money(totalPurchases)}</p>
          <p className="mt-3 text-xs uppercase tracking-wider text-white/60">Orders</p>
          <p className="mt-1 font-display text-2xl font-bold">{sales.filter((s: any) => s.status === "completed").length}</p>
          <p className="mt-3 text-xs uppercase tracking-wider text-white/60">Last Purchase</p>
          <p className="mt-1 text-sm">{lastPurchase ? dateFmt.format(new Date(lastPurchase)) : "—"}</p>
        </GlassCard>
      </div>

      <GlassCard className="mt-4 p-5">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-amber-400" />
          <h3 className="font-display text-lg font-bold">Sales History</h3>
        </div>
        <div className="mt-3 space-y-2">
          {sales.length === 0 && <p className="text-sm text-white/60">No sales yet.</p>}
          {sales.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
              <div>
                <p className="font-semibold">{s.invoice_number}</p>
                <p className="text-xs text-white/60">{dateFmt.format(new Date(s.created_at))} · {s.payment_method}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{money(s.total)}</p>
                <p className="text-xs text-white/60">{s.status}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <TopDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Customer"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditOpen(false)} className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm">Cancel</button>
            <button disabled={update.isPending} onClick={() => update.mutate()} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50">Save</button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
          <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></Field>
          <Field label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></Field>
          <Field label="Location"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} /></Field>
          <Field label="Type">
            <select value={form.customer_type} onChange={(e) => setForm({ ...form, customer_type: e.target.value })} className={inputCls}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
              {STATUSES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
      </TopDrawer>
    </CrmShell>
  );
}
