import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProgressDotsProps = {
  total: number;
  /** Zero-indexed current step. */
  current: number;
};

/** Step progress indicator for multi-step flows like onboarding. */
export function ProgressDots({ total, current }: ProgressDotsProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === current ? theme.primary : theme.border,
              width: index === current ? 22 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  dot: {
    height: 8,
    borderRadius: Radius.full,
  },
});
