import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

const HOLD_MS = 550;
const FADE_MS = 500;

const fadeOut = new Keyframe({
  0: {
    opacity: 1,
  },
  100: {
    opacity: 0,
    easing: Easing.out(Easing.cubic),
  },
});

/**
 * Branded boot screen: shows the OREVON wordmark on the same color as the
 * native splash screen, holds briefly, then fades away to reveal the
 * Welcome screen underneath. Web doesn't need this (see .web.tsx).
 */
export function OrevonSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  if (!visible) return null;

  const brand = (
    <View style={styles.brandGroup}>
      <ThemedText type="wordmark" themeColor="onPrimary">
        OREVON
      </ThemedText>
      <ThemedText type="label" themeColor="onPrimary">
        Intelligent Oral Care
      </ThemedText>
    </View>
  );

  if (!ready) {
    return (
      <View
        style={styles.overlay}
        onLayout={() => {
          SplashScreen.hideAsync().finally(() => setReady(true));
        }}>
        {brand}
      </View>
    );
  }

  return (
    <Animated.View
      entering={fadeOut
        .duration(FADE_MS)
        .delay(HOLD_MS)
        .withCallback((finished) => {
          'worklet';
          if (finished) {
            scheduleOnRN(setVisible, false);
          }
        })}
      style={styles.overlay}>
      {brand}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  brandGroup: {
    alignItems: 'center',
    gap: 8,
  },
});
