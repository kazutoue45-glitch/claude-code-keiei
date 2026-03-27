import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    fontSize: 9,
    padding: 40,
    color: "#1a1a1a",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 4,
  },
  invoiceMeta: {
    alignItems: "flex-end",
    gap: 3,
  },
  metaLabel: {
    fontSize: 8,
    color: "#666",
  },
  metaValue: {
    fontSize: 10,
  },
  // Client and Issuer info
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  clientBox: {
    width: "48%",
  },
  issuerBox: {
    width: "48%",
    alignItems: "flex-end",
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    borderBottom: "2px solid #1a1a1a",
    paddingBottom: 4,
  },
  clientAddress: {
    fontSize: 9,
    color: "#444",
  },
  issuerName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
  },
  issuerDetail: {
    fontSize: 8,
    color: "#444",
    textAlign: "right",
  },
  registrationNumber: {
    fontSize: 8,
    color: "#444",
    marginTop: 2,
    textAlign: "right",
  },
  // Total amount highlight
  totalBox: {
    backgroundColor: "#f0f4ff",
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  // Table
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderTop: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  colNo: { width: "6%" },
  colItem: { width: "34%" },
  colQty: { width: "10%", textAlign: "right" },
  colUnit: { width: "14%", textAlign: "right" },
  colTax: { width: "10%", textAlign: "right" },
  colAmount: { width: "16%", textAlign: "right" },
  headerText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#555",
  },
  cellText: {
    fontSize: 9,
  },
  // Tax breakdown
  summarySection: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    paddingVertical: 3,
    width: 300,
  },
  summaryLabel: {
    fontSize: 9,
    color: "#444",
    width: 180,
    textAlign: "right",
  },
  summaryValue: {
    fontSize: 9,
    width: 100,
    textAlign: "right",
  },
  summaryDivider: {
    borderTop: "1px solid #ddd",
    marginVertical: 4,
    width: 300,
    alignSelf: "flex-end",
  },
  summaryTotal: {
    fontWeight: "bold",
    fontSize: 11,
  },
  // Footer
  footer: {
    marginTop: "auto",
    paddingTop: 16,
    borderTop: "1px solid #ddd",
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 8,
    color: "#444",
    lineHeight: 1.6,
  },
  notesSection: {
    marginTop: 12,
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
  },
  notesText: {
    fontSize: 8,
    color: "#444",
    lineHeight: 1.6,
  },
});
