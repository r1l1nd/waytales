// Wandelt einen ISO-Zeitstempel in ein Datum wie 20.10.2026 um.
export function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
