"use server";

import type { GroupedInvoice } from "@/types/invoice";
import { queryInvoiceLineItems } from "@/lib/notion";
import { groupLineItems, decodeInvoiceKey } from "@/lib/invoice-grouping";

export async function fetchSingleInvoice(
  encodedKey: string
): Promise<GroupedInvoice | null> {
  const key = decodeInvoiceKey(encodedKey);

  // Parse the key to extract month for filtering
  const parts = key.split("--");
  const month = parts[parts.length - 1];

  const lineItems = await queryInvoiceLineItems(undefined, month);
  const grouped = await groupLineItems(lineItems);

  return grouped.find((inv) => inv.key === key) ?? null;
}
