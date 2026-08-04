import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type SaleRecord = {
  id: number;
  reference: string;
  customer: string;
  date: string;
  amount: number;
  vat: number;
  taxPeriod: string;
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
  taxPeriod: string;
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
  taxPeriod: string;
  status: "Approved" | "Pending";
};

export type VatReturnRecord = {
  id: number;
  period: string;
  outputVat: number;
  inputVat: number;
  payable: number;
  dueDate: string;
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  status: "Filed" | "Draft" | "Pending";
};

export type WithholdingRecord = {
  id: number;
  name: string;
  certificate: string;
  type: string;
  date: string;
  period: string;
  dueDate: string;
  amount: number;
  paymentStatus: "Paid" | "Unpaid";
  status: "Issued" | "Received" | "Pending";
};

export type PayeRecord = {
  id: number;
  period: string;
  employees: number;
  grossPay: number;
  payeAmount: number;
  dueDate: string;
  paymentStatus: "Paid" | "Unpaid";
  status: "Filed" | "Draft" | "Pending";
};

export type IncomeTaxRecord = {
  id: number;
  period: string;
  installment: string;
  profitBase: number;
  taxRate: number;
  amount: number;
  dueDate: string;
  paymentStatus: "Paid" | "Unpaid";
  status: "Filed" | "Draft" | "Pending";
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

export type ObligationStatus = "Upcoming" | "Pending" | "Paid" | "Overdue";

export type TaxObligation = {
  id: string;
  taxType: "VAT" | "Income Tax" | "Withholding Tax" | "PAYE";
  reference: string;
  period: string;
  dueDate: string;
  amount: number;
  status: ObligationStatus;
  filingStatus: string;
  daysLeft: number;
  reminderStage: 7 | 3 | 1 | null;
  reminderOn: boolean;
  sourceRoute: string;
  sourceLabel: string;
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
  dueSoon: number;
  overdue: number;
};

export type TaxModuleContextValue = {
  sales: SaleRecord[];
  purchases: PurchaseRecord[];
  expenses: ExpenseRecord[];
  vatReturns: VatReturnRecord[];
  withholding: WithholdingRecord[];
  paye: PayeRecord[];
  incomeTax: IncomeTaxRecord[];
  assets: AssetRecord[];
  documents: DocumentRecord[];
  imports: ImportLog[];
  taxRate: number;
  setTaxRate: (rate: number) => void;
  projectedAnnualProfit: number;
  setProjectedAnnualProfit: (value: number) => void;
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
  savePaye: (record: Omit<PayeRecord, "id">, id?: number) => void;
  deletePaye: (id: number) => void;
  saveIncomeTax: (record: Omit<IncomeTaxRecord, "id">, id?: number) => void;
  deleteIncomeTax: (id: number) => void;
  saveAsset: (record: Omit<AssetRecord, "id">, id?: number) => void;
  deleteAsset: (id: number) => void;
  saveDocument: (record: Omit<DocumentRecord, "id">, id?: number) => void;
  deleteDocument: (id: number) => void;
  addImport: (record: Omit<ImportLog, "id">) => void;
  deleteImport: (id: number) => void;
  obligations: TaxObligation[];
  toggleReminder: (id: string, on: boolean) => void;
  markObligationPaid: (obligation: TaxObligation) => void;
  metrics: Metrics;
};

const TaxModuleContext = createContext<TaxModuleContextValue | null>(null);

/* ------------------------------ date helpers ------------------------------ */

export function periodOf(date: string) {
  return date.slice(0, 7);
}

/** VAT and PAYE are due on the 20th of the month following the tax period. */
export function dueDateForPeriod(period: string, day = 20) {
  const [year, month] = period.split("-").map(Number);
  if (!year || !month) return period;
  const next = new Date(Date.UTC(year, month, day));
  return next.toISOString().slice(0, 10);
}

export function daysUntil(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function obligationStatus(dueDate: string, paid: boolean): ObligationStatus {
  if (paid) return "Paid";
  const left = daysUntil(dueDate);
  if (left < 0) return "Overdue";
  if (left <= 7) return "Pending";
  return "Upcoming";
}

function reminderStage(daysLeft: number, paid: boolean): 7 | 3 | 1 | null {
  if (paid || daysLeft < 0) return null;
  if (daysLeft <= 1) return 1;
  if (daysLeft <= 3) return 3;
  if (daysLeft <= 7) return 7;
  return null;
}

/* -------------------------------- seed data ------------------------------- */

const initialSales: SaleRecord[] = [
  { id: 1, reference: "INV-001", customer: "Nile Traders", date: "2026-07-02", amount: 12000000, vat: 2160000, taxPeriod: "2026-07", status: "Reviewed" },
  { id: 2, reference: "INV-002", customer: "Apex Supplies", date: "2026-07-08", amount: 8600000, vat: 1548000, taxPeriod: "2026-07", status: "Recorded" },
  { id: 3, reference: "INV-003", customer: "Zanzi Foods", date: "2026-07-19", amount: 5400000, vat: 972000, taxPeriod: "2026-07", status: "Pending" },
];

const initialPurchases: PurchaseRecord[] = [
  { id: 1, supplier: "Northline Ltd", date: "2026-07-05", amount: 4200000, deductible: true, category: "Inventory", attachment: true, taxPeriod: "2026-07", status: "Verified" },
  { id: 2, supplier: "Metro Office", date: "2026-07-10", amount: 1800000, deductible: false, category: "Entertainment", attachment: false, taxPeriod: "2026-07", status: "Pending" },
];

const initialExpenses: ExpenseRecord[] = [
  { id: 1, description: "Fuel & transport", category: "Operations", date: "2026-07-06", amount: 720000, deductible: true, receipt: true, taxPeriod: "2026-07", status: "Approved" },
  { id: 2, description: "Client lunch", category: "Entertainment", date: "2026-07-12", amount: 280000, deductible: false, receipt: true, taxPeriod: "2026-07", status: "Pending" },
];

const initialVatReturns: VatReturnRecord[] = [
  { id: 1, period: "2026-06", outputVat: 3708000, inputVat: 2400000, payable: 1308000, dueDate: "2026-07-20", paymentStatus: "Paid", status: "Filed" },
  { id: 2, period: "2026-07", outputVat: 3708000, inputVat: 2900000, payable: 808000, dueDate: "2026-08-20", paymentStatus: "Unpaid", status: "Draft" },
];

const initialWithholding: WithholdingRecord[] = [
  { id: 1, name: "BluePeak Studio", certificate: "WHT-2026-011", type: "Service", date: "2026-07-04", period: "2026-07", dueDate: "2026-08-07", amount: 820000, paymentStatus: "Paid", status: "Issued" },
  { id: 2, name: "Harbor Logistics", certificate: "WHT-2026-012", type: "Supply", date: "2026-07-15", period: "2026-07", dueDate: "2026-08-07", amount: 410000, paymentStatus: "Unpaid", status: "Received" },
];

const initialPaye: PayeRecord[] = [
  { id: 1, period: "2026-06", employees: 12, grossPay: 14400000, payeAmount: 1980000, dueDate: "2026-07-07", paymentStatus: "Paid", status: "Filed" },
  { id: 2, period: "2026-07", employees: 13, grossPay: 15200000, payeAmount: 2130000, dueDate: "2026-08-07", paymentStatus: "Unpaid", status: "Draft" },
];

const initialIncomeTax: IncomeTaxRecord[] = [
  { id: 1, period: "2026", installment: "Q1 provisional", profitBase: 42000000, taxRate: 30, amount: 3150000, dueDate: "2026-03-31", paymentStatus: "Paid", status: "Filed" },
  { id: 2, period: "2026", installment: "Q2 provisional", profitBase: 42000000, taxRate: 30, amount: 3150000, dueDate: "2026-06-30", paymentStatus: "Paid", status: "Filed" },
  { id: 3, period: "2026", installment: "Q3 provisional", profitBase: 42000000, taxRate: 30, amount: 3150000, dueDate: "2026-09-30", paymentStatus: "Unpaid", status: "Draft" },
  { id: 4, period: "2026", installment: "Q4 provisional", profitBase: 42000000, taxRate: 30, amount: 3150000, dueDate: "2026-12-31", paymentStatus: "Unpaid", status: "Draft" },
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

const STORAGE_KEY = "bizz.tax.module.v2";

type Snapshot = {
  sales: SaleRecord[];
  purchases: PurchaseRecord[];
  expenses: ExpenseRecord[];
  vatReturns: VatReturnRecord[];
  withholding: WithholdingRecord[];
  paye: PayeRecord[];
  incomeTax: IncomeTaxRecord[];
  assets: AssetRecord[];
  documents: DocumentRecord[];
  imports: ImportLog[];
  reminders: Record<string, boolean>;
  taxRate: number;
  projectedAnnualProfit: number;
};

export function TaxModuleProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState(initialSales);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [vatReturns, setVatReturns] = useState(initialVatReturns);
  const [withholding, setWithholding] = useState(initialWithholding);
  const [paye, setPaye] = useState(initialPaye);
  const [incomeTax, setIncomeTax] = useState(initialIncomeTax);
  const [assets, setAssets] = useState(initialAssets);
  const [documents, setDocuments] = useState(initialDocuments);
  const [imports, setImports] = useState(initialImports);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [taxRate, setTaxRate] = useState(30);
  const [projectedAnnualProfit, setProjectedAnnualProfit] = useState(42000000);
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
        if (saved.paye) setPaye(saved.paye);
        if (saved.incomeTax) setIncomeTax(saved.incomeTax);
        if (saved.assets) setAssets(saved.assets);
        if (saved.documents) setDocuments(saved.documents);
        if (saved.imports) setImports(saved.imports);
        if (saved.reminders) setReminders(saved.reminders);
        if (typeof saved.taxRate === "number") setTaxRate(saved.taxRate);
        if (typeof saved.projectedAnnualProfit === "number") setProjectedAnnualProfit(saved.projectedAnnualProfit);
      }
    } catch {
      /* ignore corrupt cache */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const snapshot: Snapshot = {
      sales, purchases, expenses, vatReturns, withholding, paye, incomeTax,
      assets, documents, imports, reminders, taxRate, projectedAnnualProfit,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      /* storage full — ignore */
    }
  }, [hydrated, sales, purchases, expenses, vatReturns, withholding, paye, incomeTax, assets, documents, imports, reminders, taxRate, projectedAnnualProfit]);

  const obligations = useMemo<TaxObligation[]>(() => {
    const build = (
      id: string,
      taxType: TaxObligation["taxType"],
      reference: string,
      period: string,
      dueDate: string,
      amount: number,
      paid: boolean,
      filingStatus: string,
      sourceRoute: string,
      sourceLabel: string,
    ): TaxObligation => {
      const daysLeft = daysUntil(dueDate);
      return {
        id, taxType, reference, period, dueDate, amount,
        status: obligationStatus(dueDate, paid),
        filingStatus,
        daysLeft,
        reminderStage: reminderStage(daysLeft, paid),
        reminderOn: reminders[id] ?? true,
        sourceRoute, sourceLabel,
      };
    };

    const items: TaxObligation[] = [
      ...vatReturns.map((row) =>
        build(`vat-${row.id}`, "VAT", `VAT return ${row.period}`, row.period, row.dueDate, row.payable,
          row.paymentStatus === "Paid", row.status, "/m/tax/vat", "VAT Returns")),
      ...paye.map((row) =>
        build(`paye-${row.id}`, "PAYE", `PAYE ${row.period}`, row.period, row.dueDate, row.payeAmount,
          row.paymentStatus === "Paid", row.status, "/m/tax/withholding", "PAYE Returns")),
      ...withholding.map((row) =>
        build(`wht-${row.id}`, "Withholding Tax", row.certificate, row.period, row.dueDate, row.amount,
          row.paymentStatus === "Paid", row.status, "/m/tax/withholding", "Withholding Tax")),
      ...incomeTax.map((row) =>
        build(`cit-${row.id}`, "Income Tax", `${row.installment} ${row.period}`, row.period, row.dueDate, row.amount,
          row.paymentStatus === "Paid", row.status, "/m/tax/income", "Income Tax")),
    ];

    return items.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [vatReturns, paye, withholding, incomeTax, reminders]);

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
    const projectedProfit = projectedAnnualProfit || currentProfit * 1.25;
    const estimatedTax = projectedProfit * (taxRate / 100);

    const documented = documents.filter((item) => item.status === "Verified").length;
    const docScore = documents.length ? (documented / documents.length) * 25 : 0;
    const receiptScore = expenses.length ? (expenses.filter((item) => item.receipt).length / expenses.length) * 25 : 0;
    const filedScore = vatReturns.length ? (vatReturns.filter((item) => item.status === "Filed").length / vatReturns.length) * 25 : 0;
    const overdue = obligations.filter((item) => item.status === "Overdue").length;
    const dueSoon = obligations.filter((item) => item.status === "Pending").length;
    const calendarScore = obligations.length ? ((obligations.length - overdue) / obligations.length) * 25 : 25;
    const complianceScore = Math.round(docScore + receiptScore + filedScore + calendarScore);
    const riskLevel: Metrics["riskLevel"] = overdue > 0 ? "High" : complianceScore >= 80 ? "Low" : complianceScore >= 55 ? "Medium" : "High";

    return {
      salesTotal, salesVat, purchaseTotal, purchaseDeduction, expenseTotal, deductibleExpenses,
      outputVat, inputVat, vatPayable, currentProfit, projectedProfit, estimatedTax,
      complianceScore, riskLevel, dueSoon, overdue,
    };
  }, [sales, purchases, expenses, assets, documents, vatReturns, obligations, taxRate, projectedAnnualProfit]);

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

  const markObligationPaid = useCallback((obligation: TaxObligation) => {
    const rawId = Number(obligation.id.split("-")[1]);
    if (obligation.taxType === "VAT") {
      setVatReturns((current) => current.map((row) => (row.id === rawId ? { ...row, paymentStatus: "Paid", status: "Filed" } : row)));
    } else if (obligation.taxType === "PAYE") {
      setPaye((current) => current.map((row) => (row.id === rawId ? { ...row, paymentStatus: "Paid", status: "Filed" } : row)));
    } else if (obligation.taxType === "Withholding Tax") {
      setWithholding((current) => current.map((row) => (row.id === rawId ? { ...row, paymentStatus: "Paid" } : row)));
    } else {
      setIncomeTax((current) => current.map((row) => (row.id === rawId ? { ...row, paymentStatus: "Paid", status: "Filed" } : row)));
    }
  }, []);

  const value: TaxModuleContextValue = {
    sales, purchases, expenses, vatReturns, withholding, paye, incomeTax, assets, documents, imports,
    taxRate, setTaxRate, projectedAnnualProfit, setProjectedAnnualProfit,
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
    savePaye: upsert(setPaye),
    deletePaye: remove(setPaye),
    saveIncomeTax: upsert(setIncomeTax),
    deleteIncomeTax: remove(setIncomeTax),
    saveAsset: upsert(setAssets),
    deleteAsset: remove(setAssets),
    saveDocument: upsert(setDocuments),
    deleteDocument: remove(setDocuments),
    addImport: (record) => setImports((current) => [{ id: Date.now(), ...record }, ...current]),
    deleteImport: remove(setImports),
    obligations,
    toggleReminder: (id, on) => setReminders((current) => ({ ...current, [id]: on })),
    markObligationPaid,
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
