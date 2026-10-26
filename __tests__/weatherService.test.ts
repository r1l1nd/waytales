import {
  isWithinForecastRange,
  summarizeForecast,
  type DailyForecast,
} from '../src/services/weatherService';

function createDay(overrides: Partial<DailyForecast> = {}): DailyForecast {
  return {
    date: '2026-11-01',
    temperatureMax: 20,
    temperatureMin: 10,
    precipitation: 0,
    weatherCode: 1,
    // zuerst Standardwerte gesetzt, dann Werte aus overrides darübergelegt
    ...overrides,
  };
}

describe('summarizeForecast', () => {
  it('gibt null zurück, wenn es keine Tage gibt', () => {
    expect(summarizeForecast([], 'Wien')).toBeNull();
  });

  it('nimmt den Durchschnitt der Tagesmittel als Temperatur', () => {
    const days = [
      createDay({ temperatureMax: 20, temperatureMin: 10 }),
      createDay({ temperatureMax: 24, temperatureMin: 14 }),
    ];

    expect(summarizeForecast(days, 'Wien')?.temperature).toBe(17);
  });

  it('addiert den Niederschlag und rundet auf eine Nachkommastelle', () => {
    const days = [createDay({ precipitation: 0.1 }), createDay({ precipitation: 0.2 })];

    expect(summarizeForecast(days, 'Wien')?.precipitation).toBe(0.3);
  });

  it('nimmt den am häufigsten vorkommenden Wettercode', () => {
    const days = [3, 3, 61].map((weatherCode) => createDay({ weatherCode }));

    expect(summarizeForecast(days, 'Wien')?.conditionCode).toBe(3);
  });

  it('nimmt bei Gleichstand den höheren Wettercode', () => {
    const days = [1, 61].map((weatherCode) => createDay({ weatherCode }));

    expect(summarizeForecast(days, 'Wien')?.conditionCode).toBe(61);
  });

  it('zeigt bei einem Tag nur das Datum, sonst den Zeitraum', () => {
    const oneDay = [createDay({ date: '2026-11-01' })];
    const twoDays = [createDay({ date: '2026-11-01' }), createDay({ date: '2026-11-02' })];

    expect(summarizeForecast(oneDay, 'Wien')?.dateRange).toBe('2026-11-01');
    expect(summarizeForecast(twoDays, 'Wien')?.dateRange).toBe('2026-11-01 bis 2026-11-02');
  });

  it('übernimmt das Reiseziel', () => {
    expect(summarizeForecast([createDay()], 'Wien')?.destination).toBe('Wien');
  });
});

describe('isWithinForecastRange', () => {
  // Monate zählen ab 0: 9 = Oktober. Heute ist der 26.10.2026, letzter Tag ist der 10.11.2026.
  const today = new Date(2026, 9, 26);

  it('akzeptiert den letzten möglichen Tag', () => {
    expect(isWithinForecastRange('2026-11-10', today)).toBe(true);
  });

  it('lehnt den Tag danach ab', () => {
    expect(isWithinForecastRange('2026-11-11', today)).toBe(false);
  });

  it('akzeptiert heute', () => {
    expect(isWithinForecastRange('2026-10-26', today)).toBe(true);
  });
});
