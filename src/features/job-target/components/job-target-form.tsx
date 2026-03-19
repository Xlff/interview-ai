"use client";

import type { MockJobDescriptionRecord } from "@/features/content/models/content-layer";
import { useJobTargetForm } from "../view-models/use-job-target-form";

const domains = [
  { value: "technical", label: "技术岗位" },
  { value: "product", label: "产品岗位" },
  { value: "operations", label: "运营岗位" },
] as const;

const mockLevels = [
  { value: "", label: "全部级别" },
  { value: "初级", label: "初级" },
  { value: "中级", label: "中级" },
  { value: "高级", label: "高级" },
] as const;

type JobTargetFormProps = {
  mockJobDescriptions: MockJobDescriptionRecord[];
};

function getMockOptionLabel(item: MockJobDescriptionRecord) {
  return `${item.normalizedTitle} · ${item.level} · ${item.label}`;
}

export default function JobTargetForm({ mockJobDescriptions }: JobTargetFormProps) {
  const {
    state,
    errors,
    isSubmitting,
    submitError,
    selectMockJobDescription,
    setSelectedMockLevel,
    setPreferredDomain,
    setRawJD,
    submit,
  } = useJobTargetForm(mockJobDescriptions);

  const filteredMockJobDescriptions = mockJobDescriptions.filter(function includeMockJobDescription(item) {
    if (item.domain !== state.preferredDomain) {
      return false;
    }

    if (state.selectedMockLevel && item.level !== state.selectedMockLevel) {
      return false;
    }

    return true;
  });
  const selectedMockJobDescriptionId = filteredMockJobDescriptions.some(function hasSelection(item) {
    return item.id === state.selectedMockJobDescriptionId;
  })
    ? state.selectedMockJobDescriptionId
    : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit();
  }

  return (
    <section
      id="jd-input"
      className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6"
    >
      <div className="grid gap-2.5">
        <h2 className="text-[1.45rem] font-semibold">
          粘贴 JD，生成岗位目标画像
        </h2>
        <p className="leading-[1.7] text-[var(--muted)]">
          第一版支持产品、运营、技术岗。提交后会先做岗位归类、职级判断和关键词提取。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <section className="grid gap-3 rounded-[20px] border border-[var(--border)] bg-[rgba(239,226,207,0.24)] p-4">
          <div className="grid gap-1">
            <h3 className="text-[1.02rem] font-semibold">示例 JD</h3>
            <p className="text-[0.95rem] leading-[1.7] text-[var(--muted)]">
              先按岗位方向和级别筛选，再选择一条模板快速填入，之后可以继续修改。
            </p>
          </div>

          <div className="grid gap-3 md:[grid-template-columns:minmax(0,1fr)_minmax(0,180px)_minmax(0,1.5fr)]">
            <label className="grid min-w-0 gap-2">
              <span className="font-bold">示例岗位方向</span>
              <select
                aria-label="示例岗位方向"
                value={state.preferredDomain}
                onChange={function handleChange(event) {
                  setPreferredDomain(event.target.value as (typeof domains)[number]["value"]);
                }}
                className="min-h-12 w-full min-w-0 rounded-[14px] border border-[var(--border)] bg-white px-[14px] text-base"
              >
                {domains.map(function renderDomain(option) {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="font-bold">示例级别</span>
              <select
                aria-label="示例级别"
                value={state.selectedMockLevel}
                onChange={function handleChange(event) {
                  setSelectedMockLevel(
                    event.target.value as "" | MockJobDescriptionRecord["level"],
                  );
                }}
                className="min-h-12 w-full min-w-0 rounded-[14px] border border-[var(--border)] bg-white px-[14px] text-base"
              >
                {mockLevels.map(function renderLevel(option) {
                  return (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="font-bold">示例 JD 模板</span>
              <select
                aria-label="示例 JD 模板"
                value={selectedMockJobDescriptionId}
                onChange={function handleChange(event) {
                  selectMockJobDescription(event.target.value);
                }}
                className="min-h-12 w-full min-w-0 rounded-[14px] border border-[var(--border)] bg-white px-[14px] text-base"
              >
                <option value="">
                  选择一条模板
                </option>
                {filteredMockJobDescriptions.map(function renderItem(item) {
                  return (
                    <option key={item.id} value={item.id}>
                      {getMockOptionLabel(item)}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        </section>

        <label className="grid gap-2">
          <span className="font-bold">岗位方向</span>
          <select
            aria-label="岗位方向"
            value={state.preferredDomain}
            onChange={function handleChange(event) {
              setPreferredDomain(event.target.value as (typeof domains)[number]["value"]);
            }}
            className="min-h-12 rounded-[14px] border border-[var(--border)] bg-white px-[14px] text-base"
          >
            {domains.map(function renderDomain(option) {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="font-bold">职位描述</span>
          <textarea
            aria-label="职位描述"
            value={state.rawJD}
            onChange={function handleChange(event) {
              setRawJD(event.target.value);
            }}
            placeholder="粘贴完整 JD，包括职责、技能要求、经验要求等"
            className="min-h-[220px] resize-y rounded-[18px] border border-[var(--border)] bg-white p-4 text-base leading-[1.7]"
          />
        </label>

        {errors.rawJD ? (
          <p className="font-semibold text-[#b83b20]">
            {errors.rawJD}
          </p>
        ) : null}

        {submitError ? (
          <p className="font-semibold text-[#b83b20]">
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            disabled={isSubmitting}
            type="submit"
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border-0 bg-[var(--accent)] px-5 leading-none font-bold text-[var(--accent-foreground)] cursor-pointer disabled:cursor-progress disabled:opacity-70"
          >
            {isSubmitting ? "解析中..." : "生成岗位目标"}
          </button>
          <span className="text-[0.95rem] text-[var(--muted)]">
            成功解析后会自动进入岗位准备包页面。
          </span>
        </div>
      </form>
    </section>
  );
}
