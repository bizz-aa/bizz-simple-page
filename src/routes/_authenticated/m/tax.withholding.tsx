import { createFileRoute } from "@tanstack/react-router";
import { HandCoins, FilePlus2, Calculator, FileCheck2, BarChart3 } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/withholding")({ component: WithholdingHub });

function WithholdingHub() {
  return (
    <TaxLayout
      title="Withholding Tax"
      subtitle="WHT records, certificates & reports"
      headerIcon={HandCoins}
      cards={[
        { label: "New Record", icon: FilePlus2 },
        { label: "Calculation", icon: Calculator },
        { label: "Certificates", icon: FileCheck2 },
        { label: "Reports", icon: BarChart3 },
      ]}
      sections={[
        {
          title: "Manage",
          icon: HandCoins,
          items: [
            { label: "Withholding Records", icon: FilePlus2 },
            { label: "WHT Calculation", icon: Calculator },
            { label: "WHT Certificates", icon: FileCheck2 },
            { label: "WHT Reports", icon: BarChart3 },
          ],
        },
      ]}
    />
  );
}
