import type { DailyForecast, GeocodedPlace } from '../services/weatherService';
import { MAX_FORECAST_DAYS } from './weather';

// FAKE-DATEN: Beispielwetter als Plan B (kein Netz, API-Ausfall, Demo).
// Mit USE_MOCK_WEATHER = true liefert der weatherService diese Werte statt Open-Meteo.
export const USE_MOCK_WEATHER = false;

// Koordinaten von Wien. Der Name kommt aus der Eingabe, siehe geocodePlace.
export const MOCK_PLACE: Omit<GeocodedPlace, 'name'> = {
  latitude: 48.2085,
  longitude: 16.3721,
  country: 'Österreich',
};

// Beispielwerte für einzelne Tage. Das Datum setzt der weatherService je nach Zeitraum.
export const MOCK_DAYS: Omit<DailyForecast, 'date'>[] = [
  { temperatureMax: 14, temperatureMin: 7, precipitation: 0, weatherCode: 2 },
  { temperatureMax: 12, temperatureMin: 6, precipitation: 2.4, weatherCode: 61 },
  { temperatureMax: 13, temperatureMin: 5, precipitation: 0, weatherCode: 3 },
  { temperatureMax: 15, temperatureMin: 8, precipitation: 0.6, weatherCode: 1 },
];

// Alle Tage von start bis end (yyyy-mm-dd), höchstens so viele, wie die Vorhersage hergibt.
function datesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(`${startDate}T00:00:00Z`);
  const last = new Date(`${endDate}T00:00:00Z`);

  while (current <= last && dates.length < MAX_FORECAST_DAYS) {
    // .slice(0, 10) nimmt nur die ersten zehn Zeichen, also yyyy-mm-dd
    dates.push(current.toISOString().slice(0, 10));
    // setUTCDate(getUTCDate() + 1) erhöht den Tag um einen Tag
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

// Ein Beispieltag pro angefragtem Datum, die Werte wiederholen sich der Reihe nach.
export function createMockForecast(startDate: string, endDate: string): DailyForecast[] {
  return datesBetween(startDate, endDate).map((date, index) => ({
    date,
    ...MOCK_DAYS[index % MOCK_DAYS.length],
  }));
}
