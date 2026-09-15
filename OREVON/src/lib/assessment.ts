/**
 * The single source of truth for OREVON's assessment questionnaire.
 * Used by the onboarding screen (to render the flow) and by the Score
 * and Plan engines (to read what the user told us).
 */

export type AssessmentOption = { id: string; label: string };

export type AssessmentQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'multi';
  options: AssessmentOption[];
};

export type AssessmentAnswers = Record<string, string | string[]>;

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
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
    id: 'tongueCleaning',
    type: 'single',
    title: 'How often do you clean your tongue?',
    options: [
      { id: 'daily', label: 'Daily' },
      { id: 'fewTimesWeek', label: 'A few times a week' },
      { id: 'rarely', label: 'Rarely' },
      { id: 'never', label: 'Never' },
    ],
  },
  {
    id: 'mouthwashUse',
    type: 'single',
    title: 'How often do you use mouthwash?',
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
