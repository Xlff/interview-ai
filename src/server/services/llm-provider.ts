export type PrepPackEnhancementInput = {
  rawJD: string;
  roleSummary: string;
  highFreqQuestions: string[];
  studyOutline: string[];
};

export type FollowUpQuestionInput = {
  currentQuestion: string;
  userAnswer: string;
  dimension: string;
  evaluationPoints: string[];
};

export type AnswerEvaluationInput = {
  question: string;
  userAnswer: string;
  evaluationPoints: string[];
};

export type ReviewReportGenerationInput = {
  normalizedTitle: string;
  turns: Array<{
    question: string;
    answer: string;
    dimension: string;
  }>;
};

export type LLMProvider = {
  enhancePrepPack(input: PrepPackEnhancementInput): Promise<{
    roleSummary: string;
    highFreqQuestions: string[];
    studyOutline: string[];
  }>;
  rewriteSelectedQuestions(input: PrepPackEnhancementInput): Promise<string[]>;
  generateFollowUpQuestion(input: FollowUpQuestionInput): Promise<string>;
  evaluateInterviewAnswer(input: AnswerEvaluationInput): Promise<{
    summary: string;
    coveredPoints: string[];
    missingPoints: string[];
    verdict: "strong" | "mixed" | "weak";
  }>;
  generateReviewReport(input: ReviewReportGenerationInput): Promise<{
    strengths: string[];
    gaps: string[];
    communicationNotes: string[];
    nextStudyPlan: string[];
  }>;
};

export const noopLLMProvider: LLMProvider = {
  async enhancePrepPack(input) {
    return {
      roleSummary: input.roleSummary,
      highFreqQuestions: input.highFreqQuestions,
      studyOutline: input.studyOutline,
    };
  },
  async rewriteSelectedQuestions(input) {
    return input.highFreqQuestions;
  },
  async generateFollowUpQuestion() {
    return "请继续补充你的具体做法、结果和复盘。";
  },
  async evaluateInterviewAnswer() {
    return {
      summary: "当前为占位评估结果，后续接入真实模型。",
      coveredPoints: [],
      missingPoints: [],
      verdict: "mixed",
    };
  },
  async generateReviewReport() {
    return {
      strengths: [],
      gaps: [],
      communicationNotes: [],
      nextStudyPlan: [],
    };
  },
};
