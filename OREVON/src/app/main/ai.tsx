import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';

export default function AiScreen() {
  return (
    <Screen>
      <View style={styles.placeholder}>
        <ThemedText type="h2">OREVON AI</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Your conversational guide to oral-health education is coming soon.
        </ThemedText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
