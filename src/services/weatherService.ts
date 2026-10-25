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
  if (!geocodingClient) {
    throw new Error('EXPO_PUBLIC_GEOCODING_API_URL fehlt in der .env');
  }

  const name = query.trim();
  if (name.length < 2) return null;

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
  latitude,
  longitude,
  startDate,
  endDate,
}: ForecastRequest): Promise<DailyForecast[]> {
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
