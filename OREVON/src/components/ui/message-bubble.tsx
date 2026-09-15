import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MessageBubbleProps = {
  role: 'user' | 'assistant';
  text: string;
};

export function MessageBubble({ role, text }: MessageBubbleProps) {
  const theme = useTheme();
  const isUser = role === 'user';

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      <View style={[styles.bubble, { backgroundColor: isUser ? theme.primary : theme.backgroundElement }]}>
        <ThemedText type="default" themeColor={isUser ? 'onPrimary' : 'text'}>
          {text}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.three,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
