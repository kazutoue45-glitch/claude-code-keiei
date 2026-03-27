import { Suspense } from "react";
import { fetchGroupedInvoices } from "./actions";
import InvoiceList from "./invoice-list";

// Dynamic rendering only (never pre-render at build time)
export const dynamic = "force-dynamic";

async function InvoiceData() {
  try {
    const invoices = await fetchGroupedInvoices();
    return <InvoiceList invoices={invoices} />;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "不明なエラー";
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p className="font-medium">Notion接続エラー</p>
        <p className="mt-1">{message}</p>
        <p className="mt-2 text-xs text-red-600">
          .env.local の NOTION_API_KEY を確認してください。
        </p>
      </div>
    );
  }
}

export default function InvoicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">請求一覧</h1>
      </div>
      <Suspense
        fallback={
          <div className="py-12 text-center text-gray-400">読み込み中...</div>
        }
      >
        <InvoiceData />
      </Suspense>
    </div>
  );
}
