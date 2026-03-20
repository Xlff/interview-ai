# Interview AI

面向 C 端求职者的 AI 面试准备 Web 服务。

当前 MVP 支持：
- 粘贴 `JD`
- 生成岗位准备包
- 开始 `10 分钟文字面试`
- 生成复盘报告与复习提纲
- 基于短板再次发起强化面试
- 登录后查看历史记录

## Tech Stack

- `Next.js 16.1`
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `Prisma 7`
- `Supabase Auth + Postgres`
- `Vitest + Playwright`

## Product Flow

当前主链路：

1. 首页输入 JD
2. 系统解析岗位、级别、关键技能、职责
3. 生成准备包
4. 开始文字面试
5. 输出复盘报告
6. 基于弱项继续强化练习

当前页面：
- `/`
- `/prep/[jobTargetId]`
- `/interview/[sessionId]`
- `/review/[sessionId]`
- `/history`
- `/login`

## Local Development

### 1. Install

```bash
pnpm install
```

### 2. Prepare environment variables

复制一份环境变量文件：

```bash
cp .env.example .env
```

本地开发建议使用本地 Supabase。

常见本地配置：

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-local-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-local-service-role-key"
```

如果你使用线上 Supabase，把这 3 个值替换成真实项目配置：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

注意：
- `.env` 文件里保留引号没有问题
- 但在 `Vercel` 环境变量面板里粘贴值时，不要把外层引号一起贴进去
- 例如应填 `postgresql://...`，不要填 `"postgresql://..."`
- 如果数据库密码里包含 `#`、空格、引号等保留字符，连接串里必须做 URL 编码
- 例如密码 `pa#ss word` 应写成 `pa%23ss%20word`

如果你启用了多模型切换，还需要补充：
- `LLM_PROVIDER_IDS`
- `LLM_DEFAULT_PROVIDER`
- 对应 provider 的 `BASE_URL / API_KEY / DEFAULT_MODEL / MODELS`

### 3. Start local services

如果你使用本地 Supabase：

```bash
pnpm exec supabase start
pnpm db:generate
pnpm exec prisma migrate deploy
```

### 4. Run the app

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
```

打开：

- [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
pnpm db:generate
pnpm db:validate
```

## Project Structure

项目采用按 feature 拆分的结构：

```text
src/
  app/
    (app)/
    api/
    auth/
  components/
  features/
    content/
    history/
    interview/
    job-target/
    prep-pack/
    review/
  lib/
  server/
    repositories/
    seeds/
    services/
prisma/
tests/e2e/
```

说明：
- `features/*` 放页面模型、视图和交互逻辑
- `server/services/*` 放 JD 解析、面试编排、评估和复盘逻辑
- `server/repositories/*` 放数据库访问
- `server/seeds/*` 放技能词典、岗位模板、题库和 mock JD

## Content Layer

当前内容层分 3 层：

1. `共享词典 / 岗位模板`
2. `数据库题库 / 岗位配置`
3. `LLM provider`

当前已经支持：
- 技术岗 / 产品岗 / 运营岗
- 数据库驱动题库
- 27 条 mock JD
- OpenAI 兼容 provider 切换

## Testing

执行完整验证：

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

当前 e2e 覆盖：
- 首页到准备包
- 准备包到文字面试
- 文字面试到复盘
- 弱项强化重练
- 匿名用户访问历史页

## Current Status

当前仓库适合：
- 本地开发
- 小范围 beta 测试
- 继续补充内容质量和增长能力

当前未做的能力：
- 语音面试
- 简历上传解析
- 内容运营后台
- 商业化收费体系
