import { loginRequestSchema } from "@repo/schema";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Loader2,
  Lock,
  Package,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/queries/user.query";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPending, mutateAsync: loginMutationAsync } = useLoginMutation();

  const form = useForm({
    defaultValues: {
      companyCode: "",
      userName: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      try {
        const validated = loginRequestSchema.parse({
          companyCode: value.companyCode,
          userName: value.userName,
          password: value.password,
        });

        await loginMutationAsync(validated);

        navigate({ to: "/" });
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          const firstError = error.issues[0];
          if (firstError) {
            const field = firstError.path[0] as "userName" | "password";
            const message = t(firstError.message);
            form.setFieldMeta(field, (prev) => ({
              ...prev,
              errors: [message],
            }));
          }
          return;
        }
        const errorMessage =
          error instanceof Error ? error.message : t("auth.login.failed");
        throw new Error(errorMessage);
      }
    },
  });

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#F8FAFC]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#0369A1]/5" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#0F172A]/5" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-[#334155]/3" />
      </div>

      <div className="relative hidden w-full flex-col justify-between bg-[#0F172A] p-12 lg:flex lg:w-[55%]">
        <div>
          <div className="mb-16 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0369A1]">
              <Package className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-white">TimERP</h2>
              <p className="text-[#94A3B8] text-sm">Wholesale Management</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="mb-4 font-bold text-4xl leading-tight text-white">
                Streamline Your
                <span className="block text-[#0369A1]">
                  Wholesale Operations
                </span>
              </h1>
              <p className="max-w-lg text-[#CBD5E1] text-lg leading-relaxed">
                Manage inventory, orders, and customer relationships with
                enterprise-grade efficiency
              </p>
            </div>

            <div className="grid gap-4">
              <div className="group flex cursor-pointer items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-200 hover:border-[#0369A1]/50 hover:bg-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0369A1]/20">
                  <BarChart3 className="h-5 w-5 text-[#0369A1]" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">
                    Real-time Analytics
                  </h3>
                  <p className="text-[#94A3B8] text-sm">
                    Track performance metrics and make data-driven decisions
                  </p>
                </div>
              </div>

              <div className="group flex cursor-pointer items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-200 hover:border-[#0369A1]/50 hover:bg-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0369A1]/20">
                  <TrendingUp className="h-5 w-5 text-[#0369A1]" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">
                    Inventory Optimization
                  </h3>
                  <p className="text-[#94A3B8] text-sm">
                    Automated stock management and forecasting
                  </p>
                </div>
              </div>

              <div className="group flex cursor-pointer items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-200 hover:border-[#0369A1]/50 hover:bg-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0369A1]/20">
                  <ShieldCheck className="h-5 w-5 text-[#0369A1]" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">
                    Enterprise Security
                  </h3>
                  <p className="text-[#94A3B8] text-sm">
                    Bank-level encryption and compliance standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 border-t border-white/10 pt-8">
          <div>
            <div className="mb-1 font-bold text-2xl text-white">50K+</div>
            <div className="text-[#94A3B8] text-sm">Active Users</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div>
            <div className="mb-1 font-bold text-2xl text-white">99.9%</div>
            <div className="text-[#94A3B8] text-sm">Uptime</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div>
            <div className="mb-1 font-bold text-2xl text-white">24/7</div>
            <div className="text-[#94A3B8] text-sm">Support</div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center p-8 lg:w-[45%]">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F172A]">
              <Package className="h-7 w-7 text-white" />
            </div>
            <h2 className="mb-1 font-bold text-2xl text-[#0F172A]">TimERP</h2>
            <p className="text-[#64748B]">Wholesale Management System</p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-lg">
            <div className="mb-8">
              <h1 className="mb-2 font-bold text-2xl text-[#0F172A]">
                {t("auth.login.title")}
              </h1>
              <p className="text-[#64748B]">{t("auth.login.subtitle")}</p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="companyCode"
                validators={{
                  onChange: ({ value }) => {
                    try {
                      loginRequestSchema.shape.companyCode.parse(value);
                      return;
                    } catch (error: unknown) {
                      if (error instanceof ZodError) {
                        return t(
                          error.errors[0]?.message ?? "validation.error"
                        );
                      }
                      return t("auth.companyCode.required");
                    }
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label
                      className="font-medium text-[#334155] text-sm"
                      htmlFor={field.name}
                    >
                      {t("auth.companyCode.label")}
                    </Label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
                      <Input
                        className="h-12 border-[#E2E8F0] bg-[#F8FAFC] pl-11 text-[#0F172A] transition-colors focus:border-[#0369A1] focus:bg-white"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("auth.companyCode.placeholder")}
                        value={field.state.value}
                      />
                    </div>
                    {field.state.meta.errors?.[0] ? (
                      <p className="text-[#DC2626] text-sm">
                        {field.state.meta.errors[0]}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="userName"
                validators={{
                  onChange: ({ value }) => {
                    try {
                      loginRequestSchema.shape.userName.parse(value);
                      return;
                    } catch (error: unknown) {
                      if (error instanceof ZodError) {
                        return t(
                          error.errors[0]?.message ?? "validation.error"
                        );
                      }
                      return t("auth.userName.required");
                    }
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label
                      className="font-medium text-[#334155] text-sm"
                      htmlFor={field.name}
                    >
                      {t("auth.userName.label")}
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
                      <Input
                        className="h-12 border-[#E2E8F0] bg-[#F8FAFC] pl-11 text-[#0F172A] transition-colors focus:border-[#0369A1] focus:bg-white"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("auth.userName.placeholder")}
                        value={field.state.value}
                      />
                    </div>
                    {field.state.meta.errors?.[0] ? (
                      <p className="text-[#DC2626] text-sm">
                        {field.state.meta.errors[0]}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    try {
                      loginRequestSchema.shape.password.parse(value);
                      return;
                    } catch (error: unknown) {
                      if (error instanceof ZodError) {
                        return t(
                          error.errors[0]?.message ?? "validation.error"
                        );
                      }
                      return t("auth.password.invalid");
                    }
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label
                      className="font-medium text-[#334155] text-sm"
                      htmlFor={field.name}
                    >
                      {t("auth.password.label")}
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
                      <Input
                        className="h-12 border-[#E2E8F0] bg-[#F8FAFC] pl-11 text-[#0F172A] transition-colors focus:border-[#0369A1] focus:bg-white"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("auth.password.placeholder")}
                        type="password"
                        value={field.state.value}
                      />
                    </div>
                    {field.state.meta.errors?.[0] ? (
                      <p className="text-[#DC2626] text-sm">
                        {field.state.meta.errors[0]}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <div className="flex items-center justify-between">
                <form.Field name="rememberMe">
                  {(field) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.state.value}
                        className="border-[#CBD5E1] data-[state=checked]:bg-[#0369A1]"
                        id={field.name}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked === true)
                        }
                      />
                      <Label
                        className="cursor-pointer font-normal text-[#475569] text-sm"
                        htmlFor={field.name}
                      >
                        {t("auth.login.rememberMe")}
                      </Label>
                    </div>
                  )}
                </form.Field>
              </div>

              <Button
                className="group h-12 w-full cursor-pointer bg-[#0369A1] font-semibold text-base text-white transition-all duration-200 hover:bg-[#075985]"
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {t("auth.login.submit")}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <div className="mt-6 border-t border-[#E2E8F0] pt-6">
                <div className="flex items-center justify-center gap-2 text-center text-[#64748B] text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Protected by enterprise-grade security</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
