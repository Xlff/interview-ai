import type { QuestionBankItemSeed } from "@/features/content/models/content-layer";

type SelectTopQuestionsInput = {
  domain: string;
  normalizedTitle: string;
  level: string;
  matchedSkills: string[];
  preferredDimensions: string[];
  maxQuestions: number;
  questionBankItems: QuestionBankItemSeed[];
};

export function selectTopQuestions(input: SelectTopQuestionsInput) {
  return input.questionBankItems
    .filter(function matchesDomain(item) {
      return item.domain === input.domain && item.isActive;
    })
    .map(function scoreItem(item) {
      return {
        item,
        score: calculateScore(item, input),
      };
    })
    .sort(function compare(left, right) {
      return right.score - left.score;
    })
    .slice(0, input.maxQuestions)
    .map(function unwrap(entry) {
      return entry.item;
    });
}

function calculateScore(item: QuestionBankItemSeed, input: SelectTopQuestionsInput) {
  let score = 0;

  if (item.normalizedTitle === input.normalizedTitle) {
    score += 4;
  }

  if (item.level === input.level) {
    score += 3;
  }

  score += item.skillTags.filter(function includesMatchedSkill(tag) {
    return input.matchedSkills.includes(tag);
  }).length * 2;

  if (input.preferredDimensions.includes(item.dimension)) {
    score += 1;
  }

  if (item.questionType === "primary") {
    score += 1;
  }

  return score;
}
