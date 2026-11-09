export function toLocalDateInput(value: number | Date) {
  const date = typeof value === "number" ? new Date(value) : value;
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export function toLocalTimeInput(value: number | Date) {
  const date = typeof value === "number" ? new Date(value) : value;
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(11, 16);
}

export function localDateTimeToMillis(date: string, time: string) {
  if (!date || !time) return null;
  const value = new Date(`${date}T${time}`).getTime();
  return Number.isNaN(value) ? null : value;
}

export function todayLocalInput() {
  return toLocalDateInput(new Date());
}
