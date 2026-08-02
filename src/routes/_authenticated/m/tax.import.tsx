import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileSpreadsheet, FileText, PenLine } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/import")({ component: ImportHub });

function ImportHub() {
  return (
    <TaxLayout
      title="Import Center"
      subtitle="Bring tax data in from any source"
      headerIcon={Upload}
      cards={[
        { label: "Excel", icon: FileSpreadsheet },
        { label: "CSV", icon: FileText },
        { label: "Manual", icon: PenLine },
        { label: "History", icon: Upload },
      ]}
      sections={[
        {
          title: "Import Methods",
          icon: Upload,
          items: [
            { label: "Import from Excel", icon: FileSpreadsheet },
            { label: "Import from CSV", icon: FileText },
            { label: "Manual Import / Entry", icon: PenLine },
            { label: "Import History", icon: Upload },
          ],
        },
      ]}
    />
  );
}
