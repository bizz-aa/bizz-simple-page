import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, FilePlus2, TrendingDown, BarChart3, FolderArchive, BadgeCheck, CircleDollarSign, Sparkles, Boxes } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { TaxDataTable } from "@/components/tax-data-table";
import { AssetForm } from "@/components/tax-forms";
import { EmptyState, InsightPanel, MetricCard, ProgressBar, StatusPill } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax/assets")({ component: AssetsHub });

function AssetsHub() {
  const { assets, addAsset } = useTaxModule();
  const [showForm, setShowForm] = useState(false);

  return (
    <TaxLayout
      title="Capital Assets"
      subtitle="Tax depreciation and capital allowance view"
      headerIcon={Building2}
      cards={[
        { label: "Add Asset", icon: FilePlus2 },
        { label: "Register", icon: FolderArchive },
        { label: "Depreciation", icon: TrendingDown },
        { label: "Allowance", icon: CircleDollarSign },
      ]}
      sections={[
        {
          title: "Asset Controls",
          icon: Building2,
          items: [
            { label: "Asset Register", icon: FolderArchive },
            { label: "Depreciation Schedule", icon: TrendingDown },
            { label: "Capital Allowance", icon: CircleDollarSign },
            { label: "Asset Reports", icon: BarChart3 },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel title="Asset Performance" icon={BadgeCheck} tone="emerald" action={<StatusPill label="Healthy" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Total Assets" value={assets.length.toString()} hint="Active register" tone="emerald" />
            <MetricCard label="Capital Allowance" value={formatCurrency(assets.reduce((sum, item) => sum + item.depreciation, 0))} hint="Available benefit" tone="blue" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <ProgressBar label="Depreciation coverage" value={87} tone="emerald" />
          </div>
        </InsightPanel>

        <InsightPanel title="Tax Benefit" icon={Sparkles} tone="violet">
          <MetricCard label="Purchase value" value={formatCurrency(assets.reduce((sum, item) => sum + item.purchaseValue, 0))} hint="Gross asset base" tone="violet" />
          <MetricCard label="Current value" value={formatCurrency(assets.reduce((sum, item) => sum + item.currentValue, 0))} hint="Net book value" tone="amber" />
          <MetricCard label="Remaining life" value={`${Math.round(assets.reduce((sum, item) => sum + item.usefulLife, 0) / assets.length)} years`} hint="Average useful life" tone="slate" />
        </InsightPanel>
      </div>

      <div className="mt-6">
        <TaxDataTable
          title="Asset register"
          rows={assets}
          columns={[
            { key: "name", label: "Name" },
            { key: "category", label: "Category" },
            { key: "purchaseValue", label: "Purchase Value", render: (row) => formatCurrency(row.purchaseValue) },
            { key: "currentValue", label: "Current Value", render: (row) => formatCurrency(row.currentValue) },
            { key: "depreciation", label: "Depreciation", render: (row) => formatCurrency(row.depreciation) },
            { key: "status", label: "Status" },
          ]}
          onAdd={() => setShowForm(true)}
          emptyText="No assets yet. Add your first asset to track depreciation and capital allowance."
          emptyActionLabel="Add asset"
        />
      </div>

      <div className="mt-6">
        <EmptyState title="Capital asset workspace is ready" description="Enter assets to track depreciation, capital allowance, and tax benefit over time." icon={Building2} />
      </div>

      <AssetForm open={showForm} onSave={(value) => { addAsset(value); setShowForm(false); }} onClose={() => setShowForm(false)} />
    </TaxLayout>
  );
}
