import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import type { CareScoreResult } from '@/lib/score-engine';

type ScoreCardProps = {
  score: CareScoreResult;
};

const TREND_ARROW = { up: '↑', down: '↓', steady: '→' } as const;

/** Summarizes the OREVON Care Score. Always shows how the score was derived — never a bare number. */
export function ScoreCard({ score }: ScoreCardProps) {
  const basisLabel = score.basis === 'declared' ? 'Based on what you told us' : 'Based on your recent activity';

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="label" themeColor="textSecondary">
        Care Score
      </ThemedText>
      <View style={styles.row}>
        <ThemedText type="title" themeColor="primary" style={styles.number}>
          {score.overall}
        </ThemedText>
        <ThemedText type="default">{score.tier}</ThemedText>
        {score.trend ? (
          <ThemedText type="small" themeColor={score.trend.direction === 'up' ? 'success' : 'textSecondary'}>
            {TREND_ARROW[score.trend.direction]} {Math.abs(score.trend.delta)} pts
          </ThemedText>
        ) : null}
      </View>
      <ThemedText type="small" themeColor="textTertiary">
        {basisLabel}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
    borderRadius: Radius.lg,
    padding: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
  number: {
    fontSize: 40,
    lineHeight: 44,
  },
});
