import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HandCoins, FilePlus2, Calculator, FileCheck2, BarChart3, WalletCards, Banknote, BadgeCheck, FileSpreadsheet } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { TaxDataTable } from "@/components/tax-data-table";
import { WithholdingForm } from "@/components/tax-forms";
import { EmptyState, InsightPanel, MetricCard, ProgressBar, StatusPill } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax/withholding")({ component: WithholdingHub });

function WithholdingHub() {
  const { withholding, addWithholding } = useTaxModule();
  const [showForm, setShowForm] = useState(false);

  return (
    <TaxLayout
      title="Withholding Tax"
      subtitle="Certificates, balances and reporting"
      headerIcon={HandCoins}
      cards={[
        { label: "New Record", icon: FilePlus2 },
        { label: "Certificates", icon: FileCheck2 },
        { label: "Balances", icon: WalletCards },
        { label: "Reports", icon: BarChart3 },
      ]}
      sections={[
        {
          title: "Withholding Controls",
          icon: HandCoins,
          items: [
            { label: "Withholding Records", icon: FilePlus2 },
            { label: "WHT Certificates", icon: FileCheck2 },
            { label: "Payments & Receivables", icon: Banknote },
            { label: "WHT Reports", icon: BarChart3 },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel title="Certificate Position" icon={BadgeCheck} tone="emerald" action={<StatusPill label="Balanced" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Issued Certificates" value={withholding.filter((item) => item.status === "Issued").length.toString()} tone="emerald" />
            <MetricCard label="Received Certificates" value={withholding.filter((item) => item.status === "Received").length.toString()} tone="blue" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <ProgressBar label="Certificate completeness" value={86} tone="emerald" />
          </div>
        </InsightPanel>

        <InsightPanel title="Balances" icon={WalletCards} tone="violet">
          <MetricCard label="Receivables" value={formatCurrency(withholding.reduce((sum, item) => sum + (item.status === "Received" ? item.amount : 0), 0))} tone="violet" />
          <MetricCard label="Payables" value={formatCurrency(withholding.reduce((sum, item) => sum + (item.status === "Issued" ? item.amount : 0), 0))} tone="amber" />
          <MetricCard label="Status" value="On schedule" tone="slate" />
        </InsightPanel>
      </div>

      <div className="mt-6">
        <TaxDataTable
          title="Withholding register"
          rows={withholding}
          columns={[
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "status", label: "Status" },
          ]}
          onAdd={() => setShowForm(true)}
          emptyText="No withholding entries yet. Add your first certificate or payment record."
          emptyActionLabel="Add entry"
        />
      </div>

      <div className="mt-6">
        <EmptyState title="Withholding workspace is ready" description="Upload certificate and payment records to keep balances, status, and reporting up to date." icon={HandCoins} />
      </div>

      <WithholdingForm open={showForm} onSave={(value) => { addWithholding(value); setShowForm(false); }} onClose={() => setShowForm(false)} />
    </TaxLayout>
  );
}
