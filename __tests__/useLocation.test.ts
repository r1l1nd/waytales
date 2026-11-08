import { act, renderHook } from '@testing-library/react-native';
import { useLocation } from '../src/hooks/useLocation';
import {
  getCurrentPlace,
  LocationPermissionError,
  LocationServicesDisabledError,
} from '../src/services/locationService';

// Nur getCurrentPlace wird ersetzt. Die echten Fehlerklassen bleiben, weil der Hook mit instanceof prüft.
jest.mock('../src/services/locationService', () => ({
  ...jest.requireActual('../src/services/locationService'),
  getCurrentPlace: jest.fn(),
}));

const mockedGetCurrentPlace = jest.mocked(getCurrentPlace);
const wien = { latitude: 48.2085, longitude: 16.3731, locationName: 'Stephansplatz, Wien' };

// Ein Tipp auf den GPS-Button.
async function tapGps(result: { current: ReturnType<typeof useLocation> }) {
  await act(async () => {
    await result.current.fetchLocation();
  });
}

beforeEach(() => {
  mockedGetCurrentPlace.mockReset();
});

describe('useLocation', () => {
  // So läuft es auf Android: Nach der zweiten Ablehnung meldet das System canAskAgain = false.
  it('führt von "nochmal fragen" über "Einstellungen" bis zum erlaubten Standort', async () => {
    const { result } = await renderHook(() => useLocation());

    // 1. Tipp: abgelehnt, die App darf nochmal fragen.
    mockedGetCurrentPlace.mockRejectedValueOnce(new LocationPermissionError(true));
    await tapGps(result);
    expect(result.current.error).toContain('Tippe erneut');
    expect(result.current.canOpenSettings).toBe(false);

    // 2. Tipp: wieder abgelehnt, jetzt dauerhaft. Nur noch die Einstellungen helfen.
    mockedGetCurrentPlace.mockRejectedValueOnce(new LocationPermissionError(false));
    await tapGps(result);
    expect(result.current.error).toContain('in den Einstellungen');
    expect(result.current.canOpenSettings).toBe(true);

    // 3. Tipp: In den Einstellungen erlaubt. Ort da, Fehler und Einstellungen-Button weg.
    mockedGetCurrentPlace.mockResolvedValueOnce(wien);
    await tapGps(result);
    expect(result.current.place).toEqual(wien);
    expect(result.current.error).toBeNull();
    expect(result.current.canOpenSettings).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('schickt in die Einstellungen, wenn die Ortungsdienste aus sind', async () => {
    mockedGetCurrentPlace.mockRejectedValueOnce(new LocationServicesDisabledError());
    const { result } = await renderHook(() => useLocation());

    await tapGps(result);

    expect(result.current.error).toContain('Ortungsdienste sind ausgeschaltet');
    expect(result.current.canOpenSettings).toBe(true);
  });
});
