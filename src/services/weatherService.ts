import { createMockForecast, MOCK_PLACE, USE_MOCK_WEATHER } from '../constants/mockWeather';
import { MAX_FORECAST_DAYS } from '../constants/weather';
import type { Weather } from '../models';
import { toIsoDate } from '../utils/isoDate';
import { createHttpClient } from './httpClient';

const geocodingUrl = process.env.EXPO_PUBLIC_GEOCODING_API_URL;
const geocodingClient = geocodingUrl ? createHttpClient(geocodingUrl) : null;

const forecastUrl = process.env.EXPO_PUBLIC_FORECAST_API_URL;
const forecastClient = forecastUrl ? createHttpClient(forecastUrl) : null;

export type GeocodedPlace = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

type GeocodingResponse = {
  results?: GeocodedPlace[];
};

// Sucht einen Ort und liefert den besten Treffer, oder null, wenn nichts gefunden wurde.
export async function geocodePlace(query: string): Promise<GeocodedPlace | null> {
  const name = query.trim();
  if (name.length < 2) return null;

  if (USE_MOCK_WEATHER) return { name, ...MOCK_PLACE };

  if (!geocodingClient) {
    throw new Error('EXPO_PUBLIC_GEOCODING_API_URL fehlt in der .env');
  }

  const { data } = await geocodingClient.get<GeocodingResponse>('/search', {
    params: { name, count: 1, language: 'de', format: 'json' },
  });

  const place = data.results?.[0];
  if (!place) return null;

  return {
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
    country: place.country,
  };
}

type ForecastRequest = {
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
};

export type DailyForecast = {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  weatherCode: number;
};

type ForecastResponse = {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
};

// Holt die Tageswerte für einen Zeitraum (Datum als yyyy-mm-dd). Niederschlag in mm, Temperatur in °C.
export async function getForecast({
  // Destructuring: Eigenschaften direkt aus Objekt herausgeholt -> Variablen
  latitude,
  longitude,
  startDate,
  endDate,
}: ForecastRequest): Promise<DailyForecast[]> {
  if (USE_MOCK_WEATHER) return createMockForecast(startDate, endDate);

  if (!forecastClient) {
    throw new Error('EXPO_PUBLIC_FORECAST_API_URL fehlt in der .env');
  }

  const { data } = await forecastClient.get<ForecastResponse>('/forecast', {
    params: {
      latitude,
      longitude,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
      start_date: startDate,
      end_date: endDate,
      timezone: 'auto',
    },
  });

  const { daily } = data;
  return daily.time.map((date, index) => ({
    date,
    temperatureMax: daily.temperature_2m_max[index],
    temperatureMin: daily.temperature_2m_min[index],
    precipitation: daily.precipitation_sum[index],
    weatherCode: daily.weather_code[index],
  }));
}

// Prüft, ob das Reiseende (yyyy-mm-dd) noch innerhalb der möglichen Vorhersage liegt.
export function isWithinForecastRange(endDate: string, today = new Date()): boolean {
  const lastDay = new Date(today);
  lastDay.setDate(lastDay.getDate() + MAX_FORECAST_DAYS - 1);
  return endDate <= toIsoDate(lastDay);
}

// Liefert den Wettercode, der am häufigsten vorkommt. Bei Gleichstand gewinnt der höhere (schlechtere) Code.
function mostFrequentCode(codes: number[]): number {
  const counts = new Map<number, number>();
  for (const code of codes) {
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }

  let best = codes[0];
  for (const [code, count] of counts) {
    const bestCount = counts.get(best) ?? 0;
    if (count > bestCount || (count === bestCount && code > best)) best = code;
  }
  return best;
}

// Verdichtet die Tageswerte zu einem Wetter für die ganze Reise
export function summarizeForecast(days: DailyForecast[], destination: string): Weather | null {
  if (days.length === 0) return null;

  const dailyMeans = days.map((day) => (day.temperatureMax + day.temperatureMin) / 2);
  const averageTemperature = dailyMeans.reduce((sum, mean) => sum + mean, 0) / days.length;
  const totalPrecipitation = days.reduce((sum, day) => sum + day.precipitation, 0);
  const firstDate = days[0].date;
  const lastDate = days[days.length - 1].date;

  return {
    destination,
    dateRange: firstDate === lastDate ? firstDate : `${firstDate} bis ${lastDate}`,
    temperature: Math.round(averageTemperature),
    precipitation: Math.round(totalPrecipitation * 10) / 10,
    conditionCode: mostFrequentCode(days.map((day) => day.weatherCode)),
  };
}
