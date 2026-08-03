import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, FilePlus2, Receipt, Upload, Wrench, BarChart3, BadgeCheck, TriangleAlert, Package2, CircleDollarSign } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { TaxDataTable } from "@/components/tax-data-table";
import { PurchaseForm } from "@/components/tax-forms";
import { EmptyState, InsightPanel, MetricCard, ProgressBar, StatusPill } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax/purchases")({ component: TaxPurchasesHub });

function TaxPurchasesHub() {
  const { purchases, addPurchase, updatePurchase, deletePurchase, metrics } = useTaxModule();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const current = purchases.find((item) => item.id === editing);

  return (
    <TaxLayout
      title="Purchases"
      subtitle="Deductible purchase controls and records"
      headerIcon={ShoppingBag}
      cards={[
        { label: "Eligible", icon: BadgeCheck },
        { label: "Documentation", icon: Receipt },
        { label: "Import", icon: Upload },
        { label: "Tax Value", icon: CircleDollarSign },
      ]}
      sections={[
        {
          title: "Purchase Controls",
          icon: ShoppingBag,
          items: [
            { label: "Eligible Purchases", icon: BadgeCheck },
            { label: "Missing Documentation", icon: TriangleAlert },
            { label: "Import Purchases", icon: Upload },
            { label: "Purchase Summary", icon: BarChart3 },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel title="Deductibility Insights" icon={BadgeCheck} tone="emerald" action={<StatusPill label="Healthy" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Eligible Purchases" value={formatCurrency(metrics.purchaseTotal)} tone="emerald" />
            <MetricCard label="Non-Eligible" value={formatCurrency(purchases.filter((item) => !item.deductible).reduce((sum, item) => sum + item.amount, 0))} tone="amber" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <ProgressBar label="Documentation coverage" value={83} tone="emerald" />
          </div>
        </InsightPanel>

        <InsightPanel title="Supplier Summary" icon={Package2} tone="violet">
          <MetricCard label="Top Supplier" value={purchases[0]?.supplier ?? "No supplier"} tone="violet" />
          <MetricCard label="Tax deduction value" value={formatCurrency(metrics.deductibleExpenses)} tone="blue" />
          <MetricCard label="Pending" value={purchases.filter((item) => item.status === "Pending").length.toString()} tone="rose" />
        </InsightPanel>
      </div>

      <div className="mt-6">
        <TaxDataTable
          title="Purchase register"
          rows={purchases}
          columns={[
            { key: "supplier", label: "Supplier" },
            { key: "date", label: "Date" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "category", label: "Category" },
            { key: "deductible", label: "Deductible", render: (row) => (row.deductible ? "Yes" : "No") },
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
          onDelete={(row) => deletePurchase(row.id)}
          emptyText="No purchase records yet. Add the first purchase to start tracking deductible spend."
          emptyActionLabel="Add purchase"
        />
      </div>

      <div className="mt-6">
        <EmptyState title="Purchases workspace is ready" description="Add purchase records to surface deductible value, gaps in evidence, and supplier-level tax insights." icon={ShoppingBag} />
      </div>

      <PurchaseForm
        open={showForm}
        initialValue={current ? { supplier: current.supplier, date: current.date, amount: current.amount, deductible: current.deductible, category: current.category, status: current.status } : undefined}
        onSave={(value) => {
          if (editing) {
            updatePurchase(editing, value);
          } else {
            addPurchase(value);
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
