import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FolderArchive, Receipt, FileText, FileCheck2, FileBarChart, Files, Search, ShieldCheck } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule } from "@/components/tax-module-provider";
import { TaxDataTable } from "@/components/tax-data-table";
import { DocumentForm } from "@/components/tax-forms";
import { EmptyState, InsightPanel, MetricCard, StatusPill } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax/documents")({ component: DocumentsHub });

function DocumentsHub() {
  const { documents, addDocument, deleteDocument } = useTaxModule();
  const [showForm, setShowForm] = useState(false);

  return (
    <TaxLayout
      title="Document Center"
      subtitle="Verified files, pending items and document timeline"
      headerIcon={FolderArchive}
      cards={[
        { label: "Receipts", icon: Receipt },
        { label: "Invoices", icon: FileText },
        { label: "Certificates", icon: FileCheck2 },
        { label: "Returns", icon: FileBarChart },
      ]}
      sections={[
        {
          title: "Library",
          icon: FolderArchive,
          items: [
            { label: "Receipts", icon: Receipt },
            { label: "Invoices", icon: FileText },
            { label: "Tax Certificates", icon: FileCheck2 },
            { label: "Tax Returns", icon: FileBarChart },
            { label: "Other Documents", icon: Files },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel title="Document Health" icon={ShieldCheck} tone="emerald" action={<StatusPill label="Verified" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Verified Files" value={documents.filter((item) => item.status === "Verified").length.toString()} tone="emerald" />
            <MetricCard label="Pending Files" value={documents.filter((item) => item.status === "Pending").length.toString()} tone="amber" />
          </div>
        </InsightPanel>

        <InsightPanel title="Search & Filters" icon={Search} tone="violet">
          <MetricCard label="Recent Search" value="VAT returns" tone="violet" />
          <MetricCard label="Filter Focus" value="By category" tone="blue" />
          <MetricCard label="Preview Ready" value="Enabled" tone="slate" />
        </InsightPanel>
      </div>

      <div className="mt-6">
        <TaxDataTable
          title="Tax document library"
          rows={documents}
          columns={[
            { key: "name", label: "Name" },
            { key: "category", label: "Category" },
            { key: "type", label: "Type" },
            { key: "size", label: "Size" },
            { key: "status", label: "Status" },
            { key: "uploadedAt", label: "Uploaded" },
          ]}
          onAdd={() => setShowForm(true)}
          onDelete={(row) => deleteDocument(row.id)}
          emptyText="No documents uploaded yet. Add the first file to build your compliance archive."
          emptyActionLabel="Upload document"
        />
      </div>

      <div className="mt-6">
        <EmptyState title="Document center is ready" description="Upload invoices, receipts, tax certificates, and filings to build a premium compliance archive for your business." icon={FolderArchive} />
      </div>

      <DocumentForm open={showForm} onSave={(value) => { addDocument(value); setShowForm(false); }} onClose={() => setShowForm(false)} />
    </TaxLayout>
  );
}
