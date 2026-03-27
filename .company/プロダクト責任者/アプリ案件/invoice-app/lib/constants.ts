export const TAX_RATES = ["10%", "8%", "0%"] as const;

export const TAX_RATE_VALUES: Record<string, number> = {
  "10%": 0.1,
  "8%": 0.08,
  "0%": 0,
};

export const INVOICE_STATUSES = [
  "下書き",
  "差し戻し",
  "承認待ち",
  "請求済",
  "入金済",
] as const;

export const STATUS_COLORS: Record<string, string> = {
  下書き: "bg-gray-100 text-gray-700",
  差し戻し: "bg-red-100 text-red-700",
  承認待ち: "bg-yellow-100 text-yellow-700",
  請求済: "bg-blue-100 text-blue-700",
  入金済: "bg-green-100 text-green-700",
};
