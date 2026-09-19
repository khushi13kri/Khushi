import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code'
    | 'h2'
    | 'lead'
    | 'label'
    | 'wordmark'
    | 'button';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        type === 'h2' && styles.h2,
        type === 'lead' && styles.lead,
        type === 'label' && styles.label,
        type === 'wordmark' && styles.wordmark,
        type === 'button' && styles.button,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
  h2: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 700,
  },
  lead: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: 500,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  wordmark: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: 800,
    letterSpacing: 2,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 700,
  },
});
