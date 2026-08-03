import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, FilePlus2, Receipt, Upload, Wrench, BarChart3, CircleDollarSign, BadgeCheck } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { TaxDataTable } from "@/components/tax-data-table";
import { SaleForm } from "@/components/tax-forms";
import { EmptyState, InsightPanel, MetricCard, StatusPill } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax/sales")({ component: TaxSalesHub });

function TaxSalesHub() {
  const { sales, addSale, updateSale, deleteSale, metrics } = useTaxModule();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  const current = sales.find((item) => item.id === editing);

  return (
    <TaxLayout
      title="Tax Sales"
      subtitle="Sales ledger and VAT impact"
      headerIcon={ShoppingCart}
      cards={[
        { label: "Sales Entry", icon: FilePlus2 },
        { label: "Receipts", icon: Receipt },
        { label: "Import", icon: Upload },
        { label: "Adjustments", icon: Wrench },
      ]}
      sections={[
        {
          title: "Manage",
          icon: ShoppingCart,
          items: [
            { label: "Sales Entry", icon: FilePlus2 },
            { label: "Receipt Management", icon: Receipt },
            { label: "Import Sales", icon: Upload },
            { label: "Sales Adjustments", icon: Wrench },
            { label: "Sales Summary", icon: BarChart3 },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <InsightPanel title="Sales Summary" icon={CircleDollarSign} tone="emerald" action={<StatusPill label="Live" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Sales Total" value={formatCurrency(metrics.salesTotal)} tone="emerald" />
            <MetricCard label="VAT Output" value={formatCurrency(metrics.outputVat)} tone="amber" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            Keep sales entries current to keep VAT and tax planning accurate.
          </div>
        </InsightPanel>
        <InsightPanel title="Sales Status" icon={BadgeCheck} tone="violet">
          <MetricCard label="Reviewed" value={sales.filter((item) => item.status === "Reviewed").length.toString()} tone="violet" />
          <MetricCard label="Pending" value={sales.filter((item) => item.status === "Pending").length.toString()} tone="amber" />
          <MetricCard label="Recorded" value={sales.filter((item) => item.status === "Recorded").length.toString()} tone="slate" />
        </InsightPanel>
      </div>

      <div className="mt-6">
        <TaxDataTable
          title="Sales register"
          rows={sales}
          columns={[
            { key: "reference", label: "Reference" },
            { key: "customer", label: "Customer" },
            { key: "date", label: "Date" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "vat", label: "VAT", render: (row) => formatCurrency(row.vat) },
            { key: "status", label: "Status" },
          ]}
          onAdd={() => {
            setEditing(null);
            setShowForm(true);
          }}
          onEdit={(row) => {
            setEditing(row.id);
            setShowForm(true);
          }}
          onDelete={(row) => deleteSale(row.id)}
          emptyText="No sales records yet. Add the first entry to start tracking VAT and tax exposure."
          emptyActionLabel="Add sale"
        />
      </div>

      <div className="mt-6">
        <EmptyState title="Sales workspace ready" description="Capture each sales transaction, attach the VAT effect, and keep your tax register current." icon={ShoppingCart} />
      </div>

      <SaleForm
        open={showForm}
        initialValue={current ? { reference: current.reference, customer: current.customer, date: current.date, amount: current.amount, vat: current.vat, status: current.status } : undefined}
        onSave={(value) => {
          if (editing) {
            updateSale(editing, value);
          } else {
            addSale(value);
          }
          setShowForm(false);
          setEditing(null);
        }}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    </TaxLayout>
  );
}
