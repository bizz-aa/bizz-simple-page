import { createFileRoute } from "@tanstack/react-router";
import { Coins, TrendingUp, CheckCircle2, XCircle, Calculator } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/income")({ component: IncomeTaxHub });

function IncomeTaxHub() {
  return (
    <TaxLayout
      title="Income Tax"
      subtitle="Taxable income & tax calculation"
      headerIcon={Coins}
      cards={[
        { label: "Taxable Income", icon: TrendingUp },
        { label: "Allowable", icon: CheckCircle2 },
        { label: "Non-Allowable", icon: XCircle },
        { label: "Calculation", icon: Calculator },
      ]}
      sections={[
        {
          title: "Workspace",
          icon: Coins,
          items: [
            { label: "Taxable Income", icon: TrendingUp },
            { label: "Allowable Expenses", icon: CheckCircle2 },
            { label: "Non-Allowable Expenses", icon: XCircle },
            { label: "Tax Calculation", icon: Calculator },
          ],
        },
      ]}
    />
  );
}
