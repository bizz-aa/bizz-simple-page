import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

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
  status: "Verified" | "Pending";
};

export type ExpenseRecord = {
  id: number;
  description: string;
  category: string;
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
  status: "Filed" | "Draft" | "Pending";
};

export type WithholdingRecord = {
  id: number;
  name: string;
  type: string;
  amount: number;
  status: "Issued" | "Received" | "Pending";
};

export type AssetRecord = {
  id: number;
  name: string;
  category: string;
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
  status: "Completed" | "Errors" | "Review";
  summary: string;
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
  addSale: (record: Omit<SaleRecord, "id">) => void;
  updateSale: (id: number, record: Omit<SaleRecord, "id">) => void;
  deleteSale: (id: number) => void;
  addPurchase: (record: Omit<PurchaseRecord, "id">) => void;
  updatePurchase: (id: number, record: Omit<PurchaseRecord, "id">) => void;
  deletePurchase: (id: number) => void;
  addExpense: (record: Omit<ExpenseRecord, "id">) => void;
  updateExpense: (id: number, record: Omit<ExpenseRecord, "id">) => void;
  deleteExpense: (id: number) => void;
  addVatReturn: (record: Omit<VatReturnRecord, "id">) => void;
  addWithholding: (record: Omit<WithholdingRecord, "id">) => void;
  addAsset: (record: Omit<AssetRecord, "id">) => void;
  addDocument: (record: Omit<DocumentRecord, "id">) => void;
  deleteDocument: (id: number) => void;
  addImport: (record: Omit<ImportLog, "id">) => void;
  metrics: {
    salesTotal: number;
    purchaseTotal: number;
    expenseTotal: number;
    deductibleExpenses: number;
    outputVat: number;
    inputVat: number;
    vatPayable: number;
    projectedProfit: number;
    estimatedTax: number;
    complianceScore: number;
    riskLevel: "Low" | "Medium" | "High";
  };
};

const TaxModuleContext = createContext<TaxModuleContextValue | null>(null);

const initialSales: SaleRecord[] = [
  { id: 1, reference: "INV-001", customer: "Nile Traders", date: "2026-07-02", amount: 12000000, vat: 2160000, status: "Reviewed" },
  { id: 2, reference: "INV-002", customer: "Apex Supplies", date: "2026-07-08", amount: 8600000, vat: 1548000, status: "Recorded" },
];

const initialPurchases: PurchaseRecord[] = [
  { id: 1, supplier: "Northline Ltd", date: "2026-07-05", amount: 4200000, deductible: true, category: "Inventory", status: "Verified" },
  { id: 2, supplier: "Metro Office", date: "2026-07-10", amount: 1800000, deductible: false, category: "Entertainment", status: "Pending" },
];

const initialExpenses: ExpenseRecord[] = [
  { id: 1, description: "Fuel & transport", category: "Operations", amount: 720000, deductible: true, receipt: true, status: "Approved" },
  { id: 2, description: "Client lunch", category: "Entertainment", amount: 280000, deductible: false, receipt: true, status: "Pending" },
];

const initialVatReturns: VatReturnRecord[] = [
  { id: 1, period: "2026-06", outputVat: 3708000, inputVat: 2400000, payable: 1308000, status: "Filed" },
  { id: 2, period: "2026-07", outputVat: 3708000, inputVat: 2900000, payable: 808000, status: "Draft" },
];

const initialWithholding: WithholdingRecord[] = [
  { id: 1, name: "BluePeak Studio", type: "Service", amount: 820000, status: "Issued" },
  { id: 2, name: "Harbor Logistics", type: "Supply", amount: 410000, status: "Received" },
];

const initialAssets: AssetRecord[] = [
  { id: 1, name: "Delivery Van", category: "Vehicle", purchaseValue: 18000000, currentValue: 12600000, depreciation: 5400000, usefulLife: 5, status: "Active" },
  { id: 2, name: "Laptop", category: "Office", purchaseValue: 3600000, currentValue: 1200000, depreciation: 2400000, usefulLife: 3, status: "Active" },
];

const initialDocuments: DocumentRecord[] = [
  { id: 1, name: "VAT Return June.pdf", category: "VAT", type: "PDF", size: "1.2 MB", status: "Verified", uploadedAt: "2026-07-18" },
  { id: 2, name: "Invoice-001.pdf", category: "Invoice", type: "PDF", size: "0.8 MB", status: "Pending", uploadedAt: "2026-07-20" },
];

const initialImports: ImportLog[] = [
  { id: 1, name: "June Sales.csv", type: "CSV", rows: 142, status: "Completed", summary: "Imported 142 sales rows" },
  { id: 2, name: "Expenses.xlsx", type: "Excel", rows: 54, status: "Review", summary: "3 rows need confirmation" },
];

export function TaxModuleProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState(initialSales);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [vatReturns, setVatReturns] = useState(initialVatReturns);
  const [withholding, setWithholding] = useState(initialWithholding);
  const [assets, setAssets] = useState(initialAssets);
  const [documents, setDocuments] = useState(initialDocuments);
  const [imports, setImports] = useState(initialImports);

  const metrics = useMemo(() => {
    const salesTotal = sales.reduce((sum, item) => sum + item.amount, 0);
    const purchaseTotal = purchases.reduce((sum, item) => sum + item.amount, 0);
    const expenseTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
    const deductibleExpenses = expenses.filter((item) => item.deductible).reduce((sum, item) => sum + item.amount, 0);
    const outputVat = sales.reduce((sum, item) => sum + item.vat, 0);
    const inputVat = purchases.reduce((sum, item) => sum + (item.deductible ? item.amount * 0.18 : 0), 0);
    const vatPayable = Math.max(0, outputVat - inputVat);
    const projectedProfit = Math.max(0, salesTotal - purchaseTotal - expenseTotal + 4000000);
    const estimatedTax = projectedProfit * 0.3;
    const complianceScore = Math.min(100, 72 + deductibleExpenses / 2000000);
    const riskLevel: "Low" | "Medium" | "High" = complianceScore > 85 ? "Low" : complianceScore > 70 ? "Medium" : "High";

    return {
      salesTotal,
      purchaseTotal,
      expenseTotal,
      deductibleExpenses,
      outputVat,
      inputVat,
      vatPayable,
      projectedProfit,
      estimatedTax,
      complianceScore,
      riskLevel,
    };
  }, [sales, purchases, expenses]);

  const addSale = (record: Omit<SaleRecord, "id">) => {
    setSales((current) => [{ id: Date.now(), ...record }, ...current]);
  };

  const updateSale = (id: number, record: Omit<SaleRecord, "id">) => {
    setSales((current) => current.map((item) => (item.id === id ? { ...item, ...record } : item)));
  };

  const deleteSale = (id: number) => {
    setSales((current) => current.filter((item) => item.id !== id));
  };

  const addPurchase = (record: Omit<PurchaseRecord, "id">) => {
    setPurchases((current) => [{ id: Date.now(), ...record }, ...current]);
  };

  const updatePurchase = (id: number, record: Omit<PurchaseRecord, "id">) => {
    setPurchases((current) => current.map((item) => (item.id === id ? { ...item, ...record } : item)));
  };

  const deletePurchase = (id: number) => {
    setPurchases((current) => current.filter((item) => item.id !== id));
  };

  const addExpense = (record: Omit<ExpenseRecord, "id">) => {
    setExpenses((current) => [{ id: Date.now(), ...record }, ...current]);
  };

  const updateExpense = (id: number, record: Omit<ExpenseRecord, "id">) => {
    setExpenses((current) => current.map((item) => (item.id === id ? { ...item, ...record } : item)));
  };

  const deleteExpense = (id: number) => {
    setExpenses((current) => current.filter((item) => item.id !== id));
  };

  const addVatReturn = (record: Omit<VatReturnRecord, "id">) => {
    setVatReturns((current) => [{ id: Date.now(), ...record }, ...current]);
  };

  const addWithholding = (record: Omit<WithholdingRecord, "id">) => {
    setWithholding((current) => [{ id: Date.now(), ...record }, ...current]);
  };

  const addAsset = (record: Omit<AssetRecord, "id">) => {
    setAssets((current) => [{ id: Date.now(), ...record }, ...current]);
  };

  const addDocument = (record: Omit<DocumentRecord, "id">) => {
    setDocuments((current) => [{ id: Date.now(), ...record }, ...current]);
  };

  const deleteDocument = (id: number) => {
    setDocuments((current) => current.filter((item) => item.id !== id));
  };

  const addImport = (record: Omit<ImportLog, "id">) => {
    setImports((current) => [{ id: Date.now(), ...record }, ...current]);
  };

  const value: TaxModuleContextValue = {
    sales,
    purchases,
    expenses,
    vatReturns,
    withholding,
    assets,
    documents,
    imports,
    addSale,
    updateSale,
    deleteSale,
    addPurchase,
    updatePurchase,
    deletePurchase,
    addExpense,
    updateExpense,
    deleteExpense,
    addVatReturn,
    addWithholding,
    addAsset,
    addDocument,
    deleteDocument,
    addImport,
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
