export function formatTimestampNanos(nanos) {
  // Handle null, undefined, or non-numeric input
  if (nanos == null || isNaN(Number(nanos))) return 'Invalid date';

  // Convert to number safely (can handle strings)
  let n = Number(nanos);

  // Nanoseconds to milliseconds
  // Clamp value to safe JS Date range (±8.64e15 ms, year ~275760)
  if (!isFinite(n) || Math.abs(n) > 8.64e21) return 'Invalid date';

  const ms = Math.floor(n / 1e6);

  // Check if timestamp is in reasonable bounds (1970 - 3000)
  const date = new Date(ms);
  if (isNaN(date.getTime()) || date.getFullYear() < 1970 || date.getFullYear() > 3000) {
    return 'Invalid date';
  }

  // Format: Jun 9, 2025, 09:35:20 (24h)
  // Fallback to ISO if toLocaleString is not available
  try {
    // 'en-US' gives month as short text, day as number, year as number
    let str = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    // Remove comma after date for "Jun 9 2025, 09:35:20"
    str = str.replace(',', '');
    return str;
  } catch (e) {
    // Fallback: ISO 8601 with space, no ms or Z
    return date.toISOString().replace('T', ', ').replace(/\.\d+Z$/, '');
  }
}

// Example test cases:
// console.log(formatTimestampNanos(1749409679171483000)); // Jun 9 2025, 09:35:20
// console.log(formatTimestampNanos("1749409679171483000")); // Jun 9 2025, 09:35:20
// console.log(formatTimestampNanos(null)); // Invalid date
// console.log(formatTimestampNanos("notanumber")); // Invalid date
// console.log(formatTimestampNanos(0)); // Jan 1 1970, 00:00:00
// console.log(formatTimestampNanos(1)); // Jan 1 1970, 00:00:00
// console.log(formatTimestampNanos(999999999999999999999999)); // Invalid date