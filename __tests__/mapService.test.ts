import { Platform } from 'react-native';
import { buildMapUrl } from '../src/services/mapService';

// Leerzeichen und Komma im Namen müssen in der URL kodiert werden (%20, %2C).
const stephansplatz = { latitude: 48.2085, longitude: 16.3731, name: 'Stephansplatz, Wien' };

describe('buildMapUrl', () => {
  afterEach(() => {
    // Plattform nach jedem Test wieder auf den Standard (iOS) zurücksetzen.
    jest.restoreAllMocks();
  });

  it('öffnet auf iOS Apple Karten', () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    expect(buildMapUrl(stephansplatz)).toBe(
      'https://maps.apple.com/place?coordinate=48.2085,16.3731&name=Stephansplatz%2C%20Wien'
    );
  });

  it('nutzt auf Android einen geo-Link, den jede Karten-App versteht', () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    expect(buildMapUrl(stephansplatz)).toBe('geo:0,0?q=48.2085,16.3731(Stephansplatz%2C%20Wien)');
  });
});
