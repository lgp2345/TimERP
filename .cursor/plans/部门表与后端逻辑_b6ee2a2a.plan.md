---
name: 部门表与后端逻辑
overview: 新增树形部门模型与成员多部门关联，落地后端完整能力：部门 CRUD、树查询、成员入/出部门、负责人设置，并接入现有鉴权与 schema 规范。
todos:
  - id: department-schema
    content: 新增 departments 与 membership_departments 的 Drizzle schema，并更新 schema 导出
    status: completed
  - id: department-migration
    content: 生成并检查 SQL 迁移，确保外键与索引正确
    status: completed
  - id: department-zod
    content: 在 packages/schema 新增 department Zod schema 与类型导出
    status: completed
  - id: department-module
    content: 实现 DepartmentModule 的 controller/service（CRUD、树查询、成员关联、负责人设置）并注册到 AppModule
    status: completed
  - id: department-permissions
    content: 补齐部门权限码与 bootstrap 初始化逻辑
    status: completed
  - id: department-verify
    content: 运行 build/lint 并验证关键接口链路
    status: completed
isProject: false
---

# 部门表与后端逻辑实施计划

## 目标

- 新增 `departments`（树形）与 `membership_departments`（成员多部门）两张表。
- 完成后端接口：部门 CRUD、部门树查询、成员入/出部门、负责人设置。
- 复用现有 NestJS + Drizzle + Zod + RBAC 模式。

## 数据模型设计

- 在 `[/Users/liuguoping/code/TimERP/apps/server/src/database/schema/departments.schema.ts](/Users/liuguoping/code/TimERP/apps/server/src/database/schema/departments.schema.ts)` 新增 `departments`：
  - `id`
  - `companyId` -> FK `[companies.id]( /Users/liuguoping/code/TimERP/apps/server/src/database/schema/companies.schema.ts )`（cascade）
  - `parentId` -> 自引用 `departments.id`（set null）
  - `code`（公司内唯一）
  - `name`
  - `managerMembershipId` -> FK `memberships.id`（set null）
  - `status`（默认 `active`）
  - `createdAt` / `updatedAt`
  - 索引：`departments_company_code_unique`、`departments_company_status_idx`、`departments_parent_idx`
- 在 `[/Users/liuguoping/code/TimERP/apps/server/src/database/schema/membership-departments.schema.ts](/Users/liuguoping/code/TimERP/apps/server/src/database/schema/membership-departments.schema.ts)` 新增关联表：
  - `membershipId` -> FK `memberships.id`（cascade）
  - `departmentId` -> FK `departments.id`（cascade）
  - `isPrimary`（默认 `false`）
  - `createdAt` / `updatedAt`
  - 索引：`membership_departments_unique`、`membership_departments_membership_idx`、`membership_departments_department_idx`
- 在 `[/Users/liuguoping/code/TimERP/apps/server/src/database/schema/index.ts](/Users/liuguoping/code/TimERP/apps/server/src/database/schema/index.ts)` 导出新表。

## 迁移与一致性

- 通过 Drizzle 生成迁移（`apps/server/drizzle/*.sql`），确保与 schema 一致。
- 增加关键约束校验逻辑（在 service 层实现）：
  - `department.companyId` 与 `membership.companyId` 必须一致。
  - `managerMembershipId` 必须属于同公司。
  - `parentId` 不允许跨公司；更新父级时防循环。

## 共享 Schema（Zod）

- 在 `[/Users/liuguoping/code/TimERP/packages/schema/src/department.ts](/Users/liuguoping/code/TimERP/packages/schema/src/department.ts)` 新增请求/响应 schema 与 type：
  - `createDepartmentRequestSchema`
  - `updateDepartmentRequestSchema`
  - `listDepartmentsRequestSchema`
  - `assignMembershipDepartmentRequestSchema`
  - `setPrimaryDepartmentRequestSchema`
  - `setDepartmentManagerRequestSchema`
- 在 `[/Users/liuguoping/code/TimERP/packages/schema/index.ts](/Users/liuguoping/code/TimERP/packages/schema/index.ts)` 导出以上 schema/type。

## 业务模块实现（NestJS）

- 新增模块目录 `[/Users/liuguoping/code/TimERP/apps/server/src/modules/department](/Users/liuguoping/code/TimERP/apps/server/src/modules/department)`：
  - `department.module.ts`
  - `department.service.ts`
  - `department.controller.ts`
- 在 `[/Users/liuguoping/code/TimERP/apps/server/src/app.module.ts](/Users/liuguoping/code/TimERP/apps/server/src/app.module.ts)` 注册 `DepartmentModule`。
- Controller 路由（均按当前风格接 `AuthGuard + PermissionsGuard`）：
  - `GET /department/tree`
  - `GET /department`
  - `POST /department`
  - `PATCH /department/:id`
  - `DELETE /department/:id`
  - `POST /department/:id/memberships`
  - `DELETE /department/:id/memberships/:membershipId`
  - `PATCH /department/:id/manager`
  - `PATCH /memberships/:membershipId/primary-department`
- Service 关键逻辑：
  - 以 `currentUser.companyId` 为租户边界。
  - 删除部门前处理：清空子部门 `parentId` 或阻止删除（按稳定性优先采用“阻止有子部门时删除”）。
  - 主部门规则：同一成员仅一个 `isPrimary=true`（事务内切换）。

## 权限与初始化

- 新增权限码并接入 RBAC 使用：
  - `department.read`
  - `department.create`
  - `department.update`
  - `department.delete`
  - `department.member.manage`
- 在 `[/Users/liuguoping/code/TimERP/apps/server/src/modules/system-bootstrap/system-bootstrap.service.ts](/Users/liuguoping/code/TimERP/apps/server/src/modules/system-bootstrap/system-bootstrap.service.ts)` 补齐权限初始化（至少确保 owner 角色具备以上权限）。

## 验证

- 构建与类型检查：`packages/schema`、`apps/server`。
- 读取并修复新增文件 lint 问题。
- 手动验证最小链路：
  - 创建部门 -> 建树 -> 指定负责人 -> 成员加入部门 -> 设置主部门 -> 查询树结果正确。

