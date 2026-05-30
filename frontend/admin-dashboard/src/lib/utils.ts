/**
 * Formats a Date object or ISO string to the "29 May 2026" style.
 * Returns "-" if the date is invalid or undefined.
 */
export function formatDate(dateVal: string | Date | undefined | null): string {
  if (!dateVal) return "-";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "-";
  
  const day = date.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}
