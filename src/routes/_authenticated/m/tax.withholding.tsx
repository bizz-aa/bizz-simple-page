import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HandCoins, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTaxModule, formatCurrency, type WithholdingRecord } from "@/components/tax-module-provider";
import { RecordDialog, ConfirmDialog, num, str, type FieldValue } from "@/components/tax/record-dialog";
import { DetailsDrawer, StatusBadge, SummaryStrip, TaxTable, TaxWorkspace, exportCsv } from "@/components/tax/tax-workspace";

export const Route = createFileRoute("/_authenticated/m/tax/withholding")({ component: WithholdingPage });

function WithholdingPage() {
  const { withholding, saveWithholding, deleteWithholding } = useTaxModule();
  const [editing, setEditing] = useState<WithholdingRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detail, setDetail] = useState<WithholdingRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<WithholdingRecord | null>(null);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (row: WithholdingRecord) => { setEditing(row); setFormOpen(true); };

  const receivable = withholding.reduce((sum, row) => sum + (row.status === "Received" ? row.amount : 0), 0);
  const payable = withholding.reduce((sum, row) => sum + (row.status === "Issued" ? row.amount : 0), 0);

  const submit = (value: Record<string, FieldValue>) => {
    saveWithholding(
      {
        name: str(value.name),
        certificate: str(value.certificate),
        type: str(value.type),
        date: str(value.date),
        amount: num(value.amount),
        status: str(value.status) as WithholdingRecord["status"],
      },
      editing?.id,
    );
    toast.success(editing ? "Record updated" : "Record created");
  };

  return (
    <TaxWorkspace
      title="Withholding Tax"
      subtitle="Certificates, payments and balances"
      icon={HandCoins}
      actions={
        <Button size="sm" className="h-9 bg-amber-400 text-black hover:bg-amber-300" onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> New record
        </Button>
      }
    >
      <SummaryStrip
        items={[
          { label: "Receivable", value: formatCurrency(receivable), hint: "Certificates received", accent: true },
          { label: "Payable", value: formatCurrency(payable), hint: "Certificates issued" },
          { label: "Certificates", value: String(withholding.length), hint: "Total on file" },
          { label: "Pending", value: String(withholding.filter((row) => row.status === "Pending").length), hint: "Awaiting certificate" },
        ]}
      />

      <TaxTable
        rows={withholding}
        searchKeys={(row) => `${row.name} ${row.certificate} ${row.type} ${row.status}`}
        filter={{
          label: "Status",
          options: [
            { value: "Issued", label: "Issued" },
            { value: "Received", label: "Received" },
            { value: "Pending", label: "Pending" },
          ],
          match: (row, value) => row.status === value,
        }}
        columns={[
          { key: "name", label: "Counterparty", render: (row) => <span className="font-medium text-white">{row.name}</span> },
          { key: "certificate", label: "Certificate", hideOnMobile: true },
          { key: "type", label: "Type", hideOnMobile: true },
          { key: "date", label: "Date", hideOnMobile: true },
          { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
          { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
        ]}
        onRowClick={setDetail}
        onEdit={openEdit}
        onDelete={setPendingDelete}
        onExport={(rows) =>
          exportCsv(
            "withholding-tax.csv",
            ["Counterparty", "Certificate", "Type", "Date", "Amount", "Status"],
            rows.map((row) => [row.name, row.certificate, row.type, row.date, row.amount, row.status]),
          )
        }
        addLabel="New record"
        onAdd={openCreate}
        empty={{ title: "No withholding records", description: "Add certificates and payments to track WHT balances.", icon: HandCoins }}
      />

      <RecordDialog
        open={formOpen}
        title={editing ? "Edit withholding record" : "New withholding record"}
        description="Track certificates issued to and received from counterparties."
        submitLabel={editing ? "Update" : "Create"}
        initialValue={editing ? { ...editing } : null}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
        fields={[
          { name: "name", label: "Counterparty", type: "text", required: true, half: true },
          { name: "certificate", label: "Certificate no.", type: "text", required: true, half: true },
          { name: "type", label: "Type", type: "select", options: ["Services", "Rent", "Dividends", "Interest", "Goods"], half: true },
          { name: "date", label: "Date", type: "date", required: true, half: true },
          { name: "amount", label: "Amount", type: "number", required: true, half: true },
          { name: "status", label: "Status", type: "select", options: ["Issued", "Received", "Pending"], half: true },
        ]}
      />

      <DetailsDrawer
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ""}
        description="Withholding record details"
        rows={
          detail
            ? [
                { label: "Certificate", value: detail.certificate },
                { label: "Type", value: detail.type },
                { label: "Date", value: detail.date },
                { label: "Amount", value: formatCurrency(detail.amount) },
                { label: "Status", value: <StatusBadge value={detail.status} /> },
              ]
            : []
        }
        footer={
          detail ? (
            <>
              <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/15" onClick={() => { openEdit(detail); setDetail(null); }}>Edit</Button>
              <Button className="bg-rose-500 text-white hover:bg-rose-400" onClick={() => { setPendingDelete(detail); setDetail(null); }}>Delete</Button>
            </>
          ) : null
        }
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete withholding record"
        description={`${pendingDelete?.name ?? ""} will be removed from the register.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) { deleteWithholding(pendingDelete.id); toast.success("Record deleted"); } }}
      />
    </TaxWorkspace>
  );
}
