import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { OfflineBanner } from '../../components/OfflineBanner';
import { StoryModal } from '../../components/StoryModal';
import { StyleDropdown } from '../../components/StyleDropdown';
import { COLORS } from '../../constants/colors';
import { useLocation } from '../../hooks/useLocation';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import type { StoryDraft } from '../../models';
import { generateStory } from '../../services/aiService';
import { useSettingsStore } from '../../store/useSettingsStore';
import { getErrorMessage } from '../../utils/errorMessages';

export default function HomeScreen() {
  const { place, isLoading: isLocating, error: locationError, fetchLocation } = useLocation();
  const { isOnline } = useNetworkStatus();
  const style = useSettingsStore((state) => state.style);
  const setStyle = useSettingsStore((state) => state.setStyle);

  const [story, setStory] = useState<StoryDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isBusy = isLocating || isGenerating;
  const error = locationError ?? storyError;

  // Ablauf: Standort holen, Geschichte erzeugen, Modal öffnen.
  const handleGenerate = async () => {
    setStoryError(null);
    const currentPlace = await fetchLocation();
    if (!currentPlace) return; // Der Fehler steht schon im Hook.

    setIsGenerating(true);
    try {
      setStory(await generateStory(currentPlace, style));
      setIsModalOpen(true);
    } catch (e) {
      setStoryError(getErrorMessage(e));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.screen}>
      <OfflineBanner />
      <View style={styles.container}>
        <Text style={styles.location}>
          {place ? `Standort: ${place.locationName}` : 'Standort noch unbekannt'}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.gpsButton,
            (!isOnline || isBusy) && styles.gpsButtonDisabled,
            pressed && styles.gpsButtonPressed,
          ]}
          onPress={handleGenerate}
          disabled={!isOnline || isBusy}
          accessibilityRole="button"
          accessibilityLabel="Geschichte zum aktuellen Standort erzählen"
        >
          {isBusy ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <SymbolView
              name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
              size={64}
              tintColor={COLORS.primary}
            />
          )}
        </Pressable>

        <Text style={styles.hint}>
          {isGenerating ? 'Geschichte wird erzählt ...' : 'Tippe auf den Button für eine Geschichte'}
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <StyleDropdown value={style} onChange={setStyle} />
      </View>

      <StoryModal
        visible={isModalOpen}
        story={story}
        locationName={place?.locationName ?? ''}
        onClose={() => setIsModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
    gap: 24,
  },
  location: { fontSize: 16, color: COLORS.text, textAlign: 'center' },
  gpsButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsButtonDisabled: { opacity: 0.4 },
  gpsButtonPressed: { opacity: 0.7 },
  hint: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  error: { color: COLORS.error, textAlign: 'center' },
});