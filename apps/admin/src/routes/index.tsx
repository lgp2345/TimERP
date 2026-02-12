import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Building2,
  ChartNoAxesCombined,
  CircleGauge,
  Factory,
  FolderTree,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useMemo } from "react";
import {
  SidebarLayout,
  type SidebarNavItem,
} from "@/components/layout/SidebarLayout";

export const Route = createFileRoute("/")({
  component: HomeV3,
});

/**
 * Returns extension nav items for SidebarContent.
 * Placeholder for future API-driven sidebar extension.
 */
const getSidebarExtensionItems = (): SidebarNavItem[] => [];

/**
 * Home route page with shadcn-style sidebar layout.
 */
function HomeV3() {
  const extensionItems = useMemo(() => getSidebarExtensionItems(), []);
  const sidebarGroups = useMemo<SidebarNavItem[]>(
    () => [
      {
        key: "core",
        label: "核心导航",
        children: [
          {
            key: "dashboard",
            label: "总览看板",
            icon: LayoutDashboard,
            path: "/",
          },
          {
            key: "operation",
            label: "运营中心",
            icon: Activity,
            children: [
              {
                key: "operation-live",
                label: "实时监控",
                icon: CircleGauge,
                disabled: true,
              },
              {
                key: "operation-workflow",
                label: "流程编排",
                icon: FolderTree,
                disabled: true,
              },
            ],
          },
          { key: "factory", label: "制造中心", icon: Factory, disabled: true },
        ],
      },
      {
        key: "manage",
        label: "系统管理",
        children: [
          {
            key: "permission",
            label: "权限管理",
            icon: ShieldCheck,
            disabled: true,
          },
          { key: "account", label: "账号中心", icon: UserCog, disabled: true },
          { key: "setting", label: "系统设置", icon: Settings, disabled: true },
        ],
      },
      {
        key: "extension",
        label: "扩展模块",
        children:
          extensionItems.length > 0
            ? extensionItems
            : [
                {
                  key: "extension-placeholder",
                  label: "SidebarContent 扩展接口预留中",
                  icon: FolderTree,
                  disabled: true,
                },
              ],
      },
    ],
    [extensionItems]
  );

  return (
    <SidebarLayout groups={sidebarGroups}>
      <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-xs">订单流转效率</p>
          <p className="mt-2 font-semibold text-2xl">+42%</p>
        </article>
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-xs">库存准确率</p>
          <p className="mt-2 font-semibold text-2xl">99.6%</p>
        </article>
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-xs">现金预测偏差</p>
          <p className="mt-2 font-semibold text-2xl">2.1%</p>
        </article>
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-xs">异常响应时间</p>
          <p className="mt-2 font-semibold text-2xl">1.2 秒</p>
        </article>
      </div>

      <div className="grid gap-4 px-5 pb-5 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="font-medium text-sm">业务趋势</p>
          <div className="mt-3 flex h-44 items-center justify-center rounded-lg border border-dashed">
            <ChartNoAxesCombined className="h-8 w-8 text-muted-foreground" />
          </div>
        </article>
        <article className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="font-medium text-sm">角色入口</p>
          <div className="mt-3 space-y-2">
            <button
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-accent"
              type="button"
            >
              <Building2 className="h-4 w-4" />
              总经理视角
            </button>
            <button
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-accent"
              type="button"
            >
              <Settings className="h-4 w-4" />
              财务视角
            </button>
            <button
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-accent"
              type="button"
            >
              <ShieldCheck className="h-4 w-4" />
              风控视角
            </button>
          </div>
        </article>
      </div>
    </SidebarLayout>
  );
}
