import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { ThemeColor } from '@/constants/theme';

type LogoProps = {
  textColor?: ThemeColor;
  taglineColor?: ThemeColor;
  showTagline?: boolean;
};

/** OREVON wordmark, used on the splash and welcome screens. */
export function Logo({ textColor = 'text', taglineColor = 'textSecondary', showTagline = true }: LogoProps) {
  return (
    <View style={styles.wrap}>
      <ThemedText type="wordmark" themeColor={textColor}>
        OREVON
      </ThemedText>
      {showTagline ? (
        <ThemedText type="label" themeColor={taglineColor}>
          Intelligent Oral Care
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 6,
  },
});
