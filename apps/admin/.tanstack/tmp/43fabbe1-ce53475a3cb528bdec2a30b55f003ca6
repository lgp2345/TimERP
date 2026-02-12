import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  Cpu,
  Database,
  Factory,
  Gauge,
  Handshake,
  Layers,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomeV3,
});

function HomeV3() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#020617]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-44 right-[-120px] h-[420px] w-[420px] rounded-full bg-[#0EA5E9]/20 blur-[100px]" />
        <div className="absolute -bottom-40 left-[-140px] h-[420px] w-[420px] rounded-full bg-[#22C55E]/18 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-6 pb-16 md:px-8 lg:px-10">
        <nav className="sticky top-4 z-20 mb-12 flex items-center justify-between rounded-2xl border border-[#CBD5E1] bg-white/85 px-5 py-3 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A]">
              <Cpu className="h-5 w-5 text-[#E2E8F0]" />
            </div>
            <div>
              <p className="font-semibold text-base tracking-wide">
                TimERP Pulse
              </p>
              <p className="text-[#475569] text-xs">Enterprise Control Layer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer rounded-lg border border-[#94A3B8] px-4 py-2 font-medium text-[#0F172A] text-sm transition-colors duration-200 hover:border-[#0369A1] hover:text-[#0369A1]"
              type="button"
            >
              Contact Sales
            </button>
            <Link
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0369A1] px-4 py-2 font-semibold text-[#E0F2FE] text-sm transition-colors duration-200 hover:bg-[#075985]"
              to="/login"
            >
              Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>

        <main className="space-y-12">
          <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <article className="rounded-3xl border border-[#CBD5E1] bg-white p-7 shadow-sm md:p-10">
              <p className="mb-4 inline-flex items-center rounded-full border border-[#0369A1]/30 bg-[#E0F2FE] px-3 py-1 font-medium text-[#0369A1] text-xs">
                Real-time Enterprise Command
              </p>
              <h1 className="max-w-2xl font-semibold text-4xl leading-tight md:text-5xl">
                复杂流程
                <span className="block text-[#0369A1]">变成可控节奏</span>
              </h1>
              <p className="mt-5 max-w-xl text-[#334155] text-lg leading-relaxed">
                订单、库存、财务、履约，一套引擎统一调度。
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-[#64748B] text-xs">订单响应速度</p>
                  <p className="mt-2 font-semibold text-2xl text-[#0369A1]">
                    +42%
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-[#64748B] text-xs">库存准确率</p>
                  <p className="mt-2 font-semibold text-2xl">99.6%</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <p className="text-[#64748B] text-xs">异常识别时间</p>
                  <p className="mt-2 font-semibold text-2xl text-[#16A34A]">
                    1.2 秒
                  </p>
                </div>
              </div>
            </article>

            <div className="space-y-4">
              <article className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-medium text-[#0369A1] text-sm">业务体征</p>
                  <Gauge className="h-4 w-4 text-[#0369A1]" />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                    <span className="text-[#334155]">采购在途</span>
                    <span className="font-medium text-[#0369A1]">1,284 单</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                    <span className="text-[#334155]">可售库存</span>
                    <span className="font-medium text-[#16A34A]">稳定</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                    <span className="text-[#334155]">现金预测偏差</span>
                    <span className="font-medium text-[#0F172A]">2.1%</span>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm">
                <p className="mb-4 font-medium text-[#0369A1] text-sm">
                  可信体系
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                    <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                    <span>权限分层与审计留痕</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                    <BadgeCheck className="h-4 w-4 text-[#16A34A]" />
                    <span>流程规则自动校验</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <article className="rounded-3xl border border-[#CBD5E1] bg-white p-7 shadow-sm">
              <h2 className="font-semibold text-2xl">行业模板中枢</h2>
              <p className="mt-2 text-[#475569] text-sm">
                一键切换行业，业务流和字段同步变化。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="cursor-pointer rounded-full border border-[#0369A1]/35 bg-[#E0F2FE] px-4 py-2 text-[#0369A1] text-sm transition-colors duration-200 hover:bg-[#BAE6FD]"
                  type="button"
                >
                  制造
                </button>
                <button
                  className="cursor-pointer rounded-full border border-[#CBD5E1] px-4 py-2 text-[#334155] text-sm transition-colors duration-200 hover:border-[#0369A1] hover:text-[#0369A1]"
                  type="button"
                >
                  分销
                </button>
                <button
                  className="cursor-pointer rounded-full border border-[#CBD5E1] px-4 py-2 text-[#334155] text-sm transition-colors duration-200 hover:border-[#0369A1] hover:text-[#0369A1]"
                  type="button"
                >
                  零售
                </button>
                <button
                  className="cursor-pointer rounded-full border border-[#CBD5E1] px-4 py-2 text-[#334155] text-sm transition-colors duration-200 hover:border-[#0369A1] hover:text-[#0369A1]"
                  type="button"
                >
                  工程
                </button>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="cursor-pointer rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm transition-colors duration-200 hover:border-[#0369A1] hover:bg-[#F0F9FF]">
                <Factory className="mb-4 h-5 w-5 text-[#0369A1]" />
                <h3 className="font-semibold">生产排程可视化</h3>
                <p className="mt-2 text-[#64748B] text-sm">
                  工序瓶颈提前暴露。
                </p>
              </article>
              <article className="cursor-pointer rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm transition-colors duration-200 hover:border-[#0369A1] hover:bg-[#F0F9FF]">
                <Truck className="mb-4 h-5 w-5 text-[#0369A1]" />
                <h3 className="font-semibold">履约链路追踪</h3>
                <p className="mt-2 text-[#64748B] text-sm">
                  发货、签收、回单同屏。
                </p>
              </article>
              <article className="cursor-pointer rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm transition-colors duration-200 hover:border-[#0369A1] hover:bg-[#F0F9FF]">
                <Database className="mb-4 h-5 w-5 text-[#0369A1]" />
                <h3 className="font-semibold">数据资产中台</h3>
                <p className="mt-2 text-[#64748B] text-sm">主数据统一治理。</p>
              </article>
              <article className="cursor-pointer rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm transition-colors duration-200 hover:border-[#0369A1] hover:bg-[#F0F9FF]">
                <Layers className="mb-4 h-5 w-5 text-[#0369A1]" />
                <h3 className="font-semibold">跨系统编排</h3>
                <p className="mt-2 text-[#64748B] text-sm">
                  API 与流程并行驱动。
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <article className="rounded-3xl border border-[#CBD5E1] bg-white p-7 shadow-sm">
              <h2 className="font-semibold text-2xl">角色驾驶舱</h2>
              <p className="mt-2 text-[#475569] text-sm">
                每个岗位，只看最关键数字。
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <Building2 className="mb-3 h-5 w-5 text-[#0369A1]" />
                  <p className="font-medium text-sm">总经理</p>
                  <p className="mt-2 text-[#64748B] text-xs">利润与风险</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <BriefcaseBusiness className="mb-3 h-5 w-5 text-[#0369A1]" />
                  <p className="font-medium text-sm">财务</p>
                  <p className="mt-2 text-[#64748B] text-xs">现金与回款</p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <Handshake className="mb-3 h-5 w-5 text-[#0369A1]" />
                  <p className="font-medium text-sm">销售</p>
                  <p className="mt-2 text-[#64748B] text-xs">线索与签单</p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-[#0C4A6E]/25 bg-gradient-to-b from-[#E0F2FE] to-white p-7 shadow-sm">
              <p className="font-medium text-[#0369A1] text-sm">Quick Start</p>
              <p className="mt-3 text-[#0F172A] text-sm">
                真实业务脚本。
                <br />
                15 分钟看懂全流程。
              </p>
              <div className="mt-5 space-y-2 text-xs text-[#334155]">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#16A34A]" />
                  <span>实时预警联动</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChartNoAxesCombined className="h-4 w-4 text-[#16A34A]" />
                  <span>财务闭环看板</span>
                </div>
              </div>
              <Link
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0369A1] px-4 py-2 font-semibold text-[#E0F2FE] text-sm transition-colors duration-200 hover:bg-[#075985]"
                to="/login"
              >
                进入系统
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
