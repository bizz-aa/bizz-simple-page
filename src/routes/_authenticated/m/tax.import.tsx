import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileSpreadsheet, FileText, PenLine, DatabaseZap, AlertTriangle, History } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule } from "@/components/tax-module-provider";
import { TaxDataTable } from "@/components/tax-data-table";
import { EmptyState, InsightPanel, MetricCard, ProgressBar, StatusPill } from "@/components/tax-workspace-ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/m/tax/import")({ component: ImportHub });

function ImportHub() {
  const { imports, addImport } = useTaxModule();
  const [showImport, setShowImport] = useState(false);

  return (
    <TaxLayout
      title="Import Center"
      subtitle="Bring tax data in from Excel, CSV and accounting systems"
      headerIcon={Upload}
      cards={[
        { label: "Excel", icon: FileSpreadsheet },
        { label: "CSV", icon: FileText },
        { label: "Manual", icon: PenLine },
        { label: "History", icon: History },
      ]}
      sections={[
        {
          title: "Import Methods",
          icon: Upload,
          items: [
            { label: "Import from Excel", icon: FileSpreadsheet },
            { label: "Import from CSV", icon: FileText },
            { label: "Manual Import / Entry", icon: PenLine },
            { label: "Import History", icon: History },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel title="Import Readiness" icon={DatabaseZap} tone="emerald" action={<StatusPill label="Ready" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Successful imports" value={imports.filter((item) => item.status === "Completed").length.toString()} tone="emerald" />
            <MetricCard label="Duplicates" value="2" tone="amber" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <ProgressBar label="Validation success" value={92} tone="emerald" />
          </div>
        </InsightPanel>

        <InsightPanel title="Validation Status" icon={AlertTriangle} tone="amber">
          <MetricCard label="Errors" value="3" tone="rose" />
          <MetricCard label="Successful rows" value="1,284" tone="blue" />
          <MetricCard label="Pending review" value="5" tone="amber" />
        </InsightPanel>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => { addImport({ name: "New upload", type: "CSV", rows: 120, status: "Completed", summary: "Imported successfully" }); setShowImport(true); }}>Run import preview</Button>
      </div>

      <div className="mt-6">
        <TaxDataTable
          title="Import history"
          rows={imports}
          columns={[
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
            { key: "rows", label: "Rows" },
            { key: "status", label: "Status" },
            { key: "summary", label: "Summary" },
          ]}
          emptyText="No import history yet. Start by importing a CSV or Excel file."
          emptyActionLabel="Import file"
        />
      </div>

      <div className="mt-6">
        <EmptyState title="Import center is ready" description="Bring in Excel, CSV, bank statements, purchases, expenses, sales, or assets to accelerate tax processing." icon={Upload} />
      </div>
    </TaxLayout>
  );
}
