import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Percent, ArrowUpRight, ArrowDownLeft, Calculator, FileCheck2, BadgeCheck, CircleDollarSign, Clock3, FileSpreadsheet } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { TaxDataTable } from "@/components/tax-data-table";
import { VatForm } from "@/components/tax-forms";
import { EmptyState, InsightPanel, MetricCard, ProgressBar, StatusPill } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax/vat")({ component: VatHub });

function VatHub() {
  const { vatReturns, addVatReturn, metrics } = useTaxModule();
  const [showForm, setShowForm] = useState(false);

  return (
    <TaxLayout
      title="VAT"
      subtitle="Output, input and return position"
      headerIcon={Percent}
      cards={[
        { label: "Output VAT", icon: ArrowUpRight },
        { label: "Input VAT", icon: ArrowDownLeft },
        { label: "VAT Payable", icon: CircleDollarSign },
        { label: "Returns", icon: FileCheck2 },
      ]}
      sections={[
        {
          title: "VAT Operations",
          icon: Percent,
          items: [
            { label: "Output VAT Register", icon: ArrowUpRight },
            { label: "Input VAT Register", icon: ArrowDownLeft },
            { label: "VAT Return Filing", icon: FileCheck2 },
            { label: "Compliance Documents", icon: FileSpreadsheet },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel title="VAT Position" icon={BadgeCheck} tone="emerald" action={<StatusPill label="Compliant" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Output VAT" value={formatCurrency(metrics.outputVat)} tone="emerald" />
            <MetricCard label="Input VAT" value={formatCurrency(metrics.inputVat)} tone="blue" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <ProgressBar label="VAT compliance score" value={Math.round(metrics.complianceScore)} tone="emerald" />
          </div>
        </InsightPanel>

        <InsightPanel title="Upcoming Deadlines" icon={Clock3} tone="amber">
          <MetricCard label="VAT Payable" value={formatCurrency(metrics.vatPayable)} tone="amber" />
          <MetricCard label="Outstanding VAT" value={formatCurrency(Math.max(0, metrics.vatPayable - 800000))} tone="rose" />
          <MetricCard label="Returns ready" value={vatReturns.filter((item) => item.status !== "Filed").length.toString()} tone="slate" />
        </InsightPanel>
      </div>

      <div className="mt-6">
        <TaxDataTable
          title="VAT returns"
          rows={vatReturns}
          columns={[
            { key: "period", label: "Period" },
            { key: "outputVat", label: "Output VAT", render: (row) => formatCurrency(row.outputVat) },
            { key: "inputVat", label: "Input VAT", render: (row) => formatCurrency(row.inputVat) },
            { key: "payable", label: "Payable", render: (row) => formatCurrency(row.payable) },
            { key: "status", label: "Status" },
          ]}
          onAdd={() => setShowForm(true)}
          emptyText="No VAT returns yet. Add one to track your filing position."
          emptyActionLabel="Add return"
        />
      </div>

      <div className="mt-6">
        <EmptyState title="VAT workspace is ready" description="Import your sales and purchase ledgers to populate VAT returns, payable balances, and filing timelines automatically." icon={Calculator} />
      </div>

      <VatForm open={showForm} onSave={(value) => { addVatReturn(value); setShowForm(false); }} onClose={() => setShowForm(false)} />
    </TaxLayout>
  );
}
