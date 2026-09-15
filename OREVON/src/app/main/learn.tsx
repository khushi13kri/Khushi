import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Collapsible } from '@/components/ui/collapsible';
import { Spacing } from '@/constants/theme';
import { LEARN_ARTICLES } from '@/lib/learn-content';

export default function LearnScreen() {
  return (
    <Screen scroll>
      <View style={styles.header}>
        <ThemedText type="h2">Learn</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          General oral-care education — not a diagnosis. For anything concerning, a dentist is the
          right next step.
        </ThemedText>
      </View>

      <View style={styles.list}>
        {LEARN_ARTICLES.map((article) => (
          <Collapsible key={article.id} title={article.title}>
            <ThemedText type="small" themeColor="textSecondary">
              {article.summary}
            </ThemedText>
            <ThemedText type="default">{article.body}</ThemedText>
          </Collapsible>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
  },
  list: {
    gap: Spacing.four,
    paddingBottom: Spacing.five,
  },
});
