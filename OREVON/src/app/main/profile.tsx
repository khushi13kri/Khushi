import { router } from 'expo-router';
import { StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { optionLabel } from '@/lib/assessment';
import { useAppState } from '@/state/app-state';

function SectionLabel({ children }: { children: string }) {
  return (
    <ThemedText type="label" themeColor="textSecondary" style={styles.sectionLabel}>
      {children}
    </ThemedText>
  );
}

export default function ProfileScreen() {
  const { assessment, notificationPrefs, toggleNotificationPref } = useAppState();

  const goalLabel = assessment ? optionLabel('goal', assessment.goal as string) : undefined;
  const concernIds = assessment && Array.isArray(assessment.concerns) ? assessment.concerns : [];
  const concernLabels = concernIds
    .map((id) => optionLabel('concerns', id))
    .filter((label): label is string => Boolean(label));

  return (
    <Screen scroll>
      <ThemedText type="h2" style={styles.title}>
        Profile
      </ThemedText>

      <SectionLabel>Preferences</SectionLabel>
      <ThemedView type="backgroundElement" style={styles.card}>
        {assessment ? (
          <>
            <View style={styles.row}>
              <ThemedText type="small" themeColor="textSecondary">
                Goal
              </ThemedText>
              <ThemedText type="default">{goalLabel ?? 'Not set'}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText type="small" themeColor="textSecondary">
                Concerns
              </ThemedText>
              <ThemedText type="default" style={styles.rowValue}>
                {concernLabels.length > 0 ? concernLabels.join(', ') : 'None noted'}
              </ThemedText>
            </View>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            Complete your assessment to see your preferences here.
          </ThemedText>
        )}
      </ThemedView>

      <SectionLabel>Notifications</SectionLabel>
      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.row}>
          <ThemedText type="default">Daily reminders</ThemedText>
          <Switch
            value={notificationPrefs.dailyReminders}
            onValueChange={() => toggleNotificationPref('dailyReminders')}
          />
        </View>
        <View style={styles.row}>
          <ThemedText type="default">Weekly check-ins</ThemedText>
          <Switch
            value={notificationPrefs.weeklyCheckins}
            onValueChange={() => toggleNotificationPref('weeklyCheckins')}
          />
        </View>
      </ThemedView>

      <SectionLabel>Privacy</SectionLabel>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="small" themeColor="textSecondary">
          Your assessment answers and routine activity stay on this device for now. OREVON is an
          educational tool — it does not diagnose conditions and does not replace a dental
          examination.
        </ThemedText>
      </ThemedView>

      <SectionLabel>About OREVON</SectionLabel>
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="wordmark">{Brand.name}</ThemedText>
        <ThemedText type="label" themeColor="textSecondary">
          {Brand.positioning}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.tagline}>
          {Brand.tagline}
        </ThemedText>
        <ThemedText type="small" themeColor="textTertiary">
          Version {Brand.version}
        </ThemedText>
      </ThemedView>

      <View style={styles.retakeSection}>
        <Button
          variant="secondary"
          label="Retake Assessment"
          onPress={() => router.push('/onboarding')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
  },
  sectionLabel: {
    marginBottom: Spacing.two,
  },
  card: {
    gap: Spacing.three,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
  },
  tagline: {
    marginTop: Spacing.half,
  },
  retakeSection: {
    marginTop: Spacing.two,
    marginBottom: Spacing.six,
  },
});
