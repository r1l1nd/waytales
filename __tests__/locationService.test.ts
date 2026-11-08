import * as Location from 'expo-location';
import {
  getCurrentPlace,
  LocationPermissionError,
  LocationServicesDisabledError,
} from '../src/services/locationService';

// Im Test gibt es kein GPS: Jede Funktion von expo-location liefert, was wir vorgeben.
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  hasServicesEnabledAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied' },
  Accuracy: { Balanced: 3 },
}));

const mocked = jest.mocked(Location);

function permission(status: 'granted' | 'denied', canAskAgain = true) {
  return { status, canAskAgain, granted: status === 'granted', expires: 'never' } as Location.LocationPermissionResponse;
}

// Normalfall: Berechtigung erteilt, GPS an, Adresse gefunden. Jeder Test ändert nur, was er braucht.
function allowLocation() {
  mocked.requestForegroundPermissionsAsync.mockResolvedValue(permission('granted'));
  mocked.hasServicesEnabledAsync.mockResolvedValue(true);
  mocked.getCurrentPositionAsync.mockResolvedValue({
    coords: { latitude: 48.2085, longitude: 16.3731 },
  } as Location.LocationObject);
  mocked.reverseGeocodeAsync.mockResolvedValue([
    { name: 'Stephansplatz', city: 'Wien' } as Location.LocationGeocodedAddress,
  ]);
}

beforeEach(() => {
  jest.resetAllMocks();
  allowLocation();
});

describe('getCurrentPlace', () => {
  it('liefert Koordinaten und Ortsnamen, wenn alles erlaubt ist', async () => {
    expect(await getCurrentPlace()).toEqual({
      latitude: 48.2085,
      longitude: 16.3731,
      locationName: 'Stephansplatz, Wien',
    });
  });

  // canAskAgain entscheidet in der UI: nochmal fragen oder in die Einstellungen schicken.
  it.each([
    ['abgelehnt', true],
    ['dauerhaft abgelehnt', false],
  ])('wirft LocationPermissionError, wenn %s, und fragt kein GPS ab', async (_case, canAskAgain) => {
    mocked.requestForegroundPermissionsAsync.mockResolvedValue(permission('denied', canAskAgain));

    const error = await getCurrentPlace().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(LocationPermissionError);
    expect(error).toMatchObject({ canAskAgain });
    expect(mocked.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it('wirft LocationServicesDisabledError, wenn die Ortungsdienste aus sind', async () => {
    mocked.hasServicesEnabledAsync.mockResolvedValue(false);

    await expect(getCurrentPlace()).rejects.toBeInstanceOf(LocationServicesDisabledError);
  });

  // Ohne Ortsnamen geht es trotzdem weiter, die Geschichte braucht vor allem die Koordinaten.
  it.each([
    ['fehlschlägt', () => mocked.reverseGeocodeAsync.mockRejectedValue(new Error('kein Netz'))],
    ['nichts findet', () => mocked.reverseGeocodeAsync.mockResolvedValue([])],
  ])('nimmt "Unbekannter Ort", wenn die Adresssuche %s', async (_case, breakGeocoding) => {
    breakGeocoding();

    expect((await getCurrentPlace()).locationName).toBe('Unbekannter Ort');
  });
});
