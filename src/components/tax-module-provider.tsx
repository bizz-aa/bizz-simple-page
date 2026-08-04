import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SaleRecord = {
  id: string;
  reference: string;
  customer: string;
  date: string;
  amount: number;
  vat: number;
  taxPeriod: string;
  status: "Recorded" | "Pending" | "Reviewed";
};

export type PurchaseRecord = {
  id: string;
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
  id: string;
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
  id: string;
  period: string;
  outputVat: number;
  inputVat: number;
  payable: number;
  dueDate: string;
  paymentStatus: "Paid" | "Unpaid" | "Partial";
  status: "Filed" | "Draft" | "Pending";
};

export type WithholdingRecord = {
  id: string;
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
  id: string;
  period: string;
  employees: number;
  grossPay: number;
  payeAmount: number;
  dueDate: string;
  paymentStatus: "Paid" | "Unpaid";
  status: "Filed" | "Draft" | "Pending";
};

export type IncomeTaxRecord = {
  id: string;
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
  id: string;
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
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  status: "Verified" | "Pending";
  uploadedAt: string;
};

export type ImportLog = {
  id: string;
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
  loading: boolean;
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
  saveSale: (record: Omit<SaleRecord, "id">, id?: string) => void;
  deleteSale: (id: string) => void;
  savePurchase: (record: Omit<PurchaseRecord, "id">, id?: string) => void;
  deletePurchase: (id: string) => void;
  saveExpense: (record: Omit<ExpenseRecord, "id">, id?: string) => void;
  deleteExpense: (id: string) => void;
  saveVatReturn: (record: Omit<VatReturnRecord, "id">, id?: string) => void;
  deleteVatReturn: (id: string) => void;
  saveWithholding: (record: Omit<WithholdingRecord, "id">, id?: string) => void;
  deleteWithholding: (id: string) => void;
  savePaye: (record: Omit<PayeRecord, "id">, id?: string) => void;
  deletePaye: (id: string) => void;
  saveIncomeTax: (record: Omit<IncomeTaxRecord, "id">, id?: string) => void;
  deleteIncomeTax: (id: string) => void;
  saveAsset: (record: Omit<AssetRecord, "id">, id?: string) => void;
  deleteAsset: (id: string) => void;
  saveDocument: (record: Omit<DocumentRecord, "id">, id?: string) => void;
  deleteDocument: (id: string) => void;
  addImport: (record: Omit<ImportLog, "id">) => void;
  deleteImport: (id: string) => void;
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

/* ------------------------------- row mappers ------------------------------ */

const num = (v: unknown) => Number(v ?? 0);
const str = (v: unknown) => (v == null ? "" : String(v));

const mapSale = (r: any): SaleRecord => ({
  id: r.id, reference: str(r.reference), customer: str(r.customer), date: str(r.date),
  amount: num(r.amount), vat: num(r.vat), taxPeriod: str(r.tax_period), status: r.status,
});
const saleRow = (r: Omit<SaleRecord, "id">) => ({
  reference: r.reference, customer: r.customer, date: r.date, amount: r.amount,
  vat: r.vat, tax_period: r.taxPeriod, status: r.status,
});

const mapPurchase = (r: any): PurchaseRecord => ({
  id: r.id, supplier: str(r.supplier), date: str(r.date), amount: num(r.amount),
  deductible: !!r.deductible, category: str(r.category), attachment: !!r.attachment,
  taxPeriod: str(r.tax_period), status: r.status,
});
const purchaseRow = (r: Omit<PurchaseRecord, "id">) => ({
  supplier: r.supplier, date: r.date, amount: r.amount, deductible: r.deductible,
  category: r.category, attachment: r.attachment, tax_period: r.taxPeriod, status: r.status,
});

const mapExpense = (r: any): ExpenseRecord => ({
  id: r.id, description: str(r.description), category: str(r.category), date: str(r.date),
  amount: num(r.amount), deductible: !!r.deductible, receipt: !!r.receipt,
  taxPeriod: str(r.tax_period), status: r.status,
});
const expenseRow = (r: Omit<ExpenseRecord, "id">) => ({
  description: r.description, category: r.category, date: r.date, amount: r.amount,
  deductible: r.deductible, receipt: r.receipt, tax_period: r.taxPeriod, status: r.status,
});

const mapVat = (r: any): VatReturnRecord => ({
  id: r.id, period: str(r.period), outputVat: num(r.output_vat), inputVat: num(r.input_vat),
  payable: num(r.payable), dueDate: str(r.due_date), paymentStatus: r.payment_status, status: r.status,
});
const vatRow = (r: Omit<VatReturnRecord, "id">) => ({
  period: r.period, output_vat: r.outputVat, input_vat: r.inputVat, payable: r.payable,
  due_date: r.dueDate, payment_status: r.paymentStatus, status: r.status,
});

const mapWht = (r: any): WithholdingRecord => ({
  id: r.id, name: str(r.name), certificate: str(r.certificate), type: str(r.type),
  date: str(r.date), period: str(r.period), dueDate: str(r.due_date), amount: num(r.amount),
  paymentStatus: r.payment_status, status: r.status,
});
const whtRow = (r: Omit<WithholdingRecord, "id">) => ({
  name: r.name, certificate: r.certificate, type: r.type, date: r.date, period: r.period,
  due_date: r.dueDate, amount: r.amount, payment_status: r.paymentStatus, status: r.status,
});

const mapPaye = (r: any): PayeRecord => ({
  id: r.id, period: str(r.period), employees: num(r.employees), grossPay: num(r.gross_pay),
  payeAmount: num(r.paye_amount), dueDate: str(r.due_date), paymentStatus: r.payment_status, status: r.status,
});
const payeRow = (r: Omit<PayeRecord, "id">) => ({
  period: r.period, employees: r.employees, gross_pay: r.grossPay, paye_amount: r.payeAmount,
  due_date: r.dueDate, payment_status: r.paymentStatus, status: r.status,
});

const mapIncome = (r: any): IncomeTaxRecord => ({
  id: r.id, period: str(r.period), installment: str(r.installment), profitBase: num(r.profit_base),
  taxRate: num(r.tax_rate), amount: num(r.amount), dueDate: str(r.due_date),
  paymentStatus: r.payment_status, status: r.status,
});
const incomeRow = (r: Omit<IncomeTaxRecord, "id">) => ({
  period: r.period, installment: r.installment, profit_base: r.profitBase, tax_rate: r.taxRate,
  amount: r.amount, due_date: r.dueDate, payment_status: r.paymentStatus, status: r.status,
});

const mapAsset = (r: any): AssetRecord => ({
  id: r.id, name: str(r.name), category: str(r.category), purchaseDate: str(r.purchase_date),
  purchaseValue: num(r.purchase_value), currentValue: num(r.current_value),
  depreciation: num(r.depreciation), usefulLife: num(r.useful_life), status: r.status,
});
const assetRow = (r: Omit<AssetRecord, "id">) => ({
  name: r.name, category: r.category, purchase_date: r.purchaseDate, purchase_value: r.purchaseValue,
  current_value: r.currentValue, depreciation: r.depreciation, useful_life: r.usefulLife, status: r.status,
});

const mapDocument = (r: any): DocumentRecord => ({
  id: r.id, name: str(r.name), category: str(r.category), type: str(r.type),
  size: str(r.size), status: r.status, uploadedAt: str(r.uploaded_at),
});
const documentRow = (r: Omit<DocumentRecord, "id">) => ({
  name: r.name, category: r.category, type: r.type, size: r.size, status: r.status, uploaded_at: r.uploadedAt,
});

const mapImport = (r: any): ImportLog => ({
  id: r.id, name: str(r.name), type: str(r.type), rows: num(r.rows_count),
  duplicates: num(r.duplicates), errors: num(r.errors), status: r.status, importedAt: str(r.imported_at),
});
const importRow = (r: Omit<ImportLog, "id">) => ({
  name: r.name, type: r.type, rows_count: r.rows, duplicates: r.duplicates,
  errors: r.errors, status: r.status, imported_at: r.importedAt,
});

/* -------------------------------- provider -------------------------------- */

export function TaxModuleProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [vatReturns, setVatReturns] = useState<VatReturnRecord[]>([]);
  const [withholding, setWithholding] = useState<WithholdingRecord[]>([]);
  const [paye, setPaye] = useState<PayeRecord[]>([]);
  const [incomeTax, setIncomeTax] = useState<IncomeTaxRecord[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [imports, setImports] = useState<ImportLog[]>([]);
  const [remindersOff, setRemindersOff] = useState<string[]>([]);
  const [taxRate, setTaxRateState] = useState(30);
  const [projectedAnnualProfit, setProjectedProfitState] = useState(0);

  const refresh = useCallback(async () => {
    const [s, p, e, v, w, py, it, a, d, im, st] = await Promise.all([
      supabase.from("tax_sales").select("*").order("date", { ascending: false }),
      supabase.from("tax_purchases").select("*").order("date", { ascending: false }),
      supabase.from("tax_expenses").select("*").order("date", { ascending: false }),
      supabase.from("vat_returns").select("*").order("period", { ascending: false }),
      supabase.from("withholding_records").select("*").order("date", { ascending: false }),
      supabase.from("paye_records").select("*").order("period", { ascending: false }),
      supabase.from("income_tax_records").select("*").order("due_date"),
      supabase.from("capital_assets").select("*").order("purchase_date", { ascending: false }),
      supabase.from("tax_documents").select("*").order("uploaded_at", { ascending: false }),
      supabase.from("tax_imports").select("*").order("imported_at", { ascending: false }),
      supabase.from("tax_settings").select("*").maybeSingle(),
    ]);
    setSales((s.data ?? []).map(mapSale));
    setPurchases((p.data ?? []).map(mapPurchase));
    setExpenses((e.data ?? []).map(mapExpense));
    setVatReturns((v.data ?? []).map(mapVat));
    setWithholding((w.data ?? []).map(mapWht));
    setPaye((py.data ?? []).map(mapPaye));
    setIncomeTax((it.data ?? []).map(mapIncome));
    setAssets((a.data ?? []).map(mapAsset));
    setDocuments((d.data ?? []).map(mapDocument));
    setImports((im.data ?? []).map(mapImport));
    if (st.data) {
      setTaxRateState(Number(st.data.tax_rate ?? 30));
      setProjectedProfitState(Number(st.data.projected_annual_profit ?? 0));
      setRemindersOff(st.data.reminders_off ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (!data.user) { setLoading(false); return; }
      void refresh();
    });
    return () => { active = false; };
  }, [refresh]);

  const saveSetting = useCallback(async (patch: Record<string, unknown>) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("tax_settings").upsert({ user_id: data.user.id, ...patch } as any);
  }, []);

  const setTaxRate = useCallback((rate: number) => {
    setTaxRateState(rate);
    void saveSetting({ tax_rate: rate });
  }, [saveSetting]);

  const setProjectedAnnualProfit = useCallback((value: number) => {
    setProjectedProfitState(value);
    void saveSetting({ projected_annual_profit: value });
  }, [saveSetting]);

  const makeSave = useCallback(
    <T,>(table: string, toRow: (record: T) => Record<string, unknown>) =>
      (record: T, id?: string) => {
        void (async () => {
          if (id) await supabase.from(table as any).update(toRow(record) as any).eq("id", id);
          else await supabase.from(table as any).insert(toRow(record) as any);
          await refresh();
        })();
      },
    [refresh],
  );

  const makeDelete = useCallback(
    (table: string) => (id: string) => {
      void (async () => {
        await supabase.from(table as any).delete().eq("id", id);
        await refresh();
      })();
    },
    [refresh],
  );

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
        reminderOn: !remindersOff.includes(id),
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
  }, [vatReturns, paye, withholding, incomeTax, remindersOff]);

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

  const markObligationPaid = useCallback((obligation: TaxObligation) => {
    const rawId = obligation.id.slice(obligation.id.indexOf("-") + 1);
    void (async () => {
      if (obligation.taxType === "VAT") {
        await supabase.from("vat_returns").update({ payment_status: "Paid", status: "Filed" }).eq("id", rawId);
      } else if (obligation.taxType === "PAYE") {
        await supabase.from("paye_records").update({ payment_status: "Paid", status: "Filed" }).eq("id", rawId);
      } else if (obligation.taxType === "Withholding Tax") {
        await supabase.from("withholding_records").update({ payment_status: "Paid" }).eq("id", rawId);
      } else {
        await supabase.from("income_tax_records").update({ payment_status: "Paid", status: "Filed" }).eq("id", rawId);
      }
      await refresh();
    })();
  }, [refresh]);

  const toggleReminder = useCallback((id: string, on: boolean) => {
    setRemindersOff((current) => {
      const next = on ? current.filter((item) => item !== id) : Array.from(new Set([...current, id]));
      void saveSetting({ reminders_off: next });
      return next;
    });
  }, [saveSetting]);

  const value: TaxModuleContextValue = {
    loading,
    sales, purchases, expenses, vatReturns, withholding, paye, incomeTax, assets, documents, imports,
    taxRate, setTaxRate, projectedAnnualProfit, setProjectedAnnualProfit,
    saveSale: makeSave("tax_sales", saleRow),
    deleteSale: makeDelete("tax_sales"),
    savePurchase: makeSave("tax_purchases", purchaseRow),
    deletePurchase: makeDelete("tax_purchases"),
    saveExpense: makeSave("tax_expenses", expenseRow),
    deleteExpense: makeDelete("tax_expenses"),
    saveVatReturn: makeSave("vat_returns", vatRow),
    deleteVatReturn: makeDelete("vat_returns"),
    saveWithholding: makeSave("withholding_records", whtRow),
    deleteWithholding: makeDelete("withholding_records"),
    savePaye: makeSave("paye_records", payeRow),
    deletePaye: makeDelete("paye_records"),
    saveIncomeTax: makeSave("income_tax_records", incomeRow),
    deleteIncomeTax: makeDelete("income_tax_records"),
    saveAsset: makeSave("capital_assets", assetRow),
    deleteAsset: makeDelete("capital_assets"),
    saveDocument: makeSave("tax_documents", documentRow),
    deleteDocument: makeDelete("tax_documents"),
    addImport: (record) => makeSave("tax_imports", importRow)(record),
    deleteImport: makeDelete("tax_imports"),
    obligations,
    toggleReminder,
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
