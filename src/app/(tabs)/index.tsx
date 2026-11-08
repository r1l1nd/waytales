import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import { AiBubble } from '../../components/AiBubble';
import { AppText } from '../../components/AppText';
import { OfflineBanner } from '../../components/OfflineBanner';
import { StoryModal } from '../../components/StoryModal';
import { StyleDropdown } from '../../components/StyleDropdown';
import { COLORS } from '../../constants/colors';
import { useLocation } from '../../hooks/useLocation';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import type { Story } from '../../models';
import { generateStory } from '../../services/aiService';
import { openAppSettings } from '../../services/locationService';
import { useSettingsStore } from '../../store/useSettingsStore';
import { createStory } from '../../utils/createStory';
import { getErrorMessage } from '../../utils/errorMessages';


export default function HomeScreen() {
  const {
    place,
    isLoading: isLocating,
    error: locationError,
    canOpenSettings,
    fetchLocation,
  } = useLocation();
  const { isOnline } = useNetworkStatus();
  const style = useSettingsStore((state) => state.style);
  const setStyle = useSettingsStore((state) => state.setStyle);

  const [story, setStory] = useState<Story | null>(null);
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
      const draft = await generateStory(currentPlace, style);
      setStory(createStory(draft, currentPlace, style));
      setIsModalOpen(true);
    } catch (e) {
      setStoryError(getErrorMessage(e));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenSettings = async () => {
    try {
      await openAppSettings();
    } catch {
      Alert.alert('Einstellungen nicht verfügbar', 'Bitte öffne die Einstellungen deines Geräts selbst.');
    }
  };

  return (
    <View style={styles.screen}>
      <OfflineBanner />
      <View style={styles.container}>
        <AppText style={styles.location}>
          {place ? `Standort: ${place.locationName}` : 'Standort noch unbekannt'}
        </AppText>

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
          <AiBubble>
            {isBusy ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <SymbolView
                name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
                size={64}
                tintColor={COLORS.primary}
              />
            )}
          </AiBubble>
        </Pressable>

        <AppText style={styles.hint}>
          {isGenerating ? 'Geschichte wird erzählt ...' : 'Tippe auf den Button für eine Geschichte'}
        </AppText>

        {error && <AppText style={styles.error}>{error}</AppText>}

        {canOpenSettings && (
          <Pressable
            style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsButtonPressed]}
            onPress={handleOpenSettings}
            accessibilityRole="button"
          >
            <AppText style={styles.settingsText}>Einstellungen öffnen</AppText>
          </Pressable>
        )}

        <StyleDropdown value={style} onChange={setStyle} />
      </View>

      <StoryModal
        visible={isModalOpen}
        story={story}
        onClose={() => setIsModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    // Spalte: justifyContent = senkrecht, alignItems = waagrecht.
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 24,
  },
  location: { fontSize: 16, color: COLORS.text, textAlign: 'center' },
  // Rund, damit Tippen nur auf der Blase zählt und nicht in den Ecken daneben.
  gpsButton: { borderRadius: 90 },
  gpsButtonDisabled: { opacity: 0.4 },
  gpsButtonPressed: { opacity: 0.7 },
  hint: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  error: { color: COLORS.error, textAlign: 'center' },
  settingsButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  settingsButtonPressed: { opacity: 0.6 },
  settingsText: { fontSize: 16, fontWeight: '500', color: COLORS.primary },
});