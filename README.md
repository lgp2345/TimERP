## TimERP Monorepo

基于 Turborepo 的物流批发 ERP 系统，前后端统一使用 TypeScript，配合 Biome 做格式化和静态检查。

### 技术栈概览

- **Monorepo & 工程化**: pnpm workspace + Turborepo + Biome
- **前端 (`apps/admin`)**:
  - React + TypeScript + Vite
  - Tailwind CSS + shadcn 风格（自定义 theme）
  - React Router
  - Zustand（全局状态）
  - TanStack Query（数据请求与缓存）
- **后端 (`apps/api`)**:
  - NestJS (TypeScript)
  - Drizzle ORM + PostgreSQL
  - Zod（后续用于 DTO/校验）

### 目录结构

- `apps/admin`: 管理后台前端应用
- `apps/api`: 后端 API 服务（NestJS）
- `packages/*`: 预留的共享包（domain 类型、UI 组件、utils 等）
- `turbo.json`: Turborepo pipeline 配置
- `biome.json`: Biome 配置（格式化 + Lint）
- `tsconfig.base.json`: 前后端共享 TS 编译基础配置

### 安装与启动

1. **安装依赖**

```bash
pnpm install
```

2. **开发模式（同时启动前后端）**

```bash
pnpm dev
```

3. **单独运行前端 admin**

```bash
cd apps/admin
pnpm dev
```

4. **单独运行后端 api**

```bash
cd apps/api
pnpm dev
```

> 提示：根目录的 `pnpm-workspace.yaml` 已配置 `apps/*` 为 workspace，建议始终在根目录执行 `pnpm install`。

### 环境变量

- 后端使用 Drizzle + PostgreSQL，需在根目录或 `apps/api` 下配置 `DATABASE_URL`：

```bash
DATABASE_URL=postgres://user:password@localhost:5432/timmerp
```

后续会增加基于 Zod 的 env 校验和更多服务配置。


