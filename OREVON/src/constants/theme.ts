/**
 * OREVON design system tokens.
 *
 * Colors are defined for light and dark mode. Everything else (radius,
 * typography, spacing, shadow, motion) is a single shared scale used by
 * every screen so the app stays visually consistent as it grows.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Brand = {
  name: 'OREVON',
  positioning: 'Intelligent Oral Care',
  tagline: 'Your intelligent oral-care companion.',
  version: '1.0.0',
} as const;

export const Colors = {
  light: {
    text: '#14171A',
    textSecondary: '#60646C',
    textTertiary: '#9AA0A6',
    background: '#FAFAF8',
    backgroundElement: '#F1F2EF',
    backgroundSelected: '#E7E5DD',
    border: '#E4E5E1',

    primary: '#146B64',
    primaryMuted: '#E3F1EE',
    primaryPressed: '#0F5850',
    onPrimary: '#FFFFFF',

    secondary: '#4C5FE0',
    secondaryMuted: '#ECEEFB',

    success: '#2E9E6D',
    warning: '#C98A1B',
    danger: '#D64545',
  },
  dark: {
    text: '#F5F6F4',
    textSecondary: '#B0B4BA',
    textTertiary: '#787E86',
    background: '#0B0C0D',
    backgroundElement: '#1A1C1D',
    backgroundSelected: '#242628',
    border: '#2A2D30',

    primary: '#2FB3A8',
    primaryMuted: '#123634',
    primaryPressed: '#3FC7BC',
    onPrimary: '#052220',

    secondary: '#8B9CFF',
    secondaryMuted: '#1D2040',

    success: '#3FBE8A',
    warning: '#E0A93C',
    danger: '#E4685F',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

/** Subtle, restrained shadow for elevated surfaces. Use sparingly. */
export const Shadow = {
  subtle:
    Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 2 },
      default: {},
    }) ?? {},
} as const;

/** Standard animation durations, in milliseconds. */
export const Motion = {
  fast: 150,
  base: 250,
  slow: 450,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
