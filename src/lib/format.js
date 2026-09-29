export function money(cr) {
  if (!isFinite(cr)) return "—";
  if (Math.abs(cr) < 1) {
    return "₹" + (cr * 100).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " લાખ";
  }
  return "₹" + cr.toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " કરોડ";
}

export const rupees = (r) => "₹" + Math.round(r).toLocaleString("en-IN");

export const pct = (x) => (Math.round(x * 100) / 100).toString() + "%";
