"use client";

import type { MockJobDescriptionRecord } from "@/features/content/models/content-layer";
import { useJobTargetForm } from "../view-models/use-job-target-form";

const domains = [
  { value: "technical", label: "技术岗位" },
  { value: "product", label: "产品岗位" },
  { value: "operations", label: "运营岗位" },
] as const;

type JobTargetFormProps = {
  mockJobDescriptions: MockJobDescriptionRecord[];
};

function getMockGroupLabel(domain: MockJobDescriptionRecord["domain"], level: MockJobDescriptionRecord["level"]) {
  const domainLabelMap = {
    technical: "技术岗位",
    product: "产品岗位",
    operations: "运营岗位",
  } as const;

  return `${domainLabelMap[domain]} / ${level}`;
}

export default function JobTargetForm({ mockJobDescriptions }: JobTargetFormProps) {
  const {
    state,
    errors,
    isSubmitting,
    submitError,
    selectMockJobDescription,
    setPreferredDomain,
    setRawJD,
    submit,
  } = useJobTargetForm(mockJobDescriptions);

  const mockOptions = Object.entries(
    mockJobDescriptions.reduce<Record<string, MockJobDescriptionRecord[]>>(function groupOptions(
      groups,
      item,
    ) {
      const groupKey = `${item.domain}:${item.level}`;
      const existingGroup = groups[groupKey] ?? [];

      return {
        ...groups,
        [groupKey]: [...existingGroup, item],
      };
    }, {}),
  );

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
        <label className="grid gap-2">
          <span className="font-bold">示例 JD 模板</span>
          <select
            aria-label="示例 JD 模板"
            value={state.selectedMockJobDescriptionId}
            onChange={function handleChange(event) {
              selectMockJobDescription(event.target.value);
            }}
            className="min-h-12 rounded-[14px] border border-[var(--border)] bg-white px-[14px] text-base"
          >
            <option value="">
              选择一条 mock JD 模板，自动填入后可继续修改
            </option>
            {mockOptions.map(function renderGroup([groupKey, items]) {
              const [domain, level] = groupKey.split(":") as [
                MockJobDescriptionRecord["domain"],
                MockJobDescriptionRecord["level"],
              ];

              return (
                <optgroup key={groupKey} label={getMockGroupLabel(domain, level)}>
                  {items.map(function renderItem(item) {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    );
                  })}
                </optgroup>
              );
            })}
          </select>
        </label>

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
