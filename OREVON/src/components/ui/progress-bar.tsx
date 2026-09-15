import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  current: number;
  total: number;
};

/** A horizontal fill bar with a "current/total" label, for weekly goal progress. */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const theme = useTheme();
  const ratio = total > 0 ? Math.min(1, current / total) : 0;

  return (
    <View style={styles.row}>
      <View style={[styles.track, { backgroundColor: theme.border }]}>
        <View style={[styles.fill, { backgroundColor: theme.primary, width: `${ratio * 100}%` }]} />
      </View>
      <ThemedText type="label" themeColor="textSecondary">
        {current}/{total}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
