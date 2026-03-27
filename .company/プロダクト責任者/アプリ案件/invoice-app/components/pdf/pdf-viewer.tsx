"use client";

import { useState } from "react";
import { PDFViewer, BlobProvider } from "@react-pdf/renderer";
import type { GroupedInvoice, IssuerSettings } from "@/types/invoice";
import InvoiceDocument from "./invoice-document";

interface PdfViewerProps {
  invoice: GroupedInvoice;
  settings: IssuerSettings;
}

export default function PdfViewerWrapper({
  invoice,
  settings,
}: PdfViewerProps) {
  const [showPreview, setShowPreview] = useState(true);

  const fileName = `請求書_${invoice.clientName}_${invoice.invoiceDate}.pdf`;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {showPreview ? "プレビューを閉じる" : "プレビューを表示"}
        </button>

        <BlobProvider
          document={
            <InvoiceDocument invoice={invoice} settings={settings} />
          }
        >
          {({ blob, loading, error }) => {
            if (error) {
              return (
                <span className="text-sm text-red-600">
                  PDF生成エラー: {error.message}
                </span>
              );
            }
            if (loading) {
              return (
                <span className="text-sm text-gray-400">PDF生成中...</span>
              );
            }
            return (
              <a
                href={blob ? URL.createObjectURL(blob) : "#"}
                download={fileName}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                ダウンロード
              </a>
            );
          }}
        </BlobProvider>
      </div>

      {showPreview && (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <PDFViewer width="100%" height={800} showToolbar={false}>
            <InvoiceDocument invoice={invoice} settings={settings} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}
