import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { OptionCard } from '@/components/ui/option-card';
import { ProgressDots } from '@/components/ui/progress-dots';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';

type Option = { id: string; label: string };

type Question = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'multi';
  options: Option[];
};

const QUESTIONS: Question[] = [
  {
    id: 'ageGroup',
    type: 'single',
    title: "What's your age group?",
    options: [
      { id: 'under18', label: 'Under 18' },
      { id: '18-24', label: '18–24' },
      { id: '25-34', label: '25–34' },
      { id: '35-44', label: '35–44' },
      { id: '45-54', label: '45–54' },
      { id: '55plus', label: '55+' },
    ],
  },
  {
    id: 'goal',
    type: 'single',
    title: "What's your main oral-care goal?",
    options: [
      { id: 'fresherBreath', label: 'Fresher breath' },
      { id: 'healthierGums', label: 'Healthier gums' },
      { id: 'whiterTeeth', label: 'Whiter teeth' },
      { id: 'cavityPrevention', label: 'Cavity prevention' },
      { id: 'sensitivityRelief', label: 'Sensitivity relief' },
      { id: 'generalMaintenance', label: 'General maintenance' },
    ],
  },
  {
    id: 'brushingFrequency',
    type: 'single',
    title: 'How often do you brush?',
    options: [
      { id: 'onceDaily', label: 'Once a day' },
      { id: 'twiceDaily', label: 'Twice a day' },
      { id: 'moreThanTwice', label: 'More than twice a day' },
      { id: 'rarely', label: 'Rarely' },
    ],
  },
  {
    id: 'flossFrequency',
    type: 'single',
    title: 'How often do you floss or clean between teeth?',
    options: [
      { id: 'daily', label: 'Daily' },
      { id: 'fewTimesWeek', label: 'A few times a week' },
      { id: 'rarely', label: 'Rarely' },
      { id: 'never', label: 'Never' },
    ],
  },
  {
    id: 'sensitivity',
    type: 'single',
    title: 'Do you experience tooth sensitivity?',
    options: [
      { id: 'none', label: 'None' },
      { id: 'mild', label: 'Mild' },
      { id: 'moderate', label: 'Moderate' },
      { id: 'severe', label: 'Severe' },
    ],
  },
  {
    id: 'concerns',
    type: 'multi',
    title: 'Any oral-care concerns we should know about?',
    subtitle: 'Select all that apply',
    options: [
      { id: 'badBreath', label: 'Bad breath' },
      { id: 'bleedingGums', label: 'Bleeding gums' },
      { id: 'cavities', label: 'Cavities' },
      { id: 'sensitivity', label: 'Sensitivity' },
      { id: 'staining', label: 'Stains or discoloration' },
      { id: 'alignment', label: 'Crowding or alignment' },
      { id: 'none', label: 'None of these' },
    ],
  },
];

type Answers = Record<string, string | string[]>;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const question = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;
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
        <ProgressDots total={QUESTIONS.length} current={step} />
        <ThemedText type="label" themeColor="textSecondary">
          {step + 1}/{QUESTIONS.length}
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
