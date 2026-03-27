import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  QueryDataSourceParameters,
} from "@notionhq/client/build/src/api-endpoints";
import {
  getTitle,
  getRichText,
  getNumber,
  getSelect,
  getStatus,
  getDate,
  getCheckbox,
  getRelationIds,
  getFormulaValue,
  getEmail,
} from "@/types/notion-properties";
import type { LineItem, InvoiceStatus, TaxRate } from "@/types/invoice";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const INVOICE_DB_ID = process.env.NOTION_INVOICE_DB_ID!;
const COMPANY_DB_ID = process.env.NOTION_COMPANY_DB_ID!;
const CONTACT_DB_ID = process.env.NOTION_CONTACT_DB_ID!;

function isFullPage(page: unknown): page is PageObjectResponse {
  return (page as PageObjectResponse).object === "page" && "properties" in (page as PageObjectResponse);
}

function parseLineItem(page: PageObjectResponse): LineItem {
  const p = page.properties;

  const formulaSubtotal = getFormulaValue(p["請求金額"]);
  const formulaTotal = getFormulaValue(p["請求金額 (税込)"]);
  const formulaNumber = getFormulaValue(p["請求番号"]);

  const companyIds = getRelationIds(p["請求先 (企業)"]);
  const contactIds = getRelationIds(p["請求先 (個人)"]);

  return {
    id: page.id,
    itemName: getTitle(p["請求項目"]),
    unitPrice: getNumber(p["単価"]),
    quantity: getNumber(p["数量"]),
    taxRate: (getSelect(p["税率"]) || "10%") as TaxRate,
    subtotal: typeof formulaSubtotal === "number" ? formulaSubtotal : 0,
    totalWithTax: typeof formulaTotal === "number" ? formulaTotal : 0,
    invoiceNumber: typeof formulaNumber === "string" ? formulaNumber : "",
    invoiceDate: getDate(p["請求日"]),
    paymentDeadline: getDate(p["入金期限"]),
    clientCompanyId: companyIds[0] ?? null,
    clientContactId: contactIds[0] ?? null,
    memo: getRichText(p["請求メモ"]),
    withholdingTaxTarget: getCheckbox(p["源泉徴収対象"]),
    status: getStatus(p["ステータス"]) as InvoiceStatus,
  };
}

export async function queryInvoiceLineItems(
  statusFilter?: InvoiceStatus[],
  monthFilter?: string
): Promise<LineItem[]> {
  const filters: Array<{
    property: string;
    status?: { equals: string };
    date?: { on_or_after?: string; before?: string };
  }> = [];

  if (statusFilter && statusFilter.length > 0) {
    // OR filter for multiple statuses
    // Notion API requires compound OR at top level
  }

  if (monthFilter) {
    const [year, month] = monthFilter.split("-").map(Number);
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

    filters.push({
      property: "請求日",
      date: { on_or_after: startDate },
    });
    filters.push({
      property: "請求日",
      date: { before: endDate },
    });
  }

  // Build the Notion filter
  type NotionFilter = {
    and?: Array<{ property: string; status?: { equals: string }; date?: { on_or_after?: string; before?: string } } | { or: Array<{ property: string; status: { equals: string } }> }>;
    or?: Array<{ property: string; status: { equals: string } }>;
    property?: string;
    status?: { equals: string };
    date?: { on_or_after?: string; before?: string };
  };

  let filter: NotionFilter | undefined;

  const conditions: Array<NotionFilter | { or: Array<{ property: string; status: { equals: string } }> }> = [];

  if (statusFilter && statusFilter.length > 0) {
    conditions.push({
      or: statusFilter.map((s) => ({
        property: "ステータス",
        status: { equals: s },
      })),
    });
  }

  if (filters.length > 0) {
    conditions.push(...filters);
  }

  if (conditions.length === 1) {
    filter = conditions[0] as NotionFilter;
  } else if (conditions.length > 1) {
    filter = { and: conditions as NotionFilter["and"] };
  }

  const allItems: LineItem[] = [];
  let startCursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: INVOICE_DB_ID,
      filter: filter as QueryDataSourceParameters["filter"],
      sorts: [{ property: "請求日", direction: "descending" }],
      start_cursor: startCursor,
      page_size: 100,
    });

    for (const page of response.results) {
      if (isFullPage(page)) {
        allItems.push(parseLineItem(page));
      }
    }

    startCursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (startCursor);

  return allItems;
}

// Cache for company/contact info within a single request
const companyCache = new Map<string, { name: string; address: string }>();
const contactCache = new Map<string, { name: string; address: string }>();

export async function getCompanyInfo(
  pageId: string
): Promise<{ name: string; address: string }> {
  const cached = companyCache.get(pageId);
  if (cached) return cached;

  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!isFullPage(page)) return { name: "", address: "" };

  const p = page.properties;
  const result = {
    name: getTitle(p["企業名"]),
    address: getRichText(p["所在地"]),
  };
  companyCache.set(pageId, result);
  return result;
}

export async function getContactInfo(
  pageId: string
): Promise<{ name: string; address: string }> {
  const cached = contactCache.get(pageId);
  if (cached) return cached;

  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!isFullPage(page)) return { name: "", address: "" };

  const p = page.properties;
  const name = getTitle(p["氏名｜活動名｜肩書き"]);

  // Try to get address from related company
  let address = "";
  const companyIds = getRelationIds(p["所属企業"]);
  if (companyIds[0]) {
    const company = await getCompanyInfo(companyIds[0]);
    address = company.address;
  }

  const result = { name, address };
  contactCache.set(pageId, result);
  return result;
}

export function clearCache() {
  companyCache.clear();
  contactCache.clear();
}
