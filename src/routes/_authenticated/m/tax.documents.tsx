import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FolderArchive, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTaxModule, type DocumentRecord } from "@/components/tax-module-provider";
import { RecordDialog, ConfirmDialog, str, type FieldValue } from "@/components/tax/record-dialog";
import { DetailsDrawer, StatusBadge, SummaryStrip, TaxTable, TaxWorkspace, exportCsv } from "@/components/tax/tax-workspace";

export const Route = createFileRoute("/_authenticated/m/tax/documents")({ component: DocumentsPage });

function DocumentsPage() {
  const { documents, saveDocument, deleteDocument } = useTaxModule();
  const [editing, setEditing] = useState<DocumentRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detail, setDetail] = useState<DocumentRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DocumentRecord | null>(null);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (row: DocumentRecord) => { setEditing(row); setFormOpen(true); };

  const submit = (value: Record<string, FieldValue>) => {
    saveDocument(
      {
        name: str(value.name),
        category: str(value.category),
        type: str(value.type),
        size: str(value.size) || "—",
        status: str(value.status) as DocumentRecord["status"],
        uploadedAt: str(value.uploadedAt),
      },
      editing?.id,
    );
    toast.success(editing ? "Document updated" : "Document added");
  };

  return (
    <TaxWorkspace
      title="Document Center"
      subtitle="Tax archive, categories and document status"
      icon={FolderArchive}
      actions={
        <Button size="sm" className="h-9 bg-amber-400 text-black hover:bg-amber-300" onClick={openCreate}>
          <Upload className="mr-1.5 h-4 w-4" /> Upload
        </Button>
      }
    >
      <SummaryStrip
        items={[
          { label: "Documents", value: String(documents.length), hint: "In archive", accent: true },
          { label: "Verified", value: String(documents.filter((row) => row.status === "Verified").length), hint: "Compliance ready" },
          { label: "Pending", value: String(documents.filter((row) => row.status === "Pending").length), hint: "Needs review" },
          { label: "Categories", value: String(new Set(documents.map((row) => row.category)).size), hint: "In use" },
        ]}
      />

      <TaxTable
        rows={documents}
        searchKeys={(row) => `${row.name} ${row.category} ${row.type} ${row.status}`}
        filter={{
          label: "Category",
          options: [
            { value: "Receipts", label: "Receipts" },
            { value: "Invoices", label: "Invoices" },
            { value: "Certificates", label: "Certificates" },
            { value: "Returns", label: "Returns" },
            { value: "Pending", label: "Pending status" },
          ],
          match: (row, value) => (value === "Pending" ? row.status === "Pending" : row.category === value),
        }}
        columns={[
          { key: "name", label: "Document", render: (row) => <span className="font-medium text-white">{row.name}</span> },
          { key: "category", label: "Category" },
          { key: "type", label: "Type", hideOnMobile: true },
          { key: "size", label: "Size", hideOnMobile: true },
          { key: "uploadedAt", label: "Uploaded", hideOnMobile: true },
          { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
        ]}
        onRowClick={setDetail}
        onEdit={openEdit}
        onDelete={setPendingDelete}
        onExport={(rows) =>
          exportCsv(
            "tax-documents.csv",
            ["Document", "Category", "Type", "Size", "Uploaded", "Status"],
            rows.map((row) => [row.name, row.category, row.type, row.size, row.uploadedAt, row.status]),
          )
        }
        addLabel="Upload document"
        onAdd={openCreate}
        empty={{ title: "No documents", description: "Upload invoices, receipts and certificates to build your archive.", icon: FolderArchive }}
      />

      <RecordDialog
        open={formOpen}
        title={editing ? "Replace document details" : "Upload document"}
        description="Store the document reference, category and review status."
        submitLabel={editing ? "Update" : "Upload"}
        initialValue={editing ? { ...editing } : null}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
        fields={[
          { name: "name", label: "Document name", type: "text", required: true, half: true },
          { name: "category", label: "Category", type: "select", options: ["Receipts", "Invoices", "Certificates", "Returns", "Other"], half: true },
          { name: "type", label: "File type", type: "select", options: ["PDF", "Excel", "Image", "Word"], half: true },
          { name: "size", label: "Size", type: "text", half: true },
          { name: "uploadedAt", label: "Uploaded", type: "date", required: true, half: true },
          { name: "status", label: "Status", type: "select", options: ["Verified", "Pending"], half: true },
        ]}
      />

      <DetailsDrawer
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ""}
        description="Document details"
        rows={
          detail
            ? [
                { label: "Category", value: detail.category },
                { label: "Type", value: detail.type },
                { label: "Size", value: detail.size },
                { label: "Uploaded", value: detail.uploadedAt },
                { label: "Status", value: <StatusBadge value={detail.status} /> },
              ]
            : []
        }
        footer={
          detail ? (
            <>
              <Button
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/15"
                onClick={() =>
                  exportCsv("document.csv", ["Document", "Category", "Type", "Size", "Uploaded", "Status"], [[detail.name, detail.category, detail.type, detail.size, detail.uploadedAt, detail.status]])
                }
              >
                Download
              </Button>
              <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/15" onClick={() => { openEdit(detail); setDetail(null); }}>Replace</Button>
              <Button className="bg-rose-500 text-white hover:bg-rose-400" onClick={() => { setPendingDelete(detail); setDetail(null); }}>Delete</Button>
            </>
          ) : null
        }
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete document"
        description={`${pendingDelete?.name ?? ""} will be removed from the archive.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) { deleteDocument(pendingDelete.id); toast.success("Document deleted"); } }}
      />
    </TaxWorkspace>
  );
}
