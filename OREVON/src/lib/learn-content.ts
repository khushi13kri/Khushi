/**
 * OREVON Learn content. General oral-care education only — nothing
 * here diagnoses or treats a condition. Ids are referenced by the
 * Plan Engine's learnArticleIds, so keep them in sync if you rename one.
 */

export type LearnArticle = {
  id: string;
  category: string;
  title: string;
  summary: string;
  body: string;
};

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    id: 'gum-care',
    category: 'Gum Care',
    title: 'Why gum health matters',
    summary: 'Healthy gums are the foundation of a healthy mouth.',
    body: 'Gums that are red, swollen, or bleed when you brush or floss are usually reacting to plaque buildup along the gumline. Gentle, consistent brushing and daily interdental cleaning are the two habits that help most. If bleeding continues for more than a week or two despite good habits, it is worth having a dentist take a look.',
  },
  {
    id: 'brushing',
    category: 'Brushing',
    title: 'Getting the most out of brushing',
    summary: 'Technique and consistency matter more than pressure.',
    body: 'Two minutes, twice a day, with a soft-bristled brush at a slight angle toward the gumline covers most of what brushing needs to do. Brushing harder does not clean better — it can actually wear down enamel and irritate gums over time. Short, gentle strokes work better than long, hard ones.',
  },
  {
    id: 'flossing',
    category: 'Flossing',
    title: 'Flossing technique that actually works',
    summary: 'The motion matters as much as doing it at all.',
    body: 'Floss removes plaque from between teeth that a brush can’t reach. Curve the floss into a C-shape against each tooth and slide it gently below the gumline, rather than snapping it straight down. It is normal for gums to bleed a little the first few times you start flossing regularly — that usually settles down within a week or two as gum health improves.',
  },
  {
    id: 'sensitivity',
    category: 'Sensitivity',
    title: 'Understanding tooth sensitivity',
    summary: 'Common, usually manageable, and worth mentioning to a dentist.',
    body: 'Sensitivity to hot, cold, or sweet often comes from worn enamel or receding gums exposing the softer layer underneath. A soft-bristled brush, gentler technique, and a sensitivity-formulated toothpaste can help many people. If sensitivity is sudden, severe, or affects just one tooth, that is a good reason to see a dentist rather than just adjusting your routine.',
  },
  {
    id: 'prevention',
    category: 'Prevention',
    title: 'The habits that prevent cavities',
    summary: 'Small, consistent habits do most of the work.',
    body: 'Cavities form when plaque acids wear away at enamel over time, so the habits that matter most are the ones you do every day: brushing twice daily, cleaning between teeth, and limiting how often (not just how much) sugary or acidic food and drink touch your teeth. Routine dental checkups catch early changes long before they become a bigger problem.',
  },
  {
    id: 'bad-breath',
    category: 'Bad Breath',
    title: 'What actually causes bad breath',
    summary: 'Most of the time, it starts on the tongue.',
    body: 'The back of the tongue is one of the biggest sources of the bacteria that cause bad breath, so tongue cleaning is often the single most effective habit to add to a routine. Staying hydrated and keeping up with regular brushing and flossing helps too. Persistent bad breath that doesn’t improve with better habits is worth mentioning at a dental visit.',
  },
  {
    id: 'whitening',
    category: 'Whitening',
    title: 'A realistic approach to whiter teeth',
    summary: 'Prevention and gentle care go further than harsh products.',
    body: 'Surface staining from coffee, tea, or red wine usually responds well to consistent brushing and routine cleanings. Whitening products can help too, but overusing abrasive ones can wear down enamel and increase sensitivity. If teeth are discolored in a way that seems unusual, it’s worth asking a dentist rather than guessing at the cause.',
  },
];

export function getLearnArticle(id: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((article) => article.id === id);
}
