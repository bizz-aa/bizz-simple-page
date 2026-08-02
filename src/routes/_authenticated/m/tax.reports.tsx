import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Percent, Coins, ShoppingCart, ShoppingBag, Receipt, CalendarDays, CalendarRange } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/reports")({ component: TaxReportsHub });

function TaxReportsHub() {
  return (
    <TaxLayout
      title="Tax Reports"
      subtitle="Filter, export, print & generate PDF"
      headerIcon={BarChart3}
      cards={[
        { label: "VAT", icon: Percent },
        { label: "Income Tax", icon: Coins },
        { label: "Sales", icon: ShoppingCart },
        { label: "Purchases", icon: ShoppingBag },
      ]}
      sections={[
        {
          title: "Reports",
          icon: BarChart3,
          items: [
            { label: "VAT Reports", icon: Percent },
            { label: "Income Tax Reports", icon: Coins },
            { label: "Sales Reports", icon: ShoppingCart },
            { label: "Purchase Reports", icon: ShoppingBag },
            { label: "Expense Reports", icon: Receipt },
            { label: "Monthly Reports", icon: CalendarDays },
            { label: "Annual Reports", icon: CalendarRange },
          ],
        },
      ]}
    />
  );
}
