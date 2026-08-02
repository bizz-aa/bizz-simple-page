import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Trash2, Plus, Minus, CreditCard, Wallet, Smartphone, Building2 } from "lucide-react";
import { money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/pos")({ component: POS });

type Product = { id: string; name: string; sku: string | null; selling_price: number; tax_rate: number; stock_quantity: number; };
type Line = { product: Product; qty: number };

function POS() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Line[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [method, setMethod] = useState<"cash" | "bank" | "mobile_money" | "credit">("cash");
  const [processing, setProcessing] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["pos-products", q],
    queryFn: async () => {
      let query = supabase.from("products").select("id,name,sku,selling_price,tax_rate,stock_quantity").eq("active", true).order("name").limit(40);
      if (q) query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%,barcode.eq.${q}`);
      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["pos-customers"],
    queryFn: async () => (await supabase.from("customers").select("id,name").order("name").limit(50)).data ?? [],
  });

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.product.id === p.id);
      if (existing) return prev.map((l) => l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { product: p, qty: 1 }];
    });
  };
  const setQty = (id: string, qty: number) => {
    if (qty <= 0) return setCart((c) => c.filter((l) => l.product.id !== id));
    setCart((c) => c.map((l) => l.product.id === id ? { ...l, qty } : l));
  };

  const totals = useMemo(() => {
    let subtotal = 0, tax = 0;
    cart.forEach((l) => {
      const line = Number(l.product.selling_price) * l.qty;
      subtotal += line;
      tax += line * (Number(l.product.tax_rate) / 100);
    });
    const total = Math.max(0, subtotal + tax - discount);
    return { subtotal, tax, total };
  }, [cart, discount]);

  const checkout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    setProcessing(true);
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    const { data: sale, error } = await supabase.from("sales").insert({
      invoice_number: invoiceNumber,
      customer_id: customerId,
      customer_name: customerName || null,
      subtotal: totals.subtotal,
      tax_amount: totals.tax,
      discount_amount: discount,
      total: totals.total,
      amount_paid: method === "credit" ? 0 : totals.total,
      payment_method: method,
      status: "completed",
    }).select().single();
    if (error || !sale) { setProcessing(false); return toast.error(error?.message ?? "Failed"); }

    const items = cart.map((l) => ({
      sale_id: sale.id,
      product_id: l.product.id,
      product_name: l.product.name,
      quantity: l.qty,
      unit_price: l.product.selling_price,
      tax_amount: Number(l.product.selling_price) * l.qty * (Number(l.product.tax_rate) / 100),
      line_total: Number(l.product.selling_price) * l.qty,
    }));
    const { error: itemsErr } = await supabase.from("sale_items").insert(items);
    setProcessing(false);
    if (itemsErr) return toast.error(itemsErr.message);
    toast.success(`Sale ${invoiceNumber} completed · ${money(totals.total)}`);
    setCart([]); setDiscount(0); setCustomerName(""); setCustomerId(null);
    qc.invalidateQueries();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products or scan barcode"
            className="w-full rounded-md border border-border bg-input py-3 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {products.length === 0 && <p className="col-span-full py-8 text-center text-sm text-muted-foreground">No products. Add some in the Products page.</p>}
          {products.map((p) => (
            <button key={p.id} onClick={() => addToCart(p)}
              className="card-surface p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/60">
              <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.sku ?? "—"}</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="font-display text-lg font-semibold">{money(p.selling_price)}</span>
                <span className="text-xs text-muted-foreground">{Number(p.stock_quantity)} in stock</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface flex h-[calc(100vh-8rem)] flex-col p-4">
        <h3 className="font-display text-lg font-semibold">Current sale</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input value={customerName} onChange={(e) => { setCustomerName(e.target.value); setCustomerId(null); }} placeholder="Walk-in customer"
            list="cust-list"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <datalist id="cust-list">
            {customers.map((c: any) => <option key={c.id} value={c.name} />)}
          </datalist>
          <select value={customerId ?? ""} onChange={(e) => {
            const c: any = customers.find((x: any) => x.id === e.target.value);
            setCustomerId(e.target.value || null); if (c) setCustomerName(c.name);
          }} className="rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
            <option value="">— Pick saved —</option>
            {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          {cart.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">Tap a product to add.</p>}
          {cart.map((l) => (
            <div key={l.product.id} className="mb-2 flex items-center gap-2 border-b border-border pb-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{l.product.name}</p>
                <p className="text-xs text-muted-foreground">{money(l.product.selling_price)} × {l.qty}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setQty(l.product.id, l.qty - 1)} className="grid h-7 w-7 place-items-center rounded border border-border hover:bg-accent"><Minus className="h-3 w-3" /></button>
                <span className="w-8 text-center text-sm font-medium">{l.qty}</span>
                <button onClick={() => setQty(l.product.id, l.qty + 1)} className="grid h-7 w-7 place-items-center rounded border border-border hover:bg-accent"><Plus className="h-3 w-3" /></button>
                <button onClick={() => setQty(l.product.id, 0)} className="ml-1 grid h-7 w-7 place-items-center rounded text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /></button>
              </div>
              <span className="w-20 text-right text-sm font-semibold">{money(l.product.selling_price * l.qty)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{money(totals.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tax (VAT)</span><span>{money(totals.tax)}</span></div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Discount</span>
            <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              className="w-24 rounded-md border border-border bg-input px-2 py-1 text-right text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold"><span>Total</span><span>{money(totals.total)}</span></div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1">
          {[
            { k: "cash" as const, l: "Cash", i: Wallet },
            { k: "bank" as const, l: "Bank", i: Building2 },
            { k: "mobile_money" as const, l: "Mobile", i: Smartphone },
            { k: "credit" as const, l: "Credit", i: CreditCard },
          ].map((m) => (
            <button key={m.k} onClick={() => setMethod(m.k)}
              className={`flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs font-medium ${method === m.k ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}>
              <m.i className="h-4 w-4" /> {m.l}
            </button>
          ))}
        </div>

        <button onClick={checkout} disabled={processing || cart.length === 0}
          className="mt-3 w-full rounded-md btn-gradient py-3 font-display text-base font-semibold disabled:opacity-50">
          {processing ? "Processing…" : `Charge ${money(totals.total)}`}
        </button>
      </div>
    </div>
  );
}
