import { MOCK_DAYS, MOCK_PLACE } from '../src/constants/mockWeather';
import { getForecast, geocodePlace } from '../src/services/weatherService';

// Die echte Mock-Datei, nur mit eingeschaltetem Flag. Es braucht weder Netz noch .env.
jest.mock('../src/constants/mockWeather', () => ({
  ...jest.requireActual('../src/constants/mockWeather'),
  USE_MOCK_WEATHER: true,
}));

describe('geocodePlace im Mock-Modus', () => {
  it('gibt den eingegebenen Namen mit den Koordinaten von Wien zurück', async () => {
    const place = await geocodePlace('  Graz ');

    expect(place).toEqual({ name: 'Graz', ...MOCK_PLACE });
  });

  it('gibt bei zu kurzer Eingabe null zurück', async () => {
    expect(await geocodePlace('a')).toBeNull();
  });
});

describe('getForecast im Mock-Modus', () => {
  const coordinates = { latitude: 48.2, longitude: 16.37 };

  it('liefert pro Datum einen Beispieltag in der richtigen Reihenfolge', async () => {
    const days = await getForecast({ ...coordinates, startDate: '2026-11-01', endDate: '2026-11-03' });

    expect(days.map((day) => day.date)).toEqual(['2026-11-01', '2026-11-02', '2026-11-03']);
    expect(days[0]).toEqual({ date: '2026-11-01', ...MOCK_DAYS[0] });
    expect(days[2]).toEqual({ date: '2026-11-03', ...MOCK_DAYS[2] });
  });

  it('wiederholt die Beispieltage der Reihe nach', async () => {
    const days = await getForecast({ ...coordinates, startDate: '2026-11-01', endDate: '2026-11-05' });

    expect(days).toHaveLength(5);
    expect(days[4]).toEqual({ date: '2026-11-05', ...MOCK_DAYS[0] });
  });

  it('liefert höchstens 16 Tage', async () => {
    const days = await getForecast({ ...coordinates, startDate: '2026-11-01', endDate: '2026-12-31' });

    expect(days).toHaveLength(16);
  });

  it('liefert keine Tage, wenn das Ende vor dem Start liegt', async () => {
    const days = await getForecast({ ...coordinates, startDate: '2026-11-05', endDate: '2026-11-01' });

    expect(days).toEqual([]);
  });
});
