import { renderHook } from '@testing-library/react-native';
import { useNetworkState } from 'expo-network';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';

// Im Test gibt es kein echtes Netzwerk
jest.mock('expo-network', () => ({ useNetworkState: jest.fn() }));

const mockedUseNetworkState = jest.mocked(useNetworkState);

describe('useNetworkStatus', () => {
  it('ist online, wenn verbunden und Internet erreichbar', async () => {
    mockedUseNetworkState.mockReturnValue({ isConnected: true, isInternetReachable: true });

    const { result } = await renderHook(() => useNetworkStatus());

    expect(result.current.isOnline).toBe(true);
  });

  it('ist offline, wenn das Internet nicht erreichbar ist', async () => {
    mockedUseNetworkState.mockReturnValue({ isConnected: true, isInternetReachable: false });

    const { result } = await renderHook(() => useNetworkStatus());

    expect(result.current.isOnline).toBe(false);
  });

  it('ist offline, wenn keine Verbindung besteht', async () => {
    mockedUseNetworkState.mockReturnValue({ isConnected: false, isInternetReachable: false });

    const { result } = await renderHook(() => useNetworkStatus());

    expect(result.current.isOnline).toBe(false);
  });

  it('gilt als online, solange der Zustand noch unbekannt ist', async () => {
    mockedUseNetworkState.mockReturnValue({});

    const { result } = await renderHook(() => useNetworkStatus());

    expect(result.current.isOnline).toBe(true);
  });
});
