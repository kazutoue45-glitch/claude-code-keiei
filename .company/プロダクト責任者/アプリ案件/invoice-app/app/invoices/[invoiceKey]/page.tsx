import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchSingleInvoice } from "./actions";
import InvoicePreview from "./invoice-preview";

export const dynamic = "force-dynamic";

async function InvoiceData({ invoiceKey }: { invoiceKey: string }) {
  const invoice = await fetchSingleInvoice(invoiceKey);
  if (!invoice) notFound();
  return <InvoicePreview invoice={invoice} />;
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ invoiceKey: string }>;
}) {
  const { invoiceKey } = await params;

  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-gray-400">読み込み中...</div>
      }
    >
      <InvoiceData invoiceKey={invoiceKey} />
    </Suspense>
  );
}
