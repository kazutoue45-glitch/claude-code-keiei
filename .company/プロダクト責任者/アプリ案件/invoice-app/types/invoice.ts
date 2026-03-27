export type TaxRate = "10%" | "8%" | "0%";

export type InvoiceStatus = "下書き" | "差し戻し" | "承認待ち" | "請求済" | "入金済";

export interface LineItem {
  id: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  taxRate: TaxRate;
  subtotal: number;
  totalWithTax: number;
  invoiceNumber: string;
  invoiceDate: string;
  paymentDeadline: string;
  clientCompanyId: string | null;
  clientContactId: string | null;
  memo: string;
  withholdingTaxTarget: boolean;
  status: InvoiceStatus;
}

export interface TaxBreakdown {
  rate: TaxRate;
  taxableAmount: number;
  taxAmount: number;
}

export interface GroupedInvoice {
  key: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentDeadline: string;
  clientName: string;
  clientAddress: string;
  clientType: "company" | "individual";
  lineItems: LineItem[];
  taxBreakdown: TaxBreakdown[];
  subtotalExcludingTax: number;
  totalTax: number;
  totalWithTax: number;
  withholdingTaxAmount: number;
  finalAmount: number;
  status: InvoiceStatus;
}

export interface IssuerSettings {
  companyName: string;
  representativeName: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
  registrationNumber: string;
  logoUrl: string;
  bankName: string;
  branchName: string;
  accountType: "普通" | "当座";
  accountNumber: string;
  accountHolder: string;
  defaultNotes: string;
}

export const DEFAULT_ISSUER_SETTINGS: IssuerSettings = {
  companyName: "",
  representativeName: "",
  postalCode: "",
  address: "",
  phone: "",
  email: "",
  registrationNumber: "",
  logoUrl: "",
  bankName: "",
  branchName: "",
  accountType: "普通",
  accountNumber: "",
  accountHolder: "",
  defaultNotes: "お振込手数料はお客様にてご負担をお願いいたします。",
};
