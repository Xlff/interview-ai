import type {
  MockJobDescriptionSeed,
  QuestionBankItemSeed,
  RoleConfigSeed,
  RoleTemplateSeed,
  SkillDictionarySeed,
} from "../../features/content/models/content-layer";

function makeMockJobDescriptions(
  domain: MockJobDescriptionSeed["domain"],
  normalizedTitle: string,
  level: MockJobDescriptionSeed["level"],
  entries: Array<{ label: string; rawJD: string }>,
) {
  return entries.map(function buildMock(entry) {
    return {
      domain,
      normalizedTitle,
      level,
      label: entry.label,
      rawJD: entry.rawJD,
      isSeed: true,
    } satisfies MockJobDescriptionSeed;
  });
}

function makeQuestion(
  domain: QuestionBankItemSeed["domain"],
  normalizedTitle: string,
  level: QuestionBankItemSeed["level"],
  dimension: string,
  question: string,
  skillTags: string[],
  evaluationPoints: string[],
  followUpHints: string[],
): QuestionBankItemSeed {
  return {
    domain,
    normalizedTitle,
    level,
    dimension,
    question,
    questionType: "primary",
    skillTags,
    evaluationPoints,
    followUpHints,
    isActive: true,
  };
}

export const skillDictionaries: SkillDictionarySeed[] = [
  { name: "React", aliases: ["react", "react.js"], domain: "technical", category: "framework", isActive: true },
  { name: "Vue 3", aliases: ["vue3", "vue 3", "vue.js", "vue"], domain: "technical", category: "framework", isActive: true },
  { name: "TypeScript", aliases: ["typescript", "ts"], domain: "technical", category: "language", isActive: true },
  { name: "Next.js", aliases: ["next", "nextjs", "next.js"], domain: "technical", category: "framework", isActive: true },
  { name: "JavaScript", aliases: ["javascript", "js", "es6"], domain: "technical", category: "language", isActive: true },
  { name: "HTML/CSS", aliases: ["html/css", "html", "css", "w3c"], domain: "technical", category: "language", isActive: true },
  { name: "Vite", aliases: ["vite"], domain: "technical", category: "tooling", isActive: true },
  { name: "Webpack", aliases: ["webpack"], domain: "technical", category: "tooling", isActive: true },
  { name: "Node.js", aliases: ["node", "nodejs", "node.js"], domain: "technical", category: "runtime", isActive: true },
  { name: "SQL", aliases: ["sql", "mysql", "postgresql"], domain: "technical", category: "database", isActive: true },
  { name: "WebGIS", aliases: ["webgis", "gis"], domain: "technical", category: "domain", isActive: true },
  { name: "音视频", aliases: ["音视频", "视频", "audio", "video"], domain: "technical", category: "domain", isActive: true },
  { name: "数据大屏", aliases: ["数据大屏", "大屏开发", "大屏"], domain: "technical", category: "visualization", isActive: true },
  { name: "Three.js", aliases: ["three.js", "threejs", "three"], domain: "technical", category: "visualization", isActive: true },
  { name: "WebGL", aliases: ["webgl"], domain: "technical", category: "visualization", isActive: true },
  { name: "WebGPU", aliases: ["webgpu"], domain: "technical", category: "visualization", isActive: true },
  { name: "需求分析", aliases: ["需求分析", "需求拆解"], domain: "product", category: "capability", isActive: true },
  { name: "PRD", aliases: ["prd", "产品文档"], domain: "product", category: "artifact", isActive: true },
  { name: "用户研究", aliases: ["用户研究", "用户访谈"], domain: "product", category: "capability", isActive: true },
  { name: "数据分析", aliases: ["数据分析", "数据复盘"], domain: "product", category: "capability", isActive: true },
  { name: "项目管理", aliases: ["项目管理", "项目推进"], domain: "product", category: "capability", isActive: true },
  { name: "增长实验", aliases: ["增长实验", "增长测试"], domain: "operations", category: "capability", isActive: true },
  { name: "A/B 测试", aliases: ["a/b 测试", "ab 测试", "a/b test"], domain: "operations", category: "capability", isActive: true },
  { name: "活动策划", aliases: ["活动策划", "活动运营"], domain: "operations", category: "capability", isActive: true },
  { name: "沟通协作", aliases: ["沟通协作", "跨团队协作", "团队合作", "沟通能力"], domain: "technical", category: "soft-skill", isActive: true },
];

export const roleTemplates: RoleTemplateSeed[] = [
  {
    domain: "technical",
    normalizedTitle: "前端开发工程师",
    level: "初级",
    dimensions: ["基础能力", "组件开发", "问题排查", "沟通协作"],
    defaultQuestionThemes: ["基础语法", "页面开发", "联调协作"],
    defaultEvaluationPoints: ["代码基础", "页面实现", "学习能力", "表达清晰度"],
    isActive: true,
  },
  {
    domain: "technical",
    normalizedTitle: "前端开发工程师",
    level: "中级",
    dimensions: ["基础能力", "项目实战", "工程质量", "协作沟通"],
    defaultQuestionThemes: ["复杂页面", "性能优化", "组件设计"],
    defaultEvaluationPoints: ["技术深度", "项目复杂度", "工程思维", "表达与协作"],
    isActive: true,
  },
  {
    domain: "technical",
    normalizedTitle: "前端开发工程师",
    level: "高级",
    dimensions: ["架构设计", "复杂项目", "工程治理", "跨团队影响力"],
    defaultQuestionThemes: ["架构演进", "性能治理", "项目带动"],
    defaultEvaluationPoints: ["架构判断", "复杂问题拆解", "治理能力", "影响力"],
    isActive: true,
  },
  {
    domain: "product",
    normalizedTitle: "产品经理",
    level: "初级",
    dimensions: ["问题理解", "需求拆解", "执行推进", "沟通协作"],
    defaultQuestionThemes: ["需求整理", "基础文档", "跨团队协作"],
    defaultEvaluationPoints: ["需求清晰度", "执行力", "基础数据意识", "表达清晰度"],
    isActive: true,
  },
  {
    domain: "product",
    normalizedTitle: "产品经理",
    level: "中级",
    dimensions: ["问题定义", "方案设计", "数据判断", "协作推进"],
    defaultQuestionThemes: ["需求分析", "方案取舍", "指标设计"],
    defaultEvaluationPoints: ["问题拆解", "方案判断", "数据意识", "推进能力"],
    isActive: true,
  },
  {
    domain: "product",
    normalizedTitle: "产品经理",
    level: "高级",
    dimensions: ["业务判断", "产品策略", "资源协调", "结果负责"],
    defaultQuestionThemes: ["业务决策", "复杂项目推进", "目标管理"],
    defaultEvaluationPoints: ["业务理解", "策略能力", "协调能力", "结果导向"],
    isActive: true,
  },
  {
    domain: "operations",
    normalizedTitle: "运营专员",
    level: "初级",
    dimensions: ["执行落地", "内容整理", "基础复盘", "协同推进"],
    defaultQuestionThemes: ["活动执行", "内容运营", "日常协作"],
    defaultEvaluationPoints: ["执行力", "细节意识", "复盘意识", "沟通能力"],
    isActive: true,
  },
  {
    domain: "operations",
    normalizedTitle: "增长运营",
    level: "中级",
    dimensions: ["增长策略", "执行落地", "数据复盘", "协同推进"],
    defaultQuestionThemes: ["增长实验", "活动复盘", "渠道协作"],
    defaultEvaluationPoints: ["增长判断", "执行质量", "数据复盘", "推进能力"],
    isActive: true,
  },
  {
    domain: "operations",
    normalizedTitle: "增长运营经理",
    level: "高级",
    dimensions: ["增长规划", "渠道策略", "团队协作", "结果负责"],
    defaultQuestionThemes: ["增长规划", "跨团队协作", "策略迭代"],
    defaultEvaluationPoints: ["增长策略", "资源整合", "管理视角", "结果导向"],
    isActive: true,
  },
];

export const roleConfigs: RoleConfigSeed[] = [
  {
    domain: "technical",
    normalizedTitle: "前端开发工程师",
    level: "初级",
    mustHaveSkillIds: ["React", "JavaScript", "沟通协作"],
    niceToHaveSkillIds: ["TypeScript", "Next.js"],
    questionSelectionRules: {
      maxQuestions: 4,
      prioritizeMatchedSkills: true,
      preferredDimensions: ["基础能力", "组件开发", "问题排查"],
    },
    prepPackRules: {
      maxStudyOutlineItems: 4,
      emphasizeMatchedResponsibilities: true,
    },
    isActive: true,
  },
  {
    domain: "technical",
    normalizedTitle: "前端开发工程师",
    level: "中级",
    mustHaveSkillIds: ["React", "TypeScript", "Next.js", "沟通协作"],
    niceToHaveSkillIds: ["SQL", "Node.js"],
    questionSelectionRules: {
      maxQuestions: 4,
      prioritizeMatchedSkills: true,
      preferredDimensions: ["项目实战", "工程质量", "协作沟通"],
    },
    prepPackRules: {
      maxStudyOutlineItems: 4,
      emphasizeMatchedResponsibilities: true,
    },
    isActive: true,
  },
  {
    domain: "technical",
    normalizedTitle: "前端开发工程师",
    level: "高级",
    mustHaveSkillIds: ["React", "TypeScript", "Next.js", "沟通协作"],
    niceToHaveSkillIds: ["Node.js", "SQL"],
    questionSelectionRules: {
      maxQuestions: 4,
      prioritizeMatchedSkills: true,
      preferredDimensions: ["架构设计", "复杂项目", "工程治理"],
    },
    prepPackRules: {
      maxStudyOutlineItems: 4,
      emphasizeMatchedResponsibilities: true,
    },
    isActive: true,
  },
  {
    domain: "product",
    normalizedTitle: "产品经理",
    level: "初级",
    mustHaveSkillIds: ["需求分析", "PRD", "项目管理"],
    niceToHaveSkillIds: ["用户研究", "数据分析"],
    questionSelectionRules: {
      maxQuestions: 4,
      prioritizeMatchedSkills: true,
      preferredDimensions: ["问题理解", "需求拆解", "执行推进"],
    },
    prepPackRules: {
      maxStudyOutlineItems: 4,
      emphasizeMatchedResponsibilities: true,
    },
    isActive: true,
  },
  {
    domain: "product",
    normalizedTitle: "产品经理",
    level: "中级",
    mustHaveSkillIds: ["需求分析", "用户研究", "数据分析", "项目管理"],
    niceToHaveSkillIds: ["PRD"],
    questionSelectionRules: {
      maxQuestions: 4,
      prioritizeMatchedSkills: true,
      preferredDimensions: ["问题定义", "方案设计", "数据判断"],
    },
    prepPackRules: {
      maxStudyOutlineItems: 4,
      emphasizeMatchedResponsibilities: true,
    },
    isActive: true,
  },
  {
    domain: "product",
    normalizedTitle: "产品经理",
    level: "高级",
    mustHaveSkillIds: ["需求分析", "用户研究", "数据分析", "项目管理"],
    niceToHaveSkillIds: ["PRD"],
    questionSelectionRules: {
      maxQuestions: 4,
      prioritizeMatchedSkills: true,
      preferredDimensions: ["业务判断", "产品策略", "结果负责"],
    },
    prepPackRules: {
      maxStudyOutlineItems: 4,
      emphasizeMatchedResponsibilities: true,
    },
    isActive: true,
  },
  {
    domain: "operations",
    normalizedTitle: "运营专员",
    level: "初级",
    mustHaveSkillIds: ["活动策划", "数据分析"],
    niceToHaveSkillIds: ["沟通协作"],
    questionSelectionRules: {
      maxQuestions: 4,
      prioritizeMatchedSkills: true,
      preferredDimensions: ["执行落地", "内容整理", "基础复盘"],
    },
    prepPackRules: {
      maxStudyOutlineItems: 4,
      emphasizeMatchedResponsibilities: true,
    },
    isActive: true,
  },
  {
    domain: "operations",
    normalizedTitle: "增长运营",
    level: "中级",
    mustHaveSkillIds: ["增长实验", "A/B 测试", "数据分析", "活动策划"],
    niceToHaveSkillIds: ["项目管理"],
    questionSelectionRules: {
      maxQuestions: 4,
      prioritizeMatchedSkills: true,
      preferredDimensions: ["增长策略", "执行落地", "数据复盘"],
    },
    prepPackRules: {
      maxStudyOutlineItems: 4,
      emphasizeMatchedResponsibilities: true,
    },
    isActive: true,
  },
  {
    domain: "operations",
    normalizedTitle: "增长运营经理",
    level: "高级",
    mustHaveSkillIds: ["增长实验", "A/B 测试", "数据分析", "项目管理"],
    niceToHaveSkillIds: ["活动策划"],
    questionSelectionRules: {
      maxQuestions: 4,
      prioritizeMatchedSkills: true,
      preferredDimensions: ["增长规划", "渠道策略", "结果负责"],
    },
    prepPackRules: {
      maxStudyOutlineItems: 4,
      emphasizeMatchedResponsibilities: true,
    },
    isActive: true,
  },
];

export const questionBankItems: QuestionBankItemSeed[] = [
  makeQuestion("technical", "前端开发工程师", "初级", "基础能力", "你如何理解 React 组件的 state 和 props 区别？", ["React", "JavaScript"], ["基础概念准确", "表达清晰"], ["举一个你实际写过的组件例子"]),
  makeQuestion("technical", "前端开发工程师", "初级", "组件开发", "介绍一个你独立完成的页面模块，遇到了什么实现问题？", ["React", "JavaScript"], ["页面实现能力", "问题定位"], ["如果重做一遍你会优化什么"]),
  makeQuestion("technical", "前端开发工程师", "初级", "问题排查", "页面样式或交互异常时，你通常怎么排查？", ["JavaScript", "沟通协作"], ["排查路径", "协作意识"], ["有没有一次线上排查经历"]),
  makeQuestion("technical", "前端开发工程师", "初级", "沟通协作", "和后端联调接口时，你会如何确认字段和状态处理？", ["沟通协作"], ["联调方法", "协作效率"], ["如果文档不清楚怎么推进"]),

  makeQuestion("technical", "前端开发工程师", "中级", "项目实战", "请介绍一个你主导过的复杂前端项目，你负责了哪些关键模块？", ["React", "Next.js"], ["项目复杂度", "职责边界", "结果表达"], ["项目里最难的技术问题是什么"]),
  makeQuestion("technical", "前端开发工程师", "中级", "工程质量", "你是如何做性能优化的，具体指标提升了多少？", ["Next.js", "TypeScript"], ["优化思路", "指标意识", "结果量化"], ["如果线上性能回退你会怎么定位"]),
  makeQuestion("technical", "前端开发工程师", "中级", "工程质量", "在 React 组件设计上，你如何平衡复用性和可维护性？", ["React", "TypeScript"], ["组件抽象", "边界判断", "维护成本"], ["能举一个重构组件库的例子吗"]),
  makeQuestion("technical", "前端开发工程师", "中级", "协作沟通", "当产品诉求、研发资源和发布时间冲突时，你如何推进？", ["沟通协作"], ["取舍能力", "沟通策略", "风险意识"], ["你如何同步风险给相关方"]),

  makeQuestion("technical", "前端开发工程师", "高级", "架构设计", "你如何推动前端工程架构演进，而不是只解决单点需求？", ["React", "TypeScript", "Next.js"], ["架构视角", "长期规划", "落地路径"], ["怎么衡量架构演进的收益"]),
  makeQuestion("technical", "前端开发工程师", "高级", "复杂项目", "介绍一个你推动跨团队协作完成的大型项目，最难点是什么？", ["沟通协作"], ["复杂度判断", "协作推进", "结果负责"], ["如果资源不足你怎么拆解目标"]),
  makeQuestion("technical", "前端开发工程师", "高级", "工程治理", "面对多个团队代码质量参差不齐，你会如何建立工程治理机制？", ["TypeScript", "沟通协作"], ["治理策略", "推动能力", "机制设计"], ["哪些指标可以持续跟踪"]),
  makeQuestion("technical", "前端开发工程师", "高级", "跨团队影响力", "你如何影响非直属团队接受你的技术方案？", ["沟通协作"], ["影响力", "利益平衡", "方案说服"], ["有没有失败后调整策略的经历"]),

  makeQuestion("product", "产品经理", "初级", "问题理解", "接到一个模糊需求时，你会先确认哪些信息？", ["需求分析"], ["问题澄清", "信息完整性"], ["你通常会问哪些问题"]),
  makeQuestion("product", "产品经理", "初级", "需求拆解", "你写 PRD 时最关注哪些部分？", ["PRD"], ["文档结构", "表达清晰"], ["研发最容易追问你哪部分"]),
  makeQuestion("product", "产品经理", "初级", "执行推进", "你如何跟进一个需求从评审到上线？", ["项目管理"], ["推进节奏", "协作意识"], ["遇到延期会怎么处理"]),
  makeQuestion("product", "产品经理", "初级", "沟通协作", "当设计和研发理解不一致时，你如何对齐？", ["项目管理"], ["沟通策略", "对齐效率"], ["你会保留哪些决策记录"]),

  makeQuestion("product", "产品经理", "中级", "问题定义", "你如何从模糊业务诉求中拆出清晰的问题定义？", ["需求分析", "用户研究"], ["问题拆解", "场景理解"], ["怎么判断是真问题还是伪需求"]),
  makeQuestion("product", "产品经理", "中级", "方案设计", "介绍一个你推动上线的核心功能，你是如何做方案取舍的？", ["需求分析", "PRD"], ["方案取舍", "约束判断", "结果意识"], ["有没有放弃过一个看起来很好的方案"]),
  makeQuestion("product", "产品经理", "中级", "数据判断", "如果上线后数据没有达到预期，你会怎么分析？", ["数据分析"], ["指标判断", "分析路径", "实验意识"], ["你会优先看哪些指标"]),
  makeQuestion("product", "产品经理", "中级", "协作推进", "当业务方和研发优先级冲突时，你怎么推进？", ["项目管理"], ["协调能力", "优先级判断", "推进能力"], ["如何做向上同步"]),

  makeQuestion("product", "产品经理", "高级", "业务判断", "你如何判断一个新业务方向值不值得投入？", ["数据分析", "用户研究"], ["业务理解", "决策框架", "风险判断"], ["如果信息不完整如何决策"]),
  makeQuestion("product", "产品经理", "高级", "产品策略", "介绍一个你从 0 到 1 推进的复杂产品策略项目。", ["需求分析", "项目管理"], ["策略能力", "拆解能力", "结果导向"], ["最关键的决策节点是什么"]),
  makeQuestion("product", "产品经理", "高级", "资源协调", "资源有限时，你如何决定先做什么后做什么？", ["项目管理"], ["优先级判断", "资源协调", "沟通说服"], ["如何让团队接受这个排序"]),
  makeQuestion("product", "产品经理", "高级", "结果负责", "如果一个重点项目结果失败，你会如何复盘并承担责任？", ["数据分析"], ["结果意识", "复盘质量", "责任感"], ["你会如何修正下一轮策略"]),

  makeQuestion("operations", "运营专员", "初级", "执行落地", "介绍一次你参与执行的活动，你负责了哪些部分？", ["活动策划"], ["执行细节", "责任边界"], ["执行中最容易出错的点是什么"]),
  makeQuestion("operations", "运营专员", "初级", "内容整理", "你如何保证运营内容上线前不出错？", ["活动策划"], ["细节意识", "检查机制"], ["你会怎么做 checklist"]),
  makeQuestion("operations", "运营专员", "初级", "基础复盘", "活动结束后你通常如何做基础复盘？", ["数据分析"], ["复盘结构", "数据意识"], ["你会沉淀哪些经验"]),
  makeQuestion("operations", "运营专员", "初级", "协同推进", "和设计、产品协作推进活动时，你怎么保证节奏？", ["活动策划"], ["协作能力", "推进意识"], ["如果对方延迟如何处理"]),

  makeQuestion("operations", "增长运营", "中级", "增长策略", "介绍一次你负责的增长实验，目标、动作和结果分别是什么？", ["增长实验", "A/B 测试"], ["增长思路", "实验设计", "结果表达"], ["实验失败时你如何定位原因"]),
  makeQuestion("operations", "增长运营", "中级", "执行落地", "如果活动效果不达预期，你会如何快速定位问题？", ["数据分析", "活动策划"], ["定位能力", "执行判断", "复盘速度"], ["你会先看用户路径的哪一段"]),
  makeQuestion("operations", "增长运营", "中级", "数据复盘", "你如何判断一轮增长实验是否值得继续追加资源？", ["增长实验", "数据分析"], ["指标判断", "资源意识", "策略判断"], ["如何避免只看表面指标"]),
  makeQuestion("operations", "增长运营", "中级", "协同推进", "你如何与产品和设计协作推进运营方案落地？", ["活动策划", "项目管理"], ["协作推进", "方案拆解", "结果负责"], ["当目标冲突时你怎么协调"]),

  makeQuestion("operations", "增长运营经理", "高级", "增长规划", "你如何制定季度增长规划，而不是只堆叠短期活动？", ["增长实验", "数据分析"], ["规划能力", "目标拆解", "长期视角"], ["如何平衡短期和长期目标"]),
  makeQuestion("operations", "增长运营经理", "高级", "渠道策略", "当多个渠道 ROI 波动明显时，你如何重新分配资源？", ["数据分析"], ["渠道判断", "资源配置", "结果意识"], ["会设置哪些决策阈值"]),
  makeQuestion("operations", "增长运营经理", "高级", "团队协作", "你如何带动跨团队一起为增长目标负责？", ["项目管理"], ["协作机制", "影响力", "目标统一"], ["如何处理目标不一致的团队"]),
  makeQuestion("operations", "增长运营经理", "高级", "结果负责", "如果季度增长目标没有达成，你会如何向管理层复盘？", ["数据分析", "项目管理"], ["结果负责", "结构化复盘", "修正方案"], ["下一季度你会优先调整哪里"]),
];

export const mockJobDescriptions: MockJobDescriptionSeed[] = [
  ...makeMockJobDescriptions("technical", "前端开发工程师", "初级", [
    {
      label: "jr-frontend-react-admin",
      rawJD: "负责中后台系统前端页面开发与联调，要求熟悉 React、JavaScript，能完成基础组件封装，并与后端协作推动需求上线。",
    },
    {
      label: "jr-frontend-growth-page",
      rawJD: "参与营销活动页和日常运营页面开发，要求掌握 HTML、CSS、JavaScript，了解 React，具备基础的问题排查和沟通协作能力。",
    },
    {
      label: "jr-frontend-dashboard",
      rawJD: "支持数据看板和业务平台的前端开发，完成页面搭建、接口联调和样式调整，要求具备 React 项目经验与良好的学习能力。",
    },
  ]),
  ...makeMockJobDescriptions("technical", "前端开发工程师", "中级", [
    {
      label: "mid-frontend-next-platform",
      rawJD: "负责企业级 Web 应用开发，使用 React、TypeScript、Next.js 构建复杂页面与组件，关注性能优化和跨团队协作。",
    },
    {
      label: "mid-frontend-component-system",
      rawJD: "主导业务组件库建设和复杂业务模块开发，要求熟悉 React、TypeScript、组件设计、性能优化，并能推动跨团队协作。",
    },
    {
      label: "mid-frontend-user-growth",
      rawJD: "负责用户增长相关前端项目，要求具备 React、Next.js、TypeScript 经验，有复杂项目拆解、性能优化与沟通推进能力。",
    },
  ]),
  ...makeMockJobDescriptions("technical", "前端开发工程师", "高级", [
    {
      label: "sr-frontend-architecture",
      rawJD: "负责前端架构演进与工程治理，推动大型项目落地，要求精通 React、TypeScript、Next.js，具备复杂项目经验和跨团队影响力。",
    },
    {
      label: "sr-frontend-platform",
      rawJD: "作为高级前端工程师负责中台架构升级、性能治理和团队协作机制建设，需要有架构设计和工程治理经验。",
    },
    {
      label: "sr-frontend-global-product",
      rawJD: "主导跨业务线前端技术方案，推动性能优化、组件体系与研发协作流程升级，要求具备较强的技术判断和影响力。",
    },
  ]),
  ...makeMockJobDescriptions("product", "产品经理", "初级", [
    {
      label: "jr-pm-saas-feature",
      rawJD: "协助产品经理完成需求分析、PRD 撰写和项目推进，参与基础数据复盘，推动功能从评审到上线。",
    },
    {
      label: "jr-pm-user-tool",
      rawJD: "负责内部工具产品的需求整理和文档输出，需具备基础需求拆解能力、沟通协作能力和项目管理意识。",
    },
    {
      label: "jr-pm-growth-support",
      rawJD: "支持增长团队的产品需求落地，负责 PRD、需求跟踪和上线验收，要求对用户反馈和数据分析有基础理解。",
    },
  ]),
  ...makeMockJobDescriptions("product", "产品经理", "中级", [
    {
      label: "mid-pm-user-growth",
      rawJD: "负责核心增长产品模块，独立完成需求分析、用户研究、方案设计和数据复盘，推动跨团队协作落地。",
    },
    {
      label: "mid-pm-b2b-workflow",
      rawJD: "负责 B 端工作流产品，要求具备问题定义、方案取舍、指标设计和项目推进能力，有完整产品项目经验。",
    },
    {
      label: "mid-pm-content-platform",
      rawJD: "主导内容平台功能优化，要求有需求拆解、PRD 输出、数据分析和协作推进经验，能对结果负责。",
    },
  ]),
  ...makeMockJobDescriptions("product", "产品经理", "高级", [
    {
      label: "sr-pm-strategy",
      rawJD: "负责业务核心方向的产品策略制定与复杂项目推进，需要具备业务判断、资源协调、数据分析和结果负责能力。",
    },
    {
      label: "sr-pm-platform",
      rawJD: "主导平台型产品规划和跨团队资源协调，要求能够从业务目标出发设计产品策略，推进重点项目落地。",
    },
    {
      label: "sr-pm-new-business",
      rawJD: "面向新业务方向制定产品路线图，开展用户研究、需求定义和复杂项目管理，对业务增长结果负责。",
    },
  ]),
  ...makeMockJobDescriptions("operations", "运营专员", "初级", [
    {
      label: "jr-ops-activity",
      rawJD: "负责活动执行、内容整理和跨团队协作，完成活动上线、物料跟进和基础数据复盘，要求细致和执行力强。",
    },
    {
      label: "jr-ops-community",
      rawJD: "支持社群与内容运营，负责排期执行、文案整理、活动跟进和基础数据统计，要求良好的沟通协作能力。",
    },
    {
      label: "jr-ops-campaign",
      rawJD: "协助运营团队执行线上活动，跟进设计、产品和开发节奏，活动结束后完成基础效果复盘与问题记录。",
    },
  ]),
  ...makeMockJobDescriptions("operations", "增长运营", "中级", [
    {
      label: "mid-growth-ops-user-acquisition",
      rawJD: "负责用户增长实验与活动复盘，要求具备增长实验、A/B 测试、数据分析和跨团队推进能力。",
    },
    {
      label: "mid-growth-ops-retention",
      rawJD: "围绕用户留存开展增长活动设计与执行，分析活动效果并推动产品、设计协同落地，要求较强的数据复盘能力。",
    },
    {
      label: "mid-growth-ops-campaign-strategy",
      rawJD: "主导重点增长活动，从目标拆解、方案执行到数据复盘全链路负责，要求熟悉增长实验和活动策划。",
    },
  ]),
  ...makeMockJobDescriptions("operations", "增长运营经理", "高级", [
    {
      label: "sr-growth-ops-manager",
      rawJD: "负责季度增长规划与渠道策略制定，协调多团队完成增长目标，对结果负责，要求具备数据分析和管理视角。",
    },
    {
      label: "sr-growth-ops-channel",
      rawJD: "主导多渠道增长策略迭代和资源分配，推动增长实验、数据复盘和跨部门协作机制升级，负责最终增长结果。",
    },
    {
      label: "sr-growth-ops-business",
      rawJD: "负责重点业务线增长目标，制定增长策略和团队协作机制，通过数据分析持续优化渠道和活动效果。",
    },
  ]),
];
