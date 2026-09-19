import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Screen } from '@/components/ui/screen';
import { Brand, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  return (
    <Screen footer={<Button label="Get Started" onPress={() => router.push('/onboarding')} />}>
      <View style={styles.hero}>
        <Logo />
        <ThemedText type="lead" themeColor="textSecondary" style={styles.value}>
          {Brand.tagline}
        </ThemedText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  value: {
    textAlign: 'center',
  },
});
