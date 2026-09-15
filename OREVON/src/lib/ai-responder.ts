/**
 * OREVON AI — V1 is a rule-based responder, not a live LLM. It matches
 * a message against known oral-care topics (reusing the same Learn
 * content so the two never disagree) and always defers to a dentist
 * for anything that sounds urgent or like a diagnosis request. This
 * keeps the same "deterministic, explainable, no medical claims"
 * approach as the Score and Plan engines. Swapping in a real LLM later
 * is a drop-in replacement for generateAiReply — the chat UI doesn't
 * need to change.
 */

import { LEARN_ARTICLES } from '@/lib/learn-content';

export const SEED_MESSAGE =
  "Hi, I'm OREVON AI. I can help explain general oral-care topics — brushing, flossing, gum " +
  "health, sensitivity, prevention, bad breath, and whitening. I don't diagnose anything; for " +
  'that, a dentist is always the right call. What’s on your mind?';

const TOPIC_MATCHERS: { id: string; keywords: string[] }[] = [
  { id: 'gum-care', keywords: ['gum', 'gums', 'bleed', 'bleeding'] },
  { id: 'brushing', keywords: ['brush', 'brushing', 'toothbrush'] },
  { id: 'flossing', keywords: ['floss', 'interdental', 'between my teeth', 'between teeth'] },
  { id: 'sensitivity', keywords: ['sensitiv', 'cold drink', 'hot drink', 'sharp pain', 'twinge'] },
  { id: 'prevention', keywords: ['cavity', 'cavities', 'decay', 'hole in my tooth'] },
  { id: 'bad-breath', keywords: ['breath', 'smell', 'odor', 'odour', 'halitosis'] },
  { id: 'whitening', keywords: ['white', 'whitening', 'stain', 'yellow', 'discolor'] },
];

const URGENT_KEYWORDS = [
  'severe',
  "won't stop",
  'wont stop',
  'emergency',
  'knocked out',
  'broken tooth',
  'swollen face',
  'fever',
  'unbearable',
  'infection',
  'pus',
  'a lot of blood',
  'heavy bleeding',
];

const DIAGNOSIS_KEYWORDS = ['do i have', 'diagnose', 'is this cancer', 'what disease', 'what condition'];
const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'hiya'];
const THANKS_KEYWORDS = ['thanks', 'thank you', 'thx'];

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export type AiReply = {
  text: string;
  relatedLearnId?: string;
};

export function generateAiReply(message: string): AiReply {
  const text = message.trim().toLowerCase();

  if (text.length === 0) {
    return { text: "I didn't quite catch that — could you tell me a bit more?" };
  }

  if (matchesAny(text, URGENT_KEYWORDS) || matchesAny(text, DIAGNOSIS_KEYWORDS)) {
    return {
      text:
        "That sounds like something I shouldn't guess about. I can share general oral-care " +
        "education, but I can't diagnose conditions or assess urgent symptoms. Please see a " +
        'dentist — if it involves heavy bleeding, swelling, a knocked-out tooth, or fever, ' +
        'consider urgent or emergency care.',
    };
  }

  if (matchesAny(text, GREETING_KEYWORDS) && text.length < 20) {
    return { text: SEED_MESSAGE };
  }

  if (matchesAny(text, THANKS_KEYWORDS)) {
    return { text: "You're welcome! Let me know if there's anything else you'd like to understand better." };
  }

  const matchedTopic = TOPIC_MATCHERS.find((topic) => matchesAny(text, topic.keywords));
  const article = matchedTopic ? LEARN_ARTICLES.find((a) => a.id === matchedTopic.id) : undefined;

  if (article) {
    return {
      text: `${article.body} You can find more on this in the Learn tab, under "${article.title}".`,
      relatedLearnId: article.id,
    };
  }

  return {
    text:
      'I can help with general oral-care topics like brushing, flossing, gum health, ' +
      'sensitivity, prevention, bad breath, and whitening. Could you tell me a bit more about ' +
      "what you're noticing? And for anything that concerns you, a dentist is always the right call.",
  };
}
