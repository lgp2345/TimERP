import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Blocks,
  ChartNoAxesCombined,
  CircleAlert,
  CloudCog,
  Cpu,
  Database,
  Factory,
  Fingerprint,
  ShieldCheck,
  Truck,
} from "lucide-react";

export const Route = createFileRoute("/index2")({
  component: HomeV2,
});

function HomeV2() {
  return (
    <div className="min-h-screen bg-[#020617] text-[#E2E8F0]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.32) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute top-[-220px] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#22C55E]/12 blur-[160px]" />
        <div className="absolute right-[-160px] bottom-[-220px] h-[520px] w-[520px] rounded-full bg-[#0369A1]/22 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-5 pt-6 pb-16 md:px-8 lg:px-10">
        <header className="mb-10 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B1326]/75 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#22C55E]/35 bg-[#22C55E]/10">
              <Cpu className="h-5 w-5 text-[#4ADE80]" />
            </div>
            <div>
              <p className="font-semibold text-base tracking-wide">TimERP Nova</p>
              <p className="text-[#94A3B8] text-xs">Enterprise Command Grid</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer rounded-lg border border-white/20 px-4 py-2 font-medium text-sm transition-colors duration-200 hover:border-[#38BDF8] hover:text-[#7DD3FC]"
              type="button"
            >
              Book Demo
            </button>
            <Link
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#22C55E] px-4 py-2 font-semibold text-[#052E16] text-sm transition-colors duration-200 hover:bg-[#4ADE80]"
              to="/login"
            >
              Start Console
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <main className="space-y-8">
          <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <article className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0B1020] p-7 md:p-10">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#38BDF8]/50 bg-[#0EA5E9]/15 px-3 py-1 font-medium text-[#7DD3FC] text-xs">
                  Live Scenario Matrix
                </span>
                <span className="rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-1 font-medium text-[#86EFAC] text-xs">
                  99.99% Core Uptime
                </span>
              </div>

              <h1 className="max-w-3xl font-semibold text-4xl leading-tight md:text-[58px] md:leading-[1.05]">
                一屏接管全链路
                <span className="block text-[#7DD3FC]">让延迟先报警</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[#CBD5E1] text-lg">
                采购、仓储、履约、结算。四条线同频刷新。
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_1fr_1fr]">
                <div className="rounded-2xl border border-[#38BDF8]/25 bg-[#0C1C33]/65 p-5">
                  <p className="text-[#94A3B8] text-xs">实时吞吐</p>
                  <p className="mt-2 font-semibold text-3xl text-[#7DD3FC]">
                    12.8K/s
                  </p>
                  <p className="mt-2 text-[#93C5FD] text-xs">峰值自扩缩</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[#94A3B8] text-xs">异常识别</p>
                  <p className="mt-2 font-semibold text-3xl text-[#86EFAC]">
                    0.9 秒
                  </p>
                  <p className="mt-2 text-[#A7F3D0] text-xs">自动派单</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[#94A3B8] text-xs">库存准确率</p>
                  <p className="mt-2 font-semibold text-3xl">99.6%</p>
                  <p className="mt-2 text-[#CBD5E1] text-xs">多仓同步</p>
                </div>
              </div>
            </article>

            <div className="grid gap-4">
              <article className="rounded-3xl border border-[#22C55E]/25 bg-[#052E16]/40 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium text-sm text-[#86EFAC]">预警中心</p>
                  <CircleAlert className="h-4 w-4 text-[#FACC15]" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2">
                    <span>南区断货风险</span>
                    <span className="text-[#FDE68A]">3h 内</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2">
                    <span>运输时延抬升</span>
                    <span className="text-[#86EFAC]">已转派</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2">
                    <span>回款偏离阈值</span>
                    <span className="text-[#7DD3FC]">复核中</span>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-[#0B1326]/80 p-5">
                <p className="mb-3 font-medium text-[#93C5FD] text-sm">安全基线</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] p-3">
                    <Fingerprint className="h-4 w-4 text-[#38BDF8]" />
                    <span>多因子策略生效</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] p-3">
                    <ShieldCheck className="h-4 w-4 text-[#22C55E]" />
                    <span>审计链持续写入</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr_1fr]">
            <article className="rounded-3xl border border-white/10 bg-[#0A1427]/75 p-6">
              <p className="font-medium text-[#93C5FD] text-sm">行业运行模板</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  className="cursor-pointer rounded-xl border border-[#38BDF8]/30 bg-[#0C1C33]/50 px-4 py-3 text-left transition-colors duration-200 hover:bg-[#0C1C33]"
                  type="button"
                >
                  <Factory className="mb-2 h-4 w-4 text-[#7DD3FC]" />
                  <p className="font-medium text-sm">离散制造</p>
                  <p className="mt-1 text-[#94A3B8] text-xs">工单追溯闭环</p>
                </button>
                <button
                  className="cursor-pointer rounded-xl border border-white/15 bg-white/[0.02] px-4 py-3 text-left transition-colors duration-200 hover:border-[#22C55E]/40 hover:bg-white/[0.04]"
                  type="button"
                >
                  <Truck className="mb-2 h-4 w-4 text-[#86EFAC]" />
                  <p className="font-medium text-sm">供应分销</p>
                  <p className="mt-1 text-[#94A3B8] text-xs">全链路追踪</p>
                </button>
                <button
                  className="cursor-pointer rounded-xl border border-white/15 bg-white/[0.02] px-4 py-3 text-left transition-colors duration-200 hover:border-[#22C55E]/40 hover:bg-white/[0.04]"
                  type="button"
                >
                  <CloudCog className="mb-2 h-4 w-4 text-[#86EFAC]" />
                  <p className="font-medium text-sm">项目工程</p>
                  <p className="mt-1 text-[#94A3B8] text-xs">预算实时校准</p>
                </button>
                <button
                  className="cursor-pointer rounded-xl border border-white/15 bg-white/[0.02] px-4 py-3 text-left transition-colors duration-200 hover:border-[#22C55E]/40 hover:bg-white/[0.04]"
                  type="button"
                >
                  <Database className="mb-2 h-4 w-4 text-[#86EFAC]" />
                  <p className="font-medium text-sm">零售连锁</p>
                  <p className="mt-1 text-[#94A3B8] text-xs">门店联动补货</p>
                </button>
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-[#0A1427]/75 p-6">
              <p className="font-medium text-[#93C5FD] text-sm">角色面板</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm">CEO 面板</p>
                  <p className="mt-1 text-[#94A3B8] text-xs">利润与风险</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm">财务面板</p>
                  <p className="mt-1 text-[#94A3B8] text-xs">现金与应收</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm">供应链面板</p>
                  <p className="mt-1 text-[#94A3B8] text-xs">库存与履约</p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-[#38BDF8]/30 bg-gradient-to-b from-[#082F49]/65 to-[#0A1427] p-6">
              <p className="font-medium text-[#7DD3FC] text-sm">演示入口</p>
              <p className="mt-3 text-[#CFFAFE] text-sm">
                15 分钟看全流程。
                <br />
                真实业务脚本。
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Activity className="h-4 w-4 text-[#22C55E]" />
                  <span>实时数据回放</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ChartNoAxesCombined className="h-4 w-4 text-[#22C55E]" />
                  <span>财务闭环演示</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Blocks className="h-4 w-4 text-[#22C55E]" />
                  <span>多系统编排展示</span>
                </div>
              </div>
              <Link
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2 font-semibold text-[#052E16] text-sm transition-colors duration-200 hover:bg-[#4ADE80]"
                to="/login"
              >
                立即进入
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
