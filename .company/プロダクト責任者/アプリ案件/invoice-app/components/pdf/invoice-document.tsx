"use client";

import {
  Document,
  Page,
  View,
  Text,
  Font,
} from "@react-pdf/renderer";
import type { GroupedInvoice, IssuerSettings } from "@/types/invoice";
import { styles } from "./pdf-styles";

// Register Japanese font
Font.register({
  family: "NotoSansJP",
  src: "/fonts/NotoSansJP-Regular.ttf",
});

function formatYenPdf(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

function formatDatePdf(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

interface InvoiceDocumentProps {
  invoice: GroupedInvoice;
  settings: IssuerSettings;
}

export default function InvoiceDocument({
  invoice,
  settings,
}: InvoiceDocumentProps) {
  const honorific =
    invoice.clientType === "company" ? " 御中" : " 様";

  return (
    <Document title={`請求書_${invoice.clientName}_${invoice.invoiceDate}`}>
      <Page size="A4" style={styles.page}>
        {/* Header: Title + Invoice Meta */}
        <View style={styles.header}>
          <Text style={styles.title}>請求書</Text>
          <View style={styles.invoiceMeta}>
            <Text style={styles.metaLabel}>請求番号</Text>
            <Text style={styles.metaValue}>
              {invoice.invoiceNumber || "-"}
            </Text>
            <Text style={[styles.metaLabel, { marginTop: 4 }]}>請求日</Text>
            <Text style={styles.metaValue}>
              {formatDatePdf(invoice.invoiceDate)}
            </Text>
          </View>
        </View>

        {/* Client + Issuer Info */}
        <View style={styles.infoRow}>
          <View style={styles.clientBox}>
            <Text style={styles.clientName}>
              {invoice.clientName}
              {honorific}
            </Text>
            {invoice.clientAddress && (
              <Text style={styles.clientAddress}>
                {invoice.clientAddress}
              </Text>
            )}
          </View>
          <View style={styles.issuerBox}>
            <Text style={styles.issuerName}>{settings.companyName}</Text>
            {settings.representativeName && (
              <Text style={styles.issuerDetail}>
                {settings.representativeName}
              </Text>
            )}
            {settings.postalCode && (
              <Text style={styles.issuerDetail}>{settings.postalCode}</Text>
            )}
            {settings.address && (
              <Text style={styles.issuerDetail}>{settings.address}</Text>
            )}
            {settings.phone && (
              <Text style={styles.issuerDetail}>TEL: {settings.phone}</Text>
            )}
            {settings.email && (
              <Text style={styles.issuerDetail}>{settings.email}</Text>
            )}
            {settings.registrationNumber && (
              <Text style={styles.registrationNumber}>
                登録番号: {settings.registrationNumber}
              </Text>
            )}
          </View>
        </View>

        {/* Total Amount Highlight */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>ご請求金額（税込）</Text>
          <Text style={styles.totalAmount}>
            {formatYenPdf(invoice.finalAmount)}
          </Text>
        </View>

        {/* Payment Deadline */}
        {invoice.paymentDeadline && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 9, color: "#444" }}>
              お支払期限: {formatDatePdf(invoice.paymentDeadline)}
            </Text>
          </View>
        )}

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colNo]}>No.</Text>
            <Text style={[styles.headerText, styles.colItem]}>品目</Text>
            <Text style={[styles.headerText, styles.colQty]}>数量</Text>
            <Text style={[styles.headerText, styles.colUnit]}>単価</Text>
            <Text style={[styles.headerText, styles.colTax]}>税率</Text>
            <Text style={[styles.headerText, styles.colAmount]}>金額</Text>
          </View>
          {invoice.lineItems.map((item, i) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.cellText, styles.colNo]}>{i + 1}</Text>
              <Text style={[styles.cellText, styles.colItem]}>
                {item.itemName}
              </Text>
              <Text style={[styles.cellText, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.cellText, styles.colUnit]}>
                {formatYenPdf(item.unitPrice)}
              </Text>
              <Text style={[styles.cellText, styles.colTax]}>
                {item.taxRate}
              </Text>
              <Text style={[styles.cellText, styles.colAmount]}>
                {formatYenPdf(item.subtotal)}
              </Text>
            </View>
          ))}
        </View>

        {/* Tax Breakdown + Totals */}
        <View style={styles.summarySection}>
          {invoice.taxBreakdown.map((tb) => (
            <View key={tb.rate} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {tb.rate === "0%"
                  ? "非課税対象"
                  : `${tb.rate}対象: ${formatYenPdf(tb.taxableAmount)}`}
              </Text>
              <Text style={styles.summaryValue}>
                {tb.rate === "0%"
                  ? formatYenPdf(tb.taxableAmount)
                  : `消費税: ${formatYenPdf(tb.taxAmount)}`}
              </Text>
            </View>
          ))}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>小計（税抜）</Text>
            <Text style={styles.summaryValue}>
              {formatYenPdf(invoice.subtotalExcludingTax)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>消費税合計</Text>
            <Text style={styles.summaryValue}>
              {formatYenPdf(invoice.totalTax)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.summaryTotal]}>
              合計（税込）
            </Text>
            <Text style={[styles.summaryValue, styles.summaryTotal]}>
              {formatYenPdf(invoice.totalWithTax)}
            </Text>
          </View>

          {invoice.withholdingTaxAmount > 0 && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>源泉徴収税額</Text>
                <Text style={styles.summaryValue}>
                  -{formatYenPdf(invoice.withholdingTaxAmount)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.summaryTotal]}>
                  差引請求額
                </Text>
                <Text style={[styles.summaryValue, styles.summaryTotal]}>
                  {formatYenPdf(invoice.finalAmount)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Footer: Bank Account + Notes */}
        <View style={styles.footer}>
          {settings.bankName && (
            <>
              <Text style={styles.footerTitle}>お振込先</Text>
              <Text style={styles.footerText}>
                {settings.bankName} {settings.branchName}{" "}
                {settings.accountType} {settings.accountNumber}
              </Text>
              <Text style={styles.footerText}>
                口座名義: {settings.accountHolder}
              </Text>
            </>
          )}

          {(settings.defaultNotes || invoice.lineItems.some((i) => i.memo)) && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>備考</Text>
              {settings.defaultNotes && (
                <Text style={styles.notesText}>{settings.defaultNotes}</Text>
              )}
              {invoice.lineItems
                .filter((i) => i.memo)
                .map((i) => (
                  <Text key={i.id} style={styles.notesText}>
                    {i.itemName}: {i.memo}
                  </Text>
                ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
