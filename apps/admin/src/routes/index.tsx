import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CircuitBoard,
  Factory,
  Handshake,
  Layers,
  Radar,
  ShieldCheck,
  Truck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-[#0A1221] text-[#F8FAFC]">
      <div className="pointer-events-none fixed inset-0 opacity-35">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute -top-48 right-[-120px] h-[460px] w-[460px] rounded-full bg-[#22C55E]/12 blur-[120px]" />
        <div className="absolute bottom-[-160px] left-[-80px] h-[420px] w-[420px] rounded-full bg-[#334155]/40 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-6 pb-14 md:px-8 lg:px-10">
        <nav className="sticky top-4 z-20 mb-12 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0F172A]/80 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]/20">
              <CircuitBoard className="h-5 w-5 text-[#22C55E]" />
            </div>
            <div>
              <p className="font-semibold text-base tracking-wide">TimERP</p>
              <p className="text-[#94A3B8] text-xs">Enterprise Control Core</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer rounded-lg border border-white/20 px-4 py-2 font-medium text-sm text-white transition-colors duration-200 hover:border-[#22C55E]/60 hover:text-[#22C55E]"
              type="button"
            >
              Contact Sales
            </button>
            <Link
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#22C55E] px-4 py-2 font-semibold text-[#0F172A] text-sm transition-colors duration-200 hover:bg-[#16A34A]"
              to="/login"
            >
              Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>

        <main className="space-y-16">
          <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-[#0F172A]/80 p-7 md:p-10">
              <p className="mb-4 inline-flex items-center rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 font-medium text-[#86EFAC] text-xs">
                AI Ops Layer Enabled
              </p>
              <h1 className="max-w-2xl font-semibold text-4xl leading-tight md:text-5xl">
                你的企业数据流
                <span className="block text-[#22C55E]">集中在一块屏</span>
              </h1>
              <p className="mt-5 max-w-xl text-[#CBD5E1] text-lg leading-relaxed">
                采购、库存、财务、销售。实时联动。异常秒级可见。
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[#94A3B8] text-xs">订单执行效率</p>
                  <p className="mt-2 font-semibold text-2xl text-[#86EFAC]">+38%</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[#94A3B8] text-xs">库存周转天数</p>
                  <p className="mt-2 font-semibold text-2xl">21 天</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[#94A3B8] text-xs">风控预警响应</p>
                  <p className="mt-2 font-semibold text-2xl">1.6 秒</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <article className="rounded-3xl border border-white/10 bg-[#111B2E]/85 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-medium text-sm text-[#93C5FD]">实时业务雷达</p>
                  <Radar className="h-4 w-4 text-[#22C55E]" />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                    <span className="text-[#CBD5E1]">华东仓入库延迟</span>
                    <span className="font-medium text-[#86EFAC]">已恢复</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                    <span className="text-[#CBD5E1]">大客户回款预测</span>
                    <span className="font-medium text-[#86EFAC]">高可信</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                    <span className="text-[#CBD5E1]">成本异常波动</span>
                    <span className="font-medium text-[#FACC15]">已提醒</span>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-[#111B2E]/85 p-6">
                <p className="mb-4 font-medium text-[#93C5FD] text-sm">合规与安全</p>
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-4">
                  <ShieldCheck className="h-5 w-5 text-[#22C55E]" />
                  <p className="text-sm">权限闭环、审计留痕、策略加密。</p>
                </div>
              </article>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.15fr_1.55fr]">
            <div className="rounded-3xl border border-white/10 bg-[#0F172A]/75 p-7">
              <h2 className="font-semibold text-2xl">行业适配引擎</h2>
              <p className="mt-2 text-[#94A3B8] text-sm">
                按行业切换流程模板，字段与审批规则自动重组。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="cursor-pointer rounded-full border border-[#22C55E]/40 bg-[#22C55E]/15 px-4 py-2 text-sm transition-colors duration-200 hover:bg-[#22C55E]/25"
                  type="button"
                >
                  制造
                </button>
                <button
                  className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm transition-colors duration-200 hover:border-[#22C55E]/60 hover:text-[#86EFAC]"
                  type="button"
                >
                  分销
                </button>
                <button
                  className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm transition-colors duration-200 hover:border-[#22C55E]/60 hover:text-[#86EFAC]"
                  type="button"
                >
                  零售
                </button>
                <button
                  className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm transition-colors duration-200 hover:border-[#22C55E]/60 hover:text-[#86EFAC]"
                  type="button"
                >
                  工程
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-200 hover:border-[#22C55E]/60 hover:bg-white/[0.05]">
                <Factory className="mb-4 h-5 w-5 text-[#22C55E]" />
                <h3 className="font-semibold">生产排程联动</h3>
                <p className="mt-2 text-[#94A3B8] text-sm">
                  工单、物料、设备状态同步刷新。
                </p>
              </article>
              <article className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-200 hover:border-[#22C55E]/60 hover:bg-white/[0.05]">
                <Truck className="mb-4 h-5 w-5 text-[#22C55E]" />
                <h3 className="font-semibold">物流预测调度</h3>
                <p className="mt-2 text-[#94A3B8] text-sm">
                  路线成本和时效动态平衡。
                </p>
              </article>
              <article className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-200 hover:border-[#22C55E]/60 hover:bg-white/[0.05]">
                <Banknote className="mb-4 h-5 w-5 text-[#22C55E]" />
                <h3 className="font-semibold">资金流可视化</h3>
                <p className="mt-2 text-[#94A3B8] text-sm">
                  现金预测和风险敞口同屏展示。
                </p>
              </article>
              <article className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-200 hover:border-[#22C55E]/60 hover:bg-white/[0.05]">
                <Layers className="mb-4 h-5 w-5 text-[#22C55E]" />
                <h3 className="font-semibold">跨系统协同层</h3>
                <p className="mt-2 text-[#94A3B8] text-sm">
                  API、消息流、审批流统一编排。
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-[#0F172A]/75 p-7">
              <h2 className="font-semibold text-2xl">角色驾驶舱</h2>
              <p className="mt-2 text-[#94A3B8] text-sm">
                每个岗位都看关键指标，不看冗余噪音。
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <Building2 className="mb-3 h-5 w-5 text-[#22C55E]" />
                  <p className="font-medium text-sm">总经理视角</p>
                  <p className="mt-2 text-[#94A3B8] text-xs">利润、增长、风险</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <BriefcaseBusiness className="mb-3 h-5 w-5 text-[#22C55E]" />
                  <p className="font-medium text-sm">财务视角</p>
                  <p className="mt-2 text-[#94A3B8] text-xs">现金、应收、成本</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <Handshake className="mb-3 h-5 w-5 text-[#22C55E]" />
                  <p className="font-medium text-sm">销售视角</p>
                  <p className="mt-2 text-[#94A3B8] text-xs">线索、签约、回款</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#1E293B]/80 to-[#0F172A] p-7">
              <p className="text-[#86EFAC] text-xs">Trusted by Teams</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                  Horizon Industrial
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                  Northline Distribution
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                  CoreBuild Engineering
                </div>
              </div>
              <Link
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2 font-semibold text-[#0F172A] text-sm transition-colors duration-200 hover:bg-[#16A34A]"
                to="/login"
              >
                进入系统
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
