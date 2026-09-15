import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type OptionCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** A single selectable choice, used for onboarding questions. */
export function OptionCard({ label, selected, onPress }: OptionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: selected ? theme.primaryMuted : theme.backgroundElement,
          borderColor: selected ? theme.primary : 'transparent',
        },
        pressed && styles.pressed,
      ]}>
      <ThemedText type="default" themeColor={selected ? 'primary' : 'text'} style={styles.label}>
        {label}
      </ThemedText>
      <View
        style={[
          styles.indicator,
          {
            borderColor: selected ? theme.primary : theme.border,
            backgroundColor: selected ? theme.primary : 'transparent',
          },
        ]}>
        {selected ? (
          <ThemedText themeColor="onPrimary" style={styles.check}>
            ✓
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  label: {
    flex: 1,
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 14,
  },
  pressed: {
    opacity: 0.85,
  },
});
