import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';

export default function LearnScreen() {
  return (
    <Screen>
      <View style={styles.placeholder}>
        <ThemedText type="h2">Learn</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Educational articles are coming in the next build stage.
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
