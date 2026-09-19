import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { RoutineItem } from '@/components/ui/routine-item';
import { Screen } from '@/components/ui/screen';
import { ScoreCard } from '@/components/ui/score-card';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { lastNDateKeys, todayKey } from '@/lib/date';
import { generatePlan } from '@/lib/plan-engine';
import { routineLabel, weeklyCompletionCount } from '@/lib/routine';
import { computeCareScore } from '@/lib/score-engine';
import { useAppState } from '@/state/app-state';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { assessment, routineLogs, toggleRoutineItem } = useAppState();

  if (!assessment) {
    return (
      <Screen
        scroll
        footer={<Button label="Start Assessment" onPress={() => router.push('/onboarding')} />}>
        <View style={styles.emptyState}>
          <ThemedText type="h2">Let&apos;s get to know you</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Complete a quick assessment so OREVON can build your personal plan.
          </ThemedText>
        </View>
      </Screen>
    );
  }

  const score = computeCareScore(assessment);
  const plan = generatePlan(assessment, score);
  const today = todayKey();
  const todayLog = routineLogs[today] ?? {};
  const weekDays = lastNDateKeys(7);
  const weeklyDone = weeklyCompletionCount(routineLogs, plan.weeklyGoal.targetKeys, weekDays);

  return (
    <Screen scroll>
      <ThemedText type="h2" style={styles.greeting}>
        {greeting()}
      </ThemedText>

      <ScoreCard score={score} />

      <View style={styles.focusBanner}>
        <ThemedText type="label" themeColor="textSecondary">
          Your current focus
        </ThemedText>
        <ThemedText type="h2" themeColor="primary">
          {plan.focusStatement}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="label" themeColor="textSecondary">
          Today
        </ThemedText>
        <View style={styles.actionList}>
          {plan.dailyActionKeys.map((key) => (
            <RoutineItem
              key={key}
              label={routineLabel(key)}
              checked={todayLog[key] === true}
              onToggle={() => toggleRoutineItem(today, key)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="small">{plan.weeklyGoal.label}</ThemedText>
        <ProgressBar current={weeklyDone} total={plan.weeklyGoal.targetDays} />
        <ThemedText type="small" themeColor="textTertiary">
          Your trend will appear here as you build history.
        </ThemedText>
      </View>

      <View style={styles.quickAccessRow}>
        <Button variant="secondary" label="OREVON AI" onPress={() => router.push('/main/ai')} />
        <Button variant="secondary" label="Learn" onPress={() => router.push('/main/learn')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  greeting: {
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
  },
  focusBanner: {
    gap: Spacing.half,
    marginTop: Spacing.five,
    marginBottom: Spacing.three,
  },
  section: {
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  actionList: {
    gap: Spacing.two,
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: BottomTabInset + Spacing.three,
  },
});
