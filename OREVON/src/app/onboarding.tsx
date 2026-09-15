import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { OptionCard } from '@/components/ui/option-card';
import { ProgressDots } from '@/components/ui/progress-dots';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { ASSESSMENT_QUESTIONS, type AssessmentAnswers } from '@/lib/assessment';
import { useAppState } from '@/state/app-state';

export default function OnboardingScreen() {
  const { setAssessment } = useAppState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});

  const question = ASSESSMENT_QUESTIONS[step];
  const isLastStep = step === ASSESSMENT_QUESTIONS.length - 1;
  const currentAnswer = answers[question.id];

  const canContinue =
    question.type === 'single'
      ? typeof currentAnswer === 'string'
      : Array.isArray(currentAnswer) && currentAnswer.length > 0;

  function selectSingle(optionId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  }

  function toggleMulti(optionId: string) {
    setAnswers((prev) => {
      const selected = Array.isArray(prev[question.id]) ? (prev[question.id] as string[]) : [];
      let next: string[];
      if (optionId === 'none') {
        next = selected.includes('none') ? [] : ['none'];
      } else if (selected.includes(optionId)) {
        next = selected.filter((id) => id !== optionId);
      } else {
        next = [...selected.filter((id) => id !== 'none'), optionId];
      }
      return { ...prev, [question.id]: next };
    });
  }

  function handleBack() {
    if (step === 0) {
      router.back();
      return;
    }
    setStep((current) => current - 1);
  }

  function handleContinue() {
    if (isLastStep) {
      setAssessment(answers);
      router.replace('/main');
      return;
    }
    setStep((current) => current + 1);
  }

  return (
    <Screen
      scroll
      footer={
        <Button
          label={isLastStep ? 'Finish' : 'Continue'}
          onPress={handleContinue}
          disabled={!canContinue}
        />
      }>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={handleBack} hitSlop={12}>
          <ThemedText type="h2">‹</ThemedText>
        </Pressable>
        <ProgressDots total={ASSESSMENT_QUESTIONS.length} current={step} />
        <ThemedText type="label" themeColor="textSecondary">
          {step + 1}/{ASSESSMENT_QUESTIONS.length}
        </ThemedText>
      </View>

      <View style={styles.titleGroup}>
        <ThemedText type="h2">{question.title}</ThemedText>
        {question.subtitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {question.subtitle}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.options}>
        {question.options.map((option) => {
          const selected =
            question.type === 'single'
              ? currentAnswer === option.id
              : Array.isArray(currentAnswer) && currentAnswer.includes(option.id);
          return (
            <OptionCard
              key={option.id}
              label={option.label}
              selected={selected}
              onPress={() => (question.type === 'single' ? selectSingle(option.id) : toggleMulti(option.id))}
            />
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  titleGroup: {
    gap: Spacing.one,
    marginBottom: Spacing.four,
  },
  options: {
    gap: Spacing.three,
  },
});
