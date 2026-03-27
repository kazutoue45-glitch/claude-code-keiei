"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSettings } from "@/components/settings-provider";
import type { GroupedInvoice } from "@/types/invoice";
import { formatYen, formatDate } from "@/lib/format";
import { STATUS_COLORS } from "@/lib/constants";

// @react-pdf/renderer must be loaded client-side only
const PdfViewerWrapper = dynamic(
  () => import("@/components/pdf/pdf-viewer"),
  { ssr: false, loading: () => <p className="text-gray-400">PDF準備中...</p> }
);

export default function InvoicePreview({
  invoice,
}: {
  invoice: GroupedInvoice;
}) {
  const { settings, isLoaded } = useSettings();

  const settingsIncomplete =
    !settings.companyName || !settings.registrationNumber || !settings.bankName;

  if (!isLoaded) {
    return (
      <div className="py-12 text-center text-gray-400">読み込み中...</div>
    );
  }

  const statusColor =
    STATUS_COLORS[invoice.status] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/invoices"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; 請求一覧に戻る
        </Link>
      </div>

      {/* Invoice summary */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {invoice.clientName}
              {invoice.clientType === "company" ? " 御中" : " 様"}
            </h1>
            {invoice.clientAddress && (
              <p className="mt-1 text-sm text-gray-500">
                {invoice.clientAddress}
              </p>
            )}
          </div>
          <span
            className={`inline-block rounded px-3 py-1 text-sm font-medium ${statusColor}`}
          >
            {invoice.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <span className="text-gray-500">請求番号</span>
            <p className="font-mono">{invoice.invoiceNumber || "-"}</p>
          </div>
          <div>
            <span className="text-gray-500">請求日</span>
            <p>{formatDate(invoice.invoiceDate)}</p>
          </div>
          <div>
            <span className="text-gray-500">支払期限</span>
            <p>{formatDate(invoice.paymentDeadline)}</p>
          </div>
          <div>
            <span className="text-gray-500">請求金額（税込）</span>
            <p className="text-lg font-bold">
              {formatYen(invoice.totalWithTax)}
            </p>
          </div>
        </div>

        {/* Line items detail */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-3 py-2 font-medium text-gray-600">No.</th>
                <th className="px-3 py-2 font-medium text-gray-600">品目</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">
                  数量
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">
                  単価
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">
                  税率
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">
                  金額
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoice.lineItems.map((item, i) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-2">{item.itemName}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatYen(item.unitPrice)}
                  </td>
                  <td className="px-3 py-2 text-right">{item.taxRate}</td>
                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                    {formatYen(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings warning */}
      {settingsIncomplete && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          発行者情報が未入力です。
          <Link
            href="/settings"
            className="ml-2 font-medium underline hover:text-yellow-900"
          >
            設定画面で入力してください
          </Link>
        </div>
      )}

      {/* PDF Preview + Download */}
      <PdfViewerWrapper invoice={invoice} settings={settings} />
    </div>
  );
}
