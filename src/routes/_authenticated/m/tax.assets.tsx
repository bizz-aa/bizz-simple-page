import { createFileRoute } from "@tanstack/react-router";
import { Building2, FilePlus2, TrendingDown, BarChart3, FolderArchive } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/assets")({ component: AssetsHub });

function AssetsHub() {
  return (
    <TaxLayout
      title="Capital Assets"
      subtitle="Tax-related capital asset register"
      headerIcon={Building2}
      cards={[
        { label: "Add Asset", icon: FilePlus2 },
        { label: "Register", icon: FolderArchive },
        { label: "Depreciation", icon: TrendingDown },
        { label: "Reports", icon: BarChart3 },
      ]}
      sections={[
        {
          title: "Manage",
          icon: Building2,
          items: [
            { label: "Asset Register", icon: FolderArchive },
            { label: "Add / Edit Asset", icon: FilePlus2 },
            { label: "Depreciation Schedule", icon: TrendingDown },
            { label: "Capital Asset Reports", icon: BarChart3 },
          ],
        },
      ]}
    />
  );
}
