import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, FilePlus2, Receipt, Upload, Wrench, BarChart3 } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/purchases")({ component: TaxPurchasesHub });

function TaxPurchasesHub() {
  return (
    <TaxLayout
      title="Manunuzi"
      subtitle="Manunuzi yaliyorekodiwa kwa ajili ya kodi"
      headerIcon={ShoppingBag}
      cards={[
        { label: "Purchase Entry", icon: FilePlus2 },
        { label: "Supplier Receipts", icon: Receipt },
        { label: "Import", icon: Upload },
        { label: "Adjustments", icon: Wrench },
      ]}
      sections={[
        {
          title: "Manage",
          icon: ShoppingBag,
          items: [
            { label: "Purchase Entry", icon: FilePlus2 },
            { label: "Supplier Receipts", icon: Receipt },
            { label: "Import Purchases (Excel / CSV)", icon: Upload },
            { label: "Purchase Adjustments", icon: Wrench },
            { label: "Purchase Summary", icon: BarChart3 },
          ],
        },
      ]}
    />
  );
}
