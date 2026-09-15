import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MessageBubble } from '@/components/ui/message-bubble';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { generateAiReply } from '@/lib/ai-responder';
import { useAppState } from '@/state/app-state';

const REPLY_DELAY_MS = 400;

export default function AiScreen() {
  const { chatMessages, addChatMessage } = useAppState();
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const theme = useTheme();
  const canSend = draft.trim().length > 0;

  function handleSend() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    addChatMessage('user', trimmed);
    setDraft('');
    const reply = generateAiReply(trimmed);
    setTimeout(() => addChatMessage('assistant', reply.text), REPLY_DELAY_MS);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <ThemedText type="h2">OREVON AI</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              General oral-care education — not a diagnosis. For anything concerning, a dentist is
              the right next step.
            </ThemedText>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}>
            {chatMessages.map((message) => (
              <MessageBubble key={message.id} role={message.role} text={message.text} />
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Ask about brushing, flossing, gum health…"
              placeholderTextColor={theme.textTertiary}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
              multiline
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send message"
              disabled={!canSend}
              onPress={handleSend}
              style={({ pressed }) => [
                styles.sendButton,
                { backgroundColor: theme.primary },
                !canSend && styles.sendButtonDisabled,
                pressed && canSend && styles.pressed,
              ]}>
              <ThemedText themeColor="onPrimary" style={styles.sendArrow}>
                ↑
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  header: {
    gap: Spacing.one,
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: Spacing.two,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  input: {
    flex: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    maxHeight: 120,
    fontSize: 16,
    lineHeight: 22,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendArrow: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.85,
  },
});
