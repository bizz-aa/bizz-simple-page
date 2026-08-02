import { createFileRoute } from "@tanstack/react-router";
import { FolderArchive, Receipt, FileText, FileCheck2, FileBarChart, Files } from "lucide-react";
import { TaxLayout } from "@/components/tax-layout";

export const Route = createFileRoute("/_authenticated/m/tax/documents")({ component: DocumentsHub });

function DocumentsHub() {
  return (
    <TaxLayout
      title="Document Center"
      subtitle="Receipts, invoices, certificates & filings"
      headerIcon={FolderArchive}
      cards={[
        { label: "Receipts", icon: Receipt },
        { label: "Invoices", icon: FileText },
        { label: "Certificates", icon: FileCheck2 },
        { label: "Returns", icon: FileBarChart },
      ]}
      sections={[
        {
          title: "Library",
          icon: FolderArchive,
          items: [
            { label: "Receipts", icon: Receipt },
            { label: "Invoices", icon: FileText },
            { label: "Tax Certificates", icon: FileCheck2 },
            { label: "Tax Returns", icon: FileBarChart },
            { label: "Other Documents", icon: Files },
          ],
        },
      ]}
    />
  );
}
