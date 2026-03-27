"use client";

import { useState } from "react";
import Link from "next/link";
import type { GroupedInvoice, InvoiceStatus } from "@/types/invoice";
import { formatYen, formatDate } from "@/lib/format";
import { encodeInvoiceKey } from "@/lib/invoice-grouping";
import { STATUS_COLORS, INVOICE_STATUSES } from "@/lib/constants";

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const color = STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}

export default function InvoiceList({
  invoices,
}: {
  invoices: GroupedInvoice[];
}) {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all"
  );

  const filtered =
    statusFilter === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === statusFilter);

  return (
    <div>
      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            statusFilter === "all"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          すべて ({invoices.length})
        </button>
        {INVOICE_STATUSES.map((s) => {
          const count = invoices.filter((inv) => inv.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                statusFilter === s
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Invoice table */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-400">
          該当する請求データがありません
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">
                  請求番号
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  請求先
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  請求日
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  明細数
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  請求金額（税込）
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  ステータス
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((inv) => (
                <tr key={inv.key} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {inv.invoiceNumber || "-"}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {inv.clientName}
                    {inv.clientType === "company" ? " 御中" : " 様"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(inv.invoiceDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {inv.lineItems.length}件
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">
                    {formatYen(inv.totalWithTax)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/invoices/${encodeInvoiceKey(inv.key)}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
