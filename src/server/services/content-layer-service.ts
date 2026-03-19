import type {
  RoleConfigSeed,
  RoleTemplateSeed,
} from "@/features/content/models/content-layer";

const levelPriority = ["高级", "中级", "初级"] as const;

type RoleResolutionInput = {
  domain: string;
  normalizedTitle: string;
  level: string;
};

export function resolveRoleTemplate<
  T extends {
    domain: string;
    normalizedTitle: string;
    level: string;
    isActive: boolean;
  },
>(
  input: RoleResolutionInput,
  templates: T[],
): T | null {
  const domainTemplates = templates.filter(function matchesDomain(template) {
    return template.domain === input.domain && template.isActive;
  });

  if (domainTemplates.length === 0) {
    return null;
  }

  const exact = domainTemplates.find(function matchesExactly(template) {
    return template.normalizedTitle === input.normalizedTitle && template.level === input.level;
  });

  if (exact) {
    return exact;
  }

  const sameTitle = domainTemplates.filter(function matchesTitle(template) {
    return template.normalizedTitle === input.normalizedTitle;
  });

  if (sameTitle.length > 0) {
    return rankByLevelPreference(input.level, sameTitle)[0] ?? null;
  }

  return rankByLevelPreference(input.level, domainTemplates)[0] ?? null;
}

export function resolveRoleConfig<
  TTemplate extends Pick<RoleTemplateSeed, "domain" | "normalizedTitle" | "level">,
>(
  template: TTemplate | null,
  configs: RoleConfigSeed[],
) {
  if (!template) {
    return null;
  }

  return (
    configs.find(function matchesTemplate(config) {
      return (
        config.domain === template.domain &&
        config.normalizedTitle === template.normalizedTitle &&
        config.level === template.level &&
        config.isActive
      );
    }) ?? null
  );
}

function rankByLevelPreference<
  T extends {
    level: string;
  },
>(level: string, templates: T[]) {
  const requestedIndex = levelPriority.indexOf(level as (typeof levelPriority)[number]);

  return templates
    .slice()
    .sort(function compare(left, right) {
      return scoreLevel(right.level, requestedIndex) - scoreLevel(left.level, requestedIndex);
    });
}

function scoreLevel(level: string, requestedIndex: number) {
  const currentIndex = levelPriority.indexOf(level as (typeof levelPriority)[number]);

  if (requestedIndex === -1) {
    return levelPriority.length - currentIndex;
  }

  if (currentIndex === requestedIndex) {
    return 10;
  }

  if (currentIndex > requestedIndex) {
    return 5 - (currentIndex - requestedIndex);
  }

  return 1 - (requestedIndex - currentIndex);
}
