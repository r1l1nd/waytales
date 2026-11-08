import { AxiosError } from 'axios';

// Im Test gibt es kein echtes Netzwerk, der Client liefert, was wir vorgeben.
// Simulierte Funktion
const mockGet = jest.fn();

jest.mock('../src/services/httpClient', () => ({
  createHttpClient: () => ({ get: mockGet }),
}));

// typeof ermittelt den Typ dieses Moduls, also z.B. seine exportierten Funktionen und deren Typen.
type WeatherService = typeof import('../src/services/weatherService');

// Der Service liest die Adressen beim Laden der Datei, deshalb erst setzen, dann laden.
function loadWeatherService(withUrls: boolean): WeatherService {
  if (withUrls) {
    process.env.EXPO_PUBLIC_GEOCODING_API_URL = 'https://geocoding.test/v1';
    process.env.EXPO_PUBLIC_FORECAST_API_URL = 'https://forecast.test/v1';
  } else {
    delete process.env.EXPO_PUBLIC_GEOCODING_API_URL;
    delete process.env.EXPO_PUBLIC_FORECAST_API_URL;
  }

  let service!: WeatherService;
  jest.isolateModules(() => {
    service = require('../src/services/weatherService');
  });
  return service;
}

beforeEach(() => {
  mockGet.mockReset();
});

describe('geocodePlace', () => {
  it('gibt den besten Treffer mit Name, Koordinaten und Land zurück', async () => {
    mockGet.mockResolvedValue({
      data: {
        results: [
          { id: 1, name: 'Wien', latitude: 48.2, longitude: 16.37, country: 'Österreich', timezone: 'Europe/Vienna' },
        ],
      },
    });
    const { geocodePlace } = loadWeatherService(true);

    const place = await geocodePlace('Wien');

    expect(place).toEqual({ name: 'Wien', latitude: 48.2, longitude: 16.37, country: 'Österreich' });
    expect(mockGet).toHaveBeenCalledWith('/search', {
      params: { name: 'Wien', count: 1, language: 'de', format: 'json' },
    });
  });

  it('gibt null zurück, wenn kein Ort gefunden wurde', async () => {
    const { geocodePlace } = loadWeatherService(true);

    mockGet.mockResolvedValueOnce({ data: {} });
    expect(await geocodePlace('Gibtesnicht')).toBeNull();

    mockGet.mockResolvedValueOnce({ data: { results: [] } });
    expect(await geocodePlace('Gibtesnicht')).toBeNull();
  });

  it('ruft das Netz bei zu kurzer Eingabe nicht auf', async () => {
    const { geocodePlace } = loadWeatherService(true);

    expect(await geocodePlace('a')).toBeNull();
    expect(await geocodePlace('   ')).toBeNull();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('entfernt Leerzeichen am Rand der Eingabe', async () => {
    mockGet.mockResolvedValue({ data: {} });
    const { geocodePlace } = loadWeatherService(true);

    await geocodePlace('  Wien  ');

    expect(mockGet.mock.calls[0][1].params.name).toBe('Wien');
  });

  it('wirft einen Fehler, wenn die Adresse in der .env fehlt', async () => {
    const { geocodePlace } = loadWeatherService(false);

    await expect(geocodePlace('Wien')).rejects.toThrow('EXPO_PUBLIC_GEOCODING_API_URL fehlt in der .env');
  });
});

describe('getForecast', () => {
  const request = { latitude: 48.2, longitude: 16.37, startDate: '2026-11-01', endDate: '2026-11-02' };

  it('setzt die Tageswerte zu einem Objekt pro Tag zusammen', async () => {
    mockGet.mockResolvedValue({
      data: {
        daily: {
          time: ['2026-11-01', '2026-11-02'],
          temperature_2m_max: [12, 9],
          temperature_2m_min: [4, 2],
          precipitation_sum: [0, 3.5],
          weather_code: [1, 61],
        },
      },
    });
    const { getForecast } = loadWeatherService(true);

    const days = await getForecast(request);

    expect(days).toEqual([
      { date: '2026-11-01', temperatureMax: 12, temperatureMin: 4, precipitation: 0, weatherCode: 1 },
      { date: '2026-11-02', temperatureMax: 9, temperatureMin: 2, precipitation: 3.5, weatherCode: 61 },
    ]);
  });

  it('schickt Koordinaten, Zeitraum und Zeitzone an die API', async () => {
    mockGet.mockResolvedValue({
      data: { daily: { time: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_sum: [], weather_code: [] } },
    });
    const { getForecast } = loadWeatherService(true);

    await getForecast(request);

    expect(mockGet).toHaveBeenCalledWith('/forecast', {
      params: {
        latitude: 48.2,
        longitude: 16.37,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
        start_date: '2026-11-01',
        end_date: '2026-11-02',
        timezone: 'auto',
      },
    });
  });

  it('wirft einen Fehler, wenn die Adresse in der .env fehlt', async () => {
    const { getForecast } = loadWeatherService(false);

    await expect(getForecast(request)).rejects.toThrow('EXPO_PUBLIC_FORECAST_API_URL fehlt in der .env');
  });
});

describe('Netzfehler', () => {
  const request = { latitude: 48.2, longitude: 16.37, startDate: '2026-11-01', endDate: '2026-11-02' };

  // Der Fehler muss beim Pack-Screen ankommen, sonst zeigt er fälschlich "Ort nicht gefunden".
  it.each([
    ['geocodePlace', (service: WeatherService) => service.geocodePlace('Wien')],
    ['getForecast', (service: WeatherService) => service.getForecast(request)],
  ])('%s gibt den Fehler weiter, statt ihn zu verschlucken', async (_name, call) => {
    const networkError = new AxiosError('Network Error', 'ERR_NETWORK');
    mockGet.mockRejectedValue(networkError);

    await expect(call(loadWeatherService(true))).rejects.toBe(networkError);
  });
});
