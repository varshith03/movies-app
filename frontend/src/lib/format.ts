export const formatMoney = (value?: number) =>
  value ? `$${value.toLocaleString()}` : "—";
