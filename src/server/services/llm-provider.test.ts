import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createLLMProvider,
  parseLLMRegistry,
  resolveLLMSelection,
} from "./llm-provider";

afterEach(function restoreEnvAndMocks() {
  vi.unstubAllGlobals();
});

describe("llm provider registry", function () {
  it("parses multiple OpenAI-compatible providers from env-style config", function () {
    const registry = parseLLMRegistry({
      LLM_PROVIDER_IDS: "openrouter,siliconflow",
      LLM_DEFAULT_PROVIDER: "openrouter",
      LLM_OPENROUTER_BASE_URL: "https://openrouter.example/v1",
      LLM_OPENROUTER_API_KEY: "openrouter-key",
      LLM_OPENROUTER_DEFAULT_MODEL: "openai/gpt-4.1-mini",
      LLM_OPENROUTER_MODELS: "openai/gpt-4.1-mini,qwen/qwen3-32b",
      LLM_SILICONFLOW_BASE_URL: "https://siliconflow.example/v1",
      LLM_SILICONFLOW_API_KEY: "siliconflow-key",
      LLM_SILICONFLOW_DEFAULT_MODEL: "deepseek-v3",
      LLM_SILICONFLOW_MODELS: "deepseek-v3,qwen-max",
    });

    expect(registry.defaultProviderId).toBe("openrouter");
    expect(registry.providers.openrouter?.availableModels).toEqual(
      expect.arrayContaining(["openai/gpt-4.1-mini", "qwen/qwen3-32b"]),
    );
    expect(registry.providers.siliconflow?.baseURL).toBe("https://siliconflow.example/v1");
  });

  it("supports default model selection with request-level overrides", function () {
    const registry = parseLLMRegistry({
      LLM_PROVIDER_IDS: "openrouter,siliconflow",
      LLM_DEFAULT_PROVIDER: "openrouter",
      LLM_OPENROUTER_BASE_URL: "https://openrouter.example/v1",
      LLM_OPENROUTER_API_KEY: "openrouter-key",
      LLM_OPENROUTER_DEFAULT_MODEL: "openai/gpt-4.1-mini",
      LLM_OPENROUTER_MODELS: "openai/gpt-4.1-mini,qwen/qwen3-32b",
      LLM_SILICONFLOW_BASE_URL: "https://siliconflow.example/v1",
      LLM_SILICONFLOW_API_KEY: "siliconflow-key",
      LLM_SILICONFLOW_DEFAULT_MODEL: "deepseek-v3",
      LLM_SILICONFLOW_MODELS: "deepseek-v3,qwen-max",
    });

    const defaultSelection = resolveLLMSelection(registry);
    const overriddenSelection = resolveLLMSelection(registry, {
      providerId: "siliconflow",
      model: "qwen-max",
    });

    expect(defaultSelection.providerId).toBe("openrouter");
    expect(defaultSelection.model).toBe("openai/gpt-4.1-mini");
    expect(overriddenSelection.providerId).toBe("siliconflow");
    expect(overriddenSelection.model).toBe("qwen-max");
  });

  it("uses request-level provider and model overrides for live prep-pack enhancement", async function () {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  roleSummary: "增强后的岗位总结",
                  highFreqQuestions: ["问题 A", "问题 B", "问题 C"],
                  studyOutline: ["提纲 A", "提纲 B"],
                }),
              },
            },
          ],
        }),
      }),
    );

    const originalEnv = process.env;

    process.env = {
      ...originalEnv,
      LLM_PROVIDER_IDS: "openrouter,siliconflow",
      LLM_DEFAULT_PROVIDER: "openrouter",
      LLM_OPENROUTER_BASE_URL: "https://openrouter.example/v1",
      LLM_OPENROUTER_API_KEY: "openrouter-key",
      LLM_OPENROUTER_DEFAULT_MODEL: "openai/gpt-4.1-mini",
      LLM_OPENROUTER_MODELS: "openai/gpt-4.1-mini,qwen/qwen3-32b",
      LLM_SILICONFLOW_BASE_URL: "https://siliconflow.example/v1",
      LLM_SILICONFLOW_API_KEY: "siliconflow-key",
      LLM_SILICONFLOW_DEFAULT_MODEL: "deepseek-v3",
      LLM_SILICONFLOW_MODELS: "deepseek-v3,qwen-max",
    };

    try {
      const provider = createLLMProvider({
        providerId: "siliconflow",
        model: "qwen-max",
      });

      const enhanced = await provider.enhancePrepPack({
        rawJD: "负责增长运营、A/B 测试与数据分析。",
        roleSummary: "原始总结",
        highFreqQuestions: ["原始问题"],
        studyOutline: ["原始提纲"],
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://siliconflow.example/v1/chat/completions",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer siliconflow-key",
          }),
          body: expect.stringContaining('"model":"qwen-max"'),
        }),
      );
      expect(enhanced.roleSummary).toBe("增强后的岗位总结");
      expect(enhanced.highFreqQuestions).toEqual(["问题 A", "问题 B", "问题 C"]);
      expect(enhanced.studyOutline).toEqual(["提纲 A", "提纲 B"]);
    } finally {
      process.env = originalEnv;
    }
  });

  it("uses the live provider for follow-up, answer evaluation, and review generation", async function () {
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: "请继续补充你负责的指标、动作和最终结果。",
                },
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    summary: "回答有案例，但量化结果还不够明确。",
                    coveredPoints: ["项目", "动作"],
                    missingPoints: ["量化指标"],
                    verdict: "mixed",
                  }),
                },
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    strengths: ["案例背景交代清楚"],
                    gaps: ["量化结果表达偏弱"],
                    communicationNotes: ["建议先讲目标，再讲动作和结果"],
                    nextStudyPlan: ["补两段可量化的项目案例"],
                  }),
                },
              },
            ],
          }),
        }),
    );

    const originalEnv = process.env;

    process.env = {
      ...originalEnv,
      LLM_PROVIDER_IDS: "deepseek",
      LLM_DEFAULT_PROVIDER: "deepseek",
      LLM_DEEPSEEK_BASE_URL: "https://deepseek.example/v1",
      LLM_DEEPSEEK_API_KEY: "deepseek-key",
      LLM_DEEPSEEK_DEFAULT_MODEL: "deepseek-chat",
      LLM_DEEPSEEK_MODELS: "deepseek-chat,deepseek-reasoner",
    };

    try {
      const provider = createLLMProvider();

      const followUp = await provider.generateFollowUpQuestion({
        currentQuestion: "请介绍一个你主导的项目",
        userAnswer: "我做过一个后台系统。",
        dimension: "项目实战",
        evaluationPoints: ["项目复杂度", "量化结果"],
      });
      const evaluation = await provider.evaluateInterviewAnswer({
        question: "请介绍一个你主导的项目",
        userAnswer: "我主导过一个后台系统改造，拆解了模块并推动上线。",
        evaluationPoints: ["项目复杂度", "量化结果"],
      });
      const report = await provider.generateReviewReport({
        normalizedTitle: "前端开发工程师",
        turns: [
          {
            question: "请介绍一个你主导的项目",
            answer: "我主导过一个后台系统改造，拆解了模块并推动上线。",
            dimension: "项目实战",
          },
        ],
      });

      expect(followUp).toBe("请继续补充你负责的指标、动作和最终结果。");
      expect(evaluation).toEqual({
        summary: "回答有案例，但量化结果还不够明确。",
        coveredPoints: ["项目", "动作"],
        missingPoints: ["量化指标"],
        verdict: "mixed",
      });
      expect(report).toEqual({
        strengths: ["案例背景交代清楚"],
        gaps: ["量化结果表达偏弱"],
        communicationNotes: ["建议先讲目标，再讲动作和结果"],
        nextStudyPlan: ["补两段可量化的项目案例"],
      });
      expect(fetch).toHaveBeenCalledTimes(3);
    } finally {
      process.env = originalEnv;
    }
  });
});
