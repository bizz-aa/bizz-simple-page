import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, FilePlus2, Receipt, Upload, Wrench, BarChart3 } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/sales")({ component: TaxSalesHub });

function TaxSalesHub() {
  return (
    <TaxLayout
      title="Tax Sales"
      subtitle="Sales recorded for tax purposes only"
      headerIcon={ShoppingCart}
      cards={[
        { label: "Sales Entry", icon: FilePlus2 },
        { label: "Receipts", icon: Receipt },
        { label: "Import", icon: Upload },
        { label: "Adjustments", icon: Wrench },
      ]}
      sections={[
        {
          title: "Manage",
          icon: ShoppingCart,
          items: [
            { label: "Sales Entry", icon: FilePlus2 },
            { label: "Receipt Management", icon: Receipt },
            { label: "Import Sales (Excel / CSV)", icon: Upload },
            { label: "Sales Adjustments", icon: Wrench },
            { label: "Sales Summary", icon: BarChart3 },
          ],
        },
      ]}
    />
  );
}
