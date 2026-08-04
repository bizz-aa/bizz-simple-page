import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type SaleRecord = {
  id: number;
  reference: string;
  customer: string;
  date: string;
  amount: number;
  vat: number;
  status: "Recorded" | "Pending" | "Reviewed";
};

export type PurchaseRecord = {
  id: number;
  supplier: string;
  date: string;
  amount: number;
  deductible: boolean;
  category: string;
  attachment: boolean;
  status: "Verified" | "Pending";
};

export type ExpenseRecord = {
  id: number;
  description: string;
  category: string;
  date: string;
  amount: number;
  deductible: boolean;
  receipt: boolean;
  status: "Approved" | "Pending";
};

export type VatReturnRecord = {
  id: number;
  period: string;
  outputVat: number;
  inputVat: number;
  payable: number;
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  status: "Filed" | "Draft" | "Pending";
};

export type WithholdingRecord = {
  id: number;
  name: string;
  certificate: string;
  type: string;
  date: string;
  amount: number;
  status: "Issued" | "Received" | "Pending";
};

export type AssetRecord = {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  depreciation: number;
  usefulLife: number;
  status: "Active" | "Disposed";
};

export type DocumentRecord = {
  id: number;
  name: string;
  category: string;
  type: string;
  size: string;
  status: "Verified" | "Pending";
  uploadedAt: string;
};

export type ImportLog = {
  id: number;
  name: string;
  type: string;
  rows: number;
  duplicates: number;
  errors: number;
  status: "Completed" | "Errors" | "Review";
  importedAt: string;
};

type Metrics = {
  salesTotal: number;
  salesVat: number;
  purchaseTotal: number;
  purchaseDeduction: number;
  expenseTotal: number;
  deductibleExpenses: number;
  outputVat: number;
  inputVat: number;
  vatPayable: number;
  currentProfit: number;
  projectedProfit: number;
  estimatedTax: number;
  complianceScore: number;
  riskLevel: "Low" | "Medium" | "High";
};

export type TaxModuleContextValue = {
  sales: SaleRecord[];
  purchases: PurchaseRecord[];
  expenses: ExpenseRecord[];
  vatReturns: VatReturnRecord[];
  withholding: WithholdingRecord[];
  assets: AssetRecord[];
  documents: DocumentRecord[];
  imports: ImportLog[];
  saveSale: (record: Omit<SaleRecord, "id">, id?: number) => void;
  deleteSale: (id: number) => void;
  savePurchase: (record: Omit<PurchaseRecord, "id">, id?: number) => void;
  deletePurchase: (id: number) => void;
  saveExpense: (record: Omit<ExpenseRecord, "id">, id?: number) => void;
  deleteExpense: (id: number) => void;
  saveVatReturn: (record: Omit<VatReturnRecord, "id">, id?: number) => void;
  deleteVatReturn: (id: number) => void;
  saveWithholding: (record: Omit<WithholdingRecord, "id">, id?: number) => void;
  deleteWithholding: (id: number) => void;
  saveAsset: (record: Omit<AssetRecord, "id">, id?: number) => void;
  deleteAsset: (id: number) => void;
  saveDocument: (record: Omit<DocumentRecord, "id">, id?: number) => void;
  deleteDocument: (id: number) => void;
  addImport: (record: Omit<ImportLog, "id">) => void;
  deleteImport: (id: number) => void;
  metrics: Metrics;
};

const TaxModuleContext = createContext<TaxModuleContextValue | null>(null);

const initialSales: SaleRecord[] = [
  { id: 1, reference: "INV-001", customer: "Nile Traders", date: "2026-07-02", amount: 12000000, vat: 2160000, status: "Reviewed" },
  { id: 2, reference: "INV-002", customer: "Apex Supplies", date: "2026-07-08", amount: 8600000, vat: 1548000, status: "Recorded" },
  { id: 3, reference: "INV-003", customer: "Zanzi Foods", date: "2026-07-19", amount: 5400000, vat: 972000, status: "Pending" },
];

const initialPurchases: PurchaseRecord[] = [
  { id: 1, supplier: "Northline Ltd", date: "2026-07-05", amount: 4200000, deductible: true, category: "Inventory", attachment: true, status: "Verified" },
  { id: 2, supplier: "Metro Office", date: "2026-07-10", amount: 1800000, deductible: false, category: "Entertainment", attachment: false, status: "Pending" },
];

const initialExpenses: ExpenseRecord[] = [
  { id: 1, description: "Fuel & transport", category: "Operations", date: "2026-07-06", amount: 720000, deductible: true, receipt: true, status: "Approved" },
  { id: 2, description: "Client lunch", category: "Entertainment", date: "2026-07-12", amount: 280000, deductible: false, receipt: true, status: "Pending" },
];

const initialVatReturns: VatReturnRecord[] = [
  { id: 1, period: "2026-06", outputVat: 3708000, inputVat: 2400000, payable: 1308000, paymentStatus: "Paid", status: "Filed" },
  { id: 2, period: "2026-07", outputVat: 3708000, inputVat: 2900000, payable: 808000, paymentStatus: "Unpaid", status: "Draft" },
];

const initialWithholding: WithholdingRecord[] = [
  { id: 1, name: "BluePeak Studio", certificate: "WHT-2026-011", type: "Service", date: "2026-07-04", amount: 820000, status: "Issued" },
  { id: 2, name: "Harbor Logistics", certificate: "WHT-2026-012", type: "Supply", date: "2026-07-15", amount: 410000, status: "Received" },
];

const initialAssets: AssetRecord[] = [
  { id: 1, name: "Delivery Van", category: "Vehicle", purchaseDate: "2024-03-11", purchaseValue: 18000000, currentValue: 12600000, depreciation: 5400000, usefulLife: 5, status: "Active" },
  { id: 2, name: "Laptop", category: "Office", purchaseDate: "2025-01-20", purchaseValue: 3600000, currentValue: 1200000, depreciation: 2400000, usefulLife: 3, status: "Active" },
];

const initialDocuments: DocumentRecord[] = [
  { id: 1, name: "VAT Return June.pdf", category: "VAT", type: "PDF", size: "1.2 MB", status: "Verified", uploadedAt: "2026-07-18" },
  { id: 2, name: "Invoice-001.pdf", category: "Invoice", type: "PDF", size: "0.8 MB", status: "Pending", uploadedAt: "2026-07-20" },
];

const initialImports: ImportLog[] = [
  { id: 1, name: "June Sales.csv", type: "CSV", rows: 142, duplicates: 2, errors: 0, status: "Completed", importedAt: "2026-07-01" },
  { id: 2, name: "Expenses.xlsx", type: "Excel", rows: 54, duplicates: 1, errors: 3, status: "Review", importedAt: "2026-07-16" },
];

const STORAGE_KEY = "bizz.tax.module.v1";

type Snapshot = {
  sales: SaleRecord[];
  purchases: PurchaseRecord[];
  expenses: ExpenseRecord[];
  vatReturns: VatReturnRecord[];
  withholding: WithholdingRecord[];
  assets: AssetRecord[];
  documents: DocumentRecord[];
  imports: ImportLog[];
};

export function TaxModuleProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState(initialSales);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [vatReturns, setVatReturns] = useState(initialVatReturns);
  const [withholding, setWithholding] = useState(initialWithholding);
  const [assets, setAssets] = useState(initialAssets);
  const [documents, setDocuments] = useState(initialDocuments);
  const [imports, setImports] = useState(initialImports);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Snapshot>;
        if (saved.sales) setSales(saved.sales);
        if (saved.purchases) setPurchases(saved.purchases);
        if (saved.expenses) setExpenses(saved.expenses);
        if (saved.vatReturns) setVatReturns(saved.vatReturns);
        if (saved.withholding) setWithholding(saved.withholding);
        if (saved.assets) setAssets(saved.assets);
        if (saved.documents) setDocuments(saved.documents);
        if (saved.imports) setImports(saved.imports);
      }
    } catch {
      /* ignore corrupt cache */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const snapshot: Snapshot = { sales, purchases, expenses, vatReturns, withholding, assets, documents, imports };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      /* storage full — ignore */
    }
  }, [hydrated, sales, purchases, expenses, vatReturns, withholding, assets, documents, imports]);

  const metrics = useMemo<Metrics>(() => {
    const salesTotal = sales.reduce((sum, item) => sum + item.amount, 0);
    const salesVat = sales.reduce((sum, item) => sum + item.vat, 0);
    const purchaseTotal = purchases.reduce((sum, item) => sum + item.amount, 0);
    const purchaseDeduction = purchases.filter((item) => item.deductible).reduce((sum, item) => sum + item.amount, 0);
    const expenseTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
    const deductibleExpenses = expenses.filter((item) => item.deductible).reduce((sum, item) => sum + item.amount, 0);
    const depreciationTotal = assets.reduce((sum, item) => sum + item.depreciation, 0);
    const outputVat = salesVat;
    const inputVat = purchases.reduce((sum, item) => sum + (item.deductible ? item.amount * 0.18 : 0), 0);
    const vatPayable = Math.max(0, outputVat - inputVat);
    const currentProfit = Math.max(0, salesTotal - purchaseTotal - expenseTotal - depreciationTotal);
    const projectedProfit = currentProfit * 1.25;
    const estimatedTax = projectedProfit * 0.3;

    const documented = documents.filter((item) => item.status === "Verified").length;
    const docScore = documents.length ? (documented / documents.length) * 30 : 0;
    const receiptScore = expenses.length ? (expenses.filter((item) => item.receipt).length / expenses.length) * 30 : 0;
    const filedScore = vatReturns.length ? (vatReturns.filter((item) => item.status === "Filed").length / vatReturns.length) * 40 : 0;
    const complianceScore = Math.round(docScore + receiptScore + filedScore);
    const riskLevel: Metrics["riskLevel"] = complianceScore >= 80 ? "Low" : complianceScore >= 55 ? "Medium" : "High";

    return {
      salesTotal, salesVat, purchaseTotal, purchaseDeduction, expenseTotal, deductibleExpenses,
      outputVat, inputVat, vatPayable, currentProfit, projectedProfit, estimatedTax, complianceScore, riskLevel,
    };
  }, [sales, purchases, expenses, assets, documents, vatReturns]);

  const upsert = useCallback(
    <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
      (record: Omit<T, "id">, id?: number) => {
        setter((current) =>
          id
            ? current.map((item) => (item.id === id ? ({ ...item, ...record } as T) : item))
            : [{ id: Date.now(), ...record } as T, ...current],
        );
      },
    [],
  );

  const remove = useCallback(
    <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
      (id: number) => setter((current) => current.filter((item) => item.id !== id)),
    [],
  );

  const value: TaxModuleContextValue = {
    sales, purchases, expenses, vatReturns, withholding, assets, documents, imports,
    saveSale: upsert(setSales),
    deleteSale: remove(setSales),
    savePurchase: upsert(setPurchases),
    deletePurchase: remove(setPurchases),
    saveExpense: upsert(setExpenses),
    deleteExpense: remove(setExpenses),
    saveVatReturn: upsert(setVatReturns),
    deleteVatReturn: remove(setVatReturns),
    saveWithholding: upsert(setWithholding),
    deleteWithholding: remove(setWithholding),
    saveAsset: upsert(setAssets),
    deleteAsset: remove(setAssets),
    saveDocument: upsert(setDocuments),
    deleteDocument: remove(setDocuments),
    addImport: (record) => setImports((current) => [{ id: Date.now(), ...record }, ...current]),
    deleteImport: remove(setImports),
    metrics,
  };

  return <TaxModuleContext.Provider value={value}>{children}</TaxModuleContext.Provider>;
}

export function useTaxModule() {
  const ctx = useContext(TaxModuleContext);
  if (!ctx) throw new Error("useTaxModule must be used inside TaxModuleProvider");
  return ctx;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS", maximumFractionDigits: 0 }).format(value);
}
