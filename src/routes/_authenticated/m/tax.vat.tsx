import { createFileRoute } from "@tanstack/react-router";
import { Percent, ArrowUpRight, ArrowDownLeft, Calculator, FileCheck2 } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/vat")({ component: VatHub });

function VatHub() {
  return (
    <TaxLayout
      title="VAT Management"
      subtitle="Output, input, calculation & returns"
      headerIcon={Percent}
      cards={[
        { label: "Output VAT", icon: ArrowUpRight },
        { label: "Input VAT", icon: ArrowDownLeft },
        { label: "Calculation", icon: Calculator },
        { label: "VAT Return", icon: FileCheck2 },
      ]}
      sections={[
        {
          title: "Workspace",
          icon: Percent,
          items: [
            { label: "Output VAT Register", icon: ArrowUpRight },
            { label: "Input VAT Register", icon: ArrowDownLeft },
            { label: "VAT Calculation", icon: Calculator },
            { label: "VAT Return", icon: FileCheck2 },
          ],
        },
      ]}
    />
  );
}
