"use server";

import type { GroupedInvoice, InvoiceStatus } from "@/types/invoice";
import { queryInvoiceLineItems } from "@/lib/notion";
import { groupLineItems, decodeInvoiceKey } from "@/lib/invoice-grouping";

export async function fetchGroupedInvoices(
  statusFilter?: InvoiceStatus[],
  monthFilter?: string
): Promise<GroupedInvoice[]> {
  const lineItems = await queryInvoiceLineItems(statusFilter, monthFilter);
  return groupLineItems(lineItems);
}

export async function fetchSingleInvoice(
  encodedKey: string
): Promise<GroupedInvoice | null> {
  const key = decodeInvoiceKey(encodedKey);

  // Parse the key to extract client info and month
  const [clientPart, month] = key.split("--");
  if (!clientPart || !month) return null;

  const lineItems = await queryInvoiceLineItems(undefined, month);
  const grouped = await groupLineItems(lineItems);

  return grouped.find((inv) => inv.key === key) ?? null;
}
