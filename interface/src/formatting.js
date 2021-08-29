const dateFormat = new Intl.DateTimeFormat([]);

export function formatTimestampAsDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return dateFormat.format(date);
}
