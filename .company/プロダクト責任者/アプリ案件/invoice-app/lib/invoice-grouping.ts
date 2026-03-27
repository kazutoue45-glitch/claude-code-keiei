import type {
  LineItem,
  GroupedInvoice,
  InvoiceStatus,
} from "@/types/invoice";
import { getCompanyInfo, getContactInfo, clearCache } from "./notion";
import { calculateTotals } from "./tax-calculation";

function getMonthKey(dateStr: string): string {
  if (!dateStr) return "no-date";
  return dateStr.substring(0, 7); // YYYY-MM
}

function getClientKey(item: LineItem): string {
  if (item.clientCompanyId) return `company:${item.clientCompanyId}`;
  if (item.clientContactId) return `contact:${item.clientContactId}`;
  return "unknown";
}

function getGroupKey(item: LineItem): string {
  return `${getClientKey(item)}--${getMonthKey(item.invoiceDate)}`;
}

// Determine the "worst" status among line items
function aggregateStatus(items: LineItem[]): InvoiceStatus {
  const priority: Record<InvoiceStatus, number> = {
    差し戻し: 0,
    下書き: 1,
    承認待ち: 2,
    請求済: 3,
    入金済: 4,
  };

  let worst: InvoiceStatus = "入金済";
  for (const item of items) {
    if ((priority[item.status] ?? 5) < (priority[worst] ?? 5)) {
      worst = item.status;
    }
  }
  return worst;
}

export async function groupLineItems(
  lineItems: LineItem[]
): Promise<GroupedInvoice[]> {
  clearCache();

  // Group by client + month
  const groups = new Map<string, LineItem[]>();
  for (const item of lineItems) {
    const key = getGroupKey(item);
    const existing = groups.get(key) ?? [];
    existing.push(item);
    groups.set(key, existing);
  }

  // Resolve client info and build GroupedInvoice
  const invoices: GroupedInvoice[] = [];

  for (const [key, items] of groups) {
    // Sort items by invoice date
    items.sort((a, b) => a.invoiceDate.localeCompare(b.invoiceDate));

    // Resolve client info
    const clientKey = getClientKey(items[0]);
    let clientName = "不明";
    let clientAddress = "";
    let clientType: "company" | "individual" = "company";

    if (clientKey.startsWith("company:")) {
      const companyId = clientKey.replace("company:", "");
      const info = await getCompanyInfo(companyId);
      clientName = info.name || "不明";
      clientAddress = info.address;
      clientType = "company";
    } else if (clientKey.startsWith("contact:")) {
      const contactId = clientKey.replace("contact:", "");
      const info = await getContactInfo(contactId);
      clientName = info.name || "不明";
      clientAddress = info.address;
      clientType = "individual";
    }

    const totals = calculateTotals(items);

    // Use the first item's invoice number and dates as representative
    const representative = items[0];
    // For payment deadline, use the latest one among all items
    const latestDeadline = items.reduce(
      (latest, item) =>
        item.paymentDeadline > latest ? item.paymentDeadline : latest,
      items[0].paymentDeadline
    );

    invoices.push({
      key,
      invoiceNumber: representative.invoiceNumber,
      invoiceDate: representative.invoiceDate,
      paymentDeadline: latestDeadline,
      clientName,
      clientAddress,
      clientType,
      lineItems: items,
      ...totals,
      status: aggregateStatus(items),
    });
  }

  // Sort by invoice date descending
  invoices.sort((a, b) => b.invoiceDate.localeCompare(a.invoiceDate));

  return invoices;
}

export function encodeInvoiceKey(key: string): string {
  return encodeURIComponent(key);
}

export function decodeInvoiceKey(encoded: string): string {
  return decodeURIComponent(encoded);
}
