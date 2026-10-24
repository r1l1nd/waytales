import { useNetworkState } from 'expo-network';

// Sagt, ob das Gerät online ist. Beim Start sind die Werte noch undefined,
// das zählt als online, damit nichts grundlos gesperrt wird.
export function useNetworkStatus() {
  const { isConnected, isInternetReachable } = useNetworkState();
  const isOnline = isConnected !== false && isInternetReachable !== false;

  return { isOnline };
}