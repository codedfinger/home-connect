/**
 * Format amounts in Nigerian Naira (₦).
 * @param {number} price
 * @param {"rent" | "sale"} type
 * @param {"mo" | "month"} [rentPeriod] — suffix when type is rent
 */
function formatNaira(price, type, rentPeriod = "mo") {
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
  if (type === "rent") {
    return rentPeriod === "month"
      ? `${formatted}/month`
      : `${formatted}/mo`;
  }
  return formatted;
}

export { formatNaira };
