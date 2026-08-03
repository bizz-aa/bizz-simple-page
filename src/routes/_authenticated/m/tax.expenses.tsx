import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Receipt, FilePlus2, Tags, Paperclip, BarChart3, BadgeCheck, CircleDollarSign, ScanLine, Sparkles } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";
import { useTaxModule, formatCurrency } from "@/components/tax-module-provider";
import { TaxDataTable } from "@/components/tax-data-table";
import { ExpenseForm } from "@/components/tax-forms";
import { EmptyState, InsightPanel, MetricCard, ProgressBar, StatusPill } from "@/components/tax-workspace-ui";

export const Route = createFileRoute("/_authenticated/m/tax/expenses")({ component: TaxExpensesHub });

function TaxExpensesHub() {
  const { expenses, addExpense, updateExpense, deleteExpense, metrics } = useTaxModule();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const current = expenses.find((item) => item.id === editing);

  return (
    <TaxLayout
      title="Expenses"
      subtitle="Deductible expense tracking and review"
      headerIcon={Receipt}
      cards={[
        { label: "Expense Entry", icon: FilePlus2 },
        { label: "Categories", icon: Tags },
        { label: "Receipts", icon: Paperclip },
        { label: "Tax Savings", icon: CircleDollarSign },
      ]}
      sections={[
        {
          title: "Expense Controls",
          icon: Receipt,
          items: [
            { label: "Expense Entry", icon: FilePlus2 },
            { label: "Expense Categories", icon: Tags },
            { label: "Supporting Documents", icon: Paperclip },
            { label: "Expense Summary", icon: BarChart3 },
          ],
        },
      ]}
    >
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel title="Deductible Expense Review" icon={BadgeCheck} tone="emerald" action={<StatusPill label="Optimized" tone="emerald" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Deductible" value={formatCurrency(metrics.deductibleExpenses)} tone="emerald" />
            <MetricCard label="Non-Deductible" value={formatCurrency(metrics.expenseTotal - metrics.deductibleExpenses)} tone="amber" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <ProgressBar label="Receipt completeness" value={79} tone="emerald" />
          </div>
        </InsightPanel>

        <InsightPanel title="Tax Saving Opportunities" icon={Sparkles} tone="violet">
          <MetricCard label="Potential savings" value={formatCurrency(metrics.deductibleExpenses * 0.3)} tone="violet" />
          <MetricCard label="Pending review" value={expenses.filter((item) => item.status === "Pending").length.toString()} tone="amber" />
          <MetricCard label="Receipts ready" value={expenses.filter((item) => item.receipt).length.toString()} tone="slate" />
        </InsightPanel>
      </div>

      <div className="mt-6">
        <TaxDataTable
          title="Expense register"
          rows={expenses}
          columns={[
            { key: "description", label: "Description" },
            { key: "category", label: "Category" },
            { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
            { key: "deductible", label: "Deductible", render: (row) => (row.deductible ? "Yes" : "No") },
            { key: "receipt", label: "Receipt", render: (row) => (row.receipt ? "Yes" : "No") },
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
          onDelete={(row) => deleteExpense(row.id)}
          emptyText="No expenses yet. Add the first expense to track tax-deductible spend and supporting evidence."
          emptyActionLabel="Add expense"
        />
      </div>

      <div className="mt-6">
        <EmptyState title="Expenses workspace is ready" description="Record expenses and receipts to expose deductibility, approval gaps, and tax saving opportunities." icon={Receipt} />
      </div>

      <ExpenseForm
        open={showForm}
        initialValue={current ? { description: current.description, category: current.category, amount: current.amount, deductible: current.deductible, receipt: current.receipt, status: current.status } : undefined}
        onSave={(value) => {
          if (editing) {
            updateExpense(editing, value);
          } else {
            addExpense(value);
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
