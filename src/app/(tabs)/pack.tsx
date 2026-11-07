import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { DateField } from '../../components/DateField';
import { OfflineBanner } from '../../components/OfflineBanner';
import { PackingChecklist } from '../../components/PackingChecklist';
import { WeatherCard } from '../../components/WeatherCard';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';
import { MAX_FORECAST_DAYS } from '../../constants/weather';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { generatePackingList } from '../../services/aiService';
import { geocodePlace, getForecast, isWithinForecastRange, summarizeForecast } from '../../services/weatherService';
import { usePackingStore } from '../../store/usePackingStore';
import { getErrorMessage } from '../../utils/errorMessages';
import { addDays, fromIsoDate, todayIso } from '../../utils/isoDate';

const MIN_DAYS = 1;
const MAX_DAYS = 14;

export default function PackScreen() {
  const { isOnline } = useNetworkStatus();
  const {
    destination,
    startDate,
    days,
    weather,
    categories,
    isBasicList,
    setDestination,
    setStartDate,
    setDays,
    setPackingResult,
    showBasicList,
    toggleItem,
  } = usePackingStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Offline und noch keine Liste: Basisliste statt leerem Screen.
  // categories.length steht drin, weil die gespeicherte Liste erst kurz nach dem Start geladen wird.
  useEffect(() => {
    if (!isOnline && categories.length === 0) {
      showBasicList();
    }
  }, [isOnline, categories.length, showBasicList]);

  const isDisabled = !isOnline || isLoading;
  const totalCount = categories.reduce((sum, category) => sum + category.items.length, 0);
  const checkedCount = categories.reduce(
    (sum, category) => sum + category.items.filter((item) => item.isChecked).length,
    0
  );

  // Ablauf: Eingaben prüfen, Ort suchen, Wetter holen, Packliste erzeugen.
  const handleGenerate = async () => {
    setError(null);
    const name = destination.trim();
    const endDate = addDays(startDate, days - 1);

    if (name.length < 2) {
      setError('Bitte gib ein Reiseziel ein.');
      return;
    }
    if (startDate < todayIso()) {
      setError('Bitte wähle ein Anreisedatum ab heute.');
      return;
    }
    if (!isWithinForecastRange(endDate)) {
      setError(
        `Die Wettervorhersage reicht nur ${MAX_FORECAST_DAYS} Tage in die Zukunft. Wähle ein früheres Datum oder eine kürzere Reise.`
      );
      return;
    }

    setIsLoading(true);
    try {
      const place = await geocodePlace(name);
      if (!place) {
        setError(`„${name}“ wurde nicht gefunden. Prüfe die Schreibweise.`);
        return;
      }

      const forecast = await getForecast({
        latitude: place.latitude,
        longitude: place.longitude,
        startDate,
        endDate,
      });
      const label = place.country ? `${place.name}, ${place.country}` : place.name;
      const summary = summarizeForecast(forecast, label);
      if (!summary) {
        setError('Für diesen Zeitraum gibt es keine Wetterdaten.');
        return;
      }

      // Erst speichern, wenn beides da ist. Bei einem Fehler bleibt die alte Liste erhalten.
      const categories = await generatePackingList(summary, days);
      setPackingResult(summary, categories);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText style={styles.label}>Reiseziel</AppText>
        <TextInput
          style={styles.input}
          value={destination}
          onChangeText={setDestination}
          placeholder="z. B. Stockholm"
          placeholderTextColor={COLORS.textMuted}
          autoCorrect={false}
          returnKeyType="done"
          accessibilityLabel="Reiseziel"
        />

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <AppText style={styles.label}>Anreise</AppText>
            <DateField value={startDate} minimumDate={fromIsoDate(todayIso())} onChange={setStartDate} />
          </View>

          <View style={styles.rowItem}>
            <AppText style={styles.label}>Dauer</AppText>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setDays(Math.max(MIN_DAYS, days - 1))}
                disabled={days <= MIN_DAYS}
                accessibilityRole="button"
                accessibilityLabel="Einen Tag weniger"
                hitSlop={8}
                style={styles.stepperButton}
              >
                <AppText style={[styles.stepperSymbol, days <= MIN_DAYS && styles.stepperDisabled]}>−</AppText>
              </Pressable>
              <AppText style={styles.stepperValue}>
                {days} {days === 1 ? 'Tag' : 'Tage'}
              </AppText>
              <Pressable
                onPress={() => setDays(Math.min(MAX_DAYS, days + 1))}
                disabled={days >= MAX_DAYS}
                accessibilityRole="button"
                accessibilityLabel="Einen Tag mehr"
                hitSlop={8}
                style={styles.stepperButton}
              >
                <AppText style={[styles.stepperSymbol, days >= MAX_DAYS && styles.stepperDisabled]}>+</AppText>
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleGenerate}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled, busy: isLoading }}
          style={({ pressed }) => [
            styles.generateButton,
            isDisabled && styles.generateDisabled,
            pressed && styles.pressed,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <AppText style={styles.generateText}>Packliste erstellen</AppText>
          )}
        </Pressable>

        {!isOnline && !isBasicList && (
          <AppText style={styles.hint}>
            Ohne Internet kann keine neue Packliste erstellt werden. Deine letzte Liste bleibt erhalten.
          </AppText>
        )}
        {error && <AppText style={styles.error}>{error}</AppText>}

        {weather && <WeatherCard weather={weather} />}

        {categories.length > 0 && (
          <>
            {isBasicList && (
              <View style={styles.basicNotice}>
                <AppText style={styles.basicNoticeTitle}>Basisliste</AppText>
                <AppText style={styles.basicNoticeText}>
                  Das sind nur Dinge, die man auf jeder Reise braucht. Für eine Liste passend zu Reiseziel,
                  Wetter und Dauer brauchst du Internet.
                </AppText>
              </View>
            )}
            <AppText style={styles.progress}>
              {checkedCount} von {totalCount} eingepackt
            </AppText>
            <PackingChecklist categories={categories} onToggle={toggleItem} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 12 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 16,
    // TextInput ist kein AppText, darum die Schrift hier direkt setzen.
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  row: { flexDirection: 'row', gap: 16 },
  rowItem: { flex: 1, gap: 8 },
  stepper: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  stepperButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  stepperSymbol: { fontSize: 22, color: COLORS.primary },
  stepperDisabled: { color: COLORS.border },
  stepperValue: { fontSize: 16, color: COLORS.text },
  generateButton: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  generateDisabled: { opacity: 0.4 },
  generateText: { fontSize: 16, fontWeight: '600', color: COLORS.background },
  pressed: { opacity: 0.7 },
  hint: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  error: { fontSize: 14, color: COLORS.error, textAlign: 'center' },
  progress: { marginTop: 8, fontSize: 14, color: COLORS.textMuted },
  basicNotice: {
    marginTop: 8,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  basicNoticeTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  basicNoticeText: { fontSize: 14, lineHeight: 20, color: COLORS.textMuted },
});