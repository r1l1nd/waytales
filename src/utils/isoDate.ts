// Datum als yyyy-mm-dd in lokaler Zeit, so erwartet es Open-Meteo.
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Gegenstück: aus yyyy-mm-dd ein Date um Mitternacht lokaler Zeit.
export function fromIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`);
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

// Zählt Tage dazu, z. B. Reiseende = Anreise + Dauer - 1.
export function addDays(isoDate: string, days: number): string {
  const date = fromIsoDate(isoDate);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}