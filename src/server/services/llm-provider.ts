export type LLMRequestOptions = {
  providerId?: string;
  model?: string;
};

export type LLMProviderConfig = {
  providerId: string;
  baseURL: string;
  apiKey: string;
  defaultModel: string;
  availableModels: string[];
};

export type LLMRegistry = {
  defaultProviderId: string | null;
  providers: Record<string, LLMProviderConfig>;
};

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

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

export function parseLLMRegistry(source: Record<string, string | undefined>): LLMRegistry {
  const providerIds = splitList(source.LLM_PROVIDER_IDS);

  if (providerIds.length === 0) {
    return {
      defaultProviderId: null,
      providers: {},
    };
  }

  const providers = Object.fromEntries(
    providerIds.map(function buildProvider(providerId) {
      const prefix = `LLM_${providerId.toUpperCase().replace(/[^A-Z0-9]/g, "_")}_`;

      const baseURL = source[`${prefix}BASE_URL`];
      const apiKey = source[`${prefix}API_KEY`];
      const defaultModel = source[`${prefix}DEFAULT_MODEL`];

      if (!baseURL || !apiKey || !defaultModel) {
        throw new Error(`Incomplete LLM provider configuration for ${providerId}`);
      }

      const availableModels = splitList(source[`${prefix}MODELS`]);

      return [
        providerId,
        {
          providerId,
          baseURL,
          apiKey,
          defaultModel,
          availableModels: availableModels.length > 0 ? availableModels : [defaultModel],
        } satisfies LLMProviderConfig,
      ];
    }),
  );

  const defaultProviderId = source.LLM_DEFAULT_PROVIDER ?? providerIds[0] ?? null;

  return {
    defaultProviderId,
    providers,
  };
}

export function resolveLLMSelection(
  registry: LLMRegistry,
  options?: LLMRequestOptions,
) {
  const providerId = options?.providerId ?? registry.defaultProviderId;

  if (!providerId) {
    throw new Error("No LLM provider is configured");
  }

  const provider = registry.providers[providerId];

  if (!provider) {
    throw new Error(`Unknown LLM provider: ${providerId}`);
  }

  const model = options?.model ?? provider.defaultModel;

  return {
    providerId,
    model,
    config: provider,
  };
}

export function createLLMProvider(options?: LLMRequestOptions): LLMProvider {
  const registry = parseLLMRegistry(process.env);

  if (!registry.defaultProviderId || Object.keys(registry.providers).length === 0) {
    return noopLLMProvider;
  }

  return createOpenAICompatibleProvider(registry, options);
}

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
  async generateFollowUpQuestion(_input) {
    return "请继续补充你的具体做法、结果和复盘。";
  },
  async evaluateInterviewAnswer(_input) {
    return {
      summary: "当前为占位评估结果，后续接入真实模型。",
      coveredPoints: [],
      missingPoints: [],
      verdict: "mixed",
    };
  },
  async generateReviewReport(_input) {
    return {
      strengths: [],
      gaps: [],
      communicationNotes: [],
      nextStudyPlan: [],
    };
  },
};

function createOpenAICompatibleProvider(
  registry: LLMRegistry,
  options?: LLMRequestOptions,
): LLMProvider {
  return {
    async enhancePrepPack(input) {
      try {
        const selection = resolveLLMSelection(registry, options);
        const payload = await runChatCompletion(selection.config, selection.model, [
          {
            role: "system",
            content:
              "You generate concise, structured interview-prep content. Return valid JSON only with keys roleSummary, highFreqQuestions, studyOutline.",
          },
          {
            role: "user",
            content: [
              "请基于下面的 JD 与已有准备包草稿，对准备包做增强。",
              "要求：",
              "1. 保持中文输出",
              "2. roleSummary 1 段，简洁直接",
              "3. highFreqQuestions 返回 3 到 5 条字符串",
              "4. studyOutline 返回 3 到 5 条字符串",
              "5. 不要返回 markdown，不要返回额外字段",
              "",
              `JD:\n${input.rawJD}`,
              "",
              `当前角色总结:\n${input.roleSummary}`,
              "",
              `当前高频问题:\n${input.highFreqQuestions.join("\n")}`,
              "",
              `当前复习提纲:\n${input.studyOutline.join("\n")}`,
            ].join("\n"),
          },
        ]);

        const parsed = parseJSONObject(payload);

        return {
          roleSummary:
            typeof parsed.roleSummary === "string" && parsed.roleSummary.trim().length > 0
              ? parsed.roleSummary
              : input.roleSummary,
          highFreqQuestions: normalizeStringArray(parsed.highFreqQuestions, input.highFreqQuestions),
          studyOutline: normalizeStringArray(parsed.studyOutline, input.studyOutline),
        };
      } catch {
        return {
          roleSummary: input.roleSummary,
          highFreqQuestions: input.highFreqQuestions,
          studyOutline: input.studyOutline,
        };
      }
    },
    async rewriteSelectedQuestions(input) {
      const enhanced = await this.enhancePrepPack(input);
      return enhanced.highFreqQuestions;
    },
    async generateFollowUpQuestion(input) {
      return noopLLMProvider.generateFollowUpQuestion(input);
    },
    async evaluateInterviewAnswer(input) {
      return noopLLMProvider.evaluateInterviewAnswer(input);
    },
    async generateReviewReport(input) {
      return noopLLMProvider.generateReviewReport(input);
    },
  };
}

async function runChatCompletion(
  config: LLMProviderConfig,
  model: string,
  messages: Array<{ role: "system" | "user"; content: string }>,
) {
  const response = await fetch(buildChatCompletionURL(config.baseURL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map(function collectText(item) {
        return item.text ?? "";
      })
      .join("");
  }

  throw new Error("LLM response did not include a text payload");
}

function buildChatCompletionURL(baseURL: string) {
  return `${baseURL.replace(/\/$/, "")}/chat/completions`;
}

function parseJSONObject(content: string) {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON object found in LLM response");
    }

    return JSON.parse(match[0]) as Record<string, unknown>;
  }
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const normalized = value
    .filter(function includeString(item) {
      return typeof item === "string" && item.trim().length > 0;
    })
    .map(function trimItem(item) {
      return item.trim();
    });

  return normalized.length > 0 ? normalized : fallback;
}

function splitList(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map(function trimItem(item) {
      return item.trim();
    })
    .filter(Boolean);
}
