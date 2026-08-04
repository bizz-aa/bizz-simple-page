import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Receipt, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTaxModule, formatCurrency, periodOf, type ExpenseRecord } from "@/components/tax-module-provider";
import { RecordDialog, ConfirmDialog, bool, num, str, type FieldValue } from "@/components/tax/record-dialog";
import { DetailsDrawer, StatusBadge, SummaryStrip, TaxTable, TaxWorkspace, exportCsv } from "@/components/tax/tax-workspace";

export const Route = createFileRoute("/_authenticated/m/tax/expenses")({ component: ExpensesPage });

function ExpensesPage() {
  const { expenses, saveExpense, deleteExpense, metrics } = useTaxModule();
  const [editing, setEditing] = useState<ExpenseRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detail, setDetail] = useState<ExpenseRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ExpenseRecord | null>(null);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (row: ExpenseRecord) => { setEditing(row); setFormOpen(true); };

  const submit = (value: Record<string, FieldValue>) => {
    saveExpense(
      {
        description: str(value.description),
        category: str(value.category),
        date: str(value.date),
        amount: num(value.amount),
        deductible: bool(value.deductible),
        receipt: bool(value.receipt),
        taxPeriod: periodOf(str(value.date)),
        status: str(value.status) as ExpenseRecord["status"],
      },
      editing?.id,
    );
    toast.success(editing ? "Expense updated" : "Expense created");
  };

  return (
    <TaxWorkspace
      title="Expenses"
      subtitle="Deductible business expenses and receipts"
      icon={Receipt}
      actions={
        <Button size="sm" className="h-9 bg-amber-400 text-black hover:bg-amber-300" onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> New expense
        </Button>
      }
    >
      <SummaryStrip
        items={[
          { label: "Total Expenses", value: formatCurrency(metrics.expenseTotal), hint: `${expenses.length} records`, accent: true },
          { label: "Deductible", value: formatCurrency(metrics.deductibleExpenses), hint: "Reduces taxable profit" },
          { label: "With Receipt", value: `${expenses.filter((row) => row.receipt).length}/${expenses.length || 0}`, hint: "Evidence attached" },
          { label: "Pending", value: String(expenses.filter((row) => row.status === "Pending").length), hint: "Awaiting approval" },
        ]}
      />

      <TaxTable
        rows={expenses}
        searchKeys={(row) => `${row.description} ${row.category} ${row.date} ${row.status}`}
        filter={{
          label: "Filter",
          options: [
            { value: "deductible", label: "Deductible" },
            { value: "non-deductible", label: "Non-deductible" },
            { value: "no-receipt", label: "No receipt" },
            { value: "Approved", label: "Approved" },
            { value: "Pending", label: "Pending" },
          ],
          match: (row, value) =>
            value === "deductible" ? row.deductible
              : value === "non-deductible" ? !row.deductible
              : value === "no-receipt" ? !row.receipt
              : row.status === value,
        }}
        columns={[
          { key: "description", label: "Expense", render: (row) => <span className="font-medium text-white">{row.description}</span> },
          { key: "category", label: "Category" },
          { key: "date", label: "Date", hideOnMobile: true },
          { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
          { key: "deductible", label: "Deductible", hideOnMobile: true, render: (row) => (row.deductible ? "Yes" : "No") },
          { key: "receipt", label: "Receipt", hideOnMobile: true, render: (row) => (row.receipt ? "Attached" : <span className="text-white/40">Missing</span>) },
          { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
        ]}
        onRowClick={setDetail}
        onEdit={openEdit}
        onDelete={setPendingDelete}
        onExport={(rows) =>
          exportCsv(
            "tax-expenses.csv",
            ["Expense", "Category", "Date", "Amount", "Deductible", "Receipt", "Status"],
            rows.map((row) => [row.description, row.category, row.date, row.amount, row.deductible ? "Yes" : "No", row.receipt ? "Yes" : "No", row.status]),
          )
        }
        addLabel="New expense"
        onAdd={openCreate}
        empty={{ title: "No expenses recorded", description: "Log business expenses to reduce your taxable profit.", icon: Receipt }}
      />

      <RecordDialog
        open={formOpen}
        title={editing ? "Edit expense" : "New expense"}
        description="Record the expense, category and receipt status."
        submitLabel={editing ? "Update" : "Create"}
        initialValue={editing ? { ...editing } : null}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
        fields={[
          { name: "description", label: "Expense", type: "text", required: true, half: true },
          { name: "category", label: "Category", type: "select", options: ["Rent", "Salaries", "Utilities", "Transport", "Marketing", "Office", "Other"], half: true },
          { name: "date", label: "Date", type: "date", required: true, half: true },
          { name: "amount", label: "Amount", type: "number", required: true, half: true },
          { name: "status", label: "Status", type: "select", options: ["Approved", "Pending"], half: true },
          { name: "deductible", label: "Tax deductible", type: "switch", defaultValue: true, half: true },
          { name: "receipt", label: "Receipt attached", type: "switch", half: true },
        ]}
      />

      <DetailsDrawer
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.description ?? ""}
        description="Expense details"
        rows={
          detail
            ? [
                { label: "Category", value: detail.category },
                { label: "Date", value: detail.date },
                { label: "Amount", value: formatCurrency(detail.amount) },
                { label: "Deductible", value: detail.deductible ? "Yes" : "No" },
                { label: "Receipt", value: detail.receipt ? "Attached" : "Missing" },
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
        title="Delete expense"
        description={`${pendingDelete?.description ?? ""} will be removed from your expense register.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) { deleteExpense(pendingDelete.id); toast.success("Expense deleted"); } }}
      />
    </TaxWorkspace>
  );
}
