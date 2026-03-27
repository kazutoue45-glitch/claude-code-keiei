const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

export function formatYen(amount: number): string {
  return yenFormatter.format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatMonth(dateStr: string): string {
  if (!dateStr) return "-";
  const [year, month] = dateStr.split("-");
  return `${year}年${month}月`;
}
