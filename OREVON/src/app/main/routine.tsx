import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RoutineItem } from '@/components/ui/routine-item';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { todayKey } from '@/lib/date';
import { ROUTINE_ITEMS } from '@/lib/routine';
import { useAppState } from '@/state/app-state';

const TODAY_LABEL_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };

export default function RoutineScreen() {
  const { routineLogs, toggleRoutineItem } = useAppState();
  const today = todayKey();
  const todayLog = routineLogs[today] ?? {};
  const completedCount = ROUTINE_ITEMS.filter((item) => todayLog[item.key] === true).length;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <ThemedText type="h2">Today&apos;s Routine</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {new Date().toLocaleDateString(undefined, TODAY_LABEL_FORMAT)}
        </ThemedText>
      </View>

      <View style={styles.list}>
        {ROUTINE_ITEMS.map((item) => (
          <RoutineItem
            key={item.key}
            label={item.label}
            checked={todayLog[item.key] === true}
            onToggle={() => toggleRoutineItem(today, item.key)}
          />
        ))}
      </View>

      <ThemedText type="small" themeColor="textTertiary" style={styles.summary}>
        {completedCount} of {ROUTINE_ITEMS.length} completed today
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.half,
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
  },
  list: {
    gap: Spacing.two,
  },
  summary: {
    marginTop: Spacing.three,
    textAlign: 'center',
  },
});
