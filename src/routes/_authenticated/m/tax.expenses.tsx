import { createFileRoute } from "@tanstack/react-router";
import { Receipt, FilePlus2, Tags, Paperclip, BarChart3 } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/expenses")({ component: TaxExpensesHub });

function TaxExpensesHub() {
  return (
    <TaxLayout
      title="Tax Expenses"
      subtitle="Expenses recorded for tax purposes only"
      headerIcon={Receipt}
      cards={[
        { label: "Expense Entry", icon: FilePlus2 },
        { label: "Categories", icon: Tags },
        { label: "Documents", icon: Paperclip },
        { label: "Summary", icon: BarChart3 },
      ]}
      sections={[
        {
          title: "Manage",
          icon: Receipt,
          items: [
            { label: "Expense Entry", icon: FilePlus2 },
            { label: "Expense Categories", icon: Tags },
            { label: "Supporting Documents", icon: Paperclip },
            { label: "Expense Summary", icon: BarChart3 },
          ],
        },
      ]}
    />
  );
}
