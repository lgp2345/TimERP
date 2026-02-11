import {
  type CaptchaResponse,
  type LoginRequest,
  type LoginResponse,
  loginRequestSchema,
} from "@repo/schema";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Image,
  Loader2,
  Lock,
  Moon,
  Package,
  RefreshCw,
  ShieldCheck,
  Sun,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCaptchaMutation, useLoginMutation } from "@/queries/user.query";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/login")({ component: Login });

type ThemeMode = "dark" | "light";
type CaptchaValidationResult = {
  message: string;
  shouldRefresh: boolean;
};
type TranslateFn = (
  key: string,
  options?: {
    defaultValue?: string;
  }
) => string;
type FieldValidator = (params: { value: string }) => string | undefined;
type LoginSubmitValue = {
  captcha: string;
  companyCode: string;
  password: string;
  rememberMe: boolean;
  userName: string;
};
type LoginFieldName = "captcha" | "companyCode" | "password" | "userName";

const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem("theme-mode");
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const getCaptchaValidationResult = (
  value: string,
  t: TranslateFn
): CaptchaValidationResult | null => {
  if (value.trim().length === 0) {
    return {
      message: t("auth.captcha.required", { defaultValue: "请输入图形验证码" }),
      shouldRefresh: false,
    };
  }
  return null;
};

const createSchemaFieldValidator =
  (
    parse: (value: string) => unknown,
    fallbackKey: string,
    t: TranslateFn
  ): FieldValidator =>
  ({ value }) => {
    try {
      parse(value);
      return;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return t(error.errors[0]?.message ?? "validation.error");
      }
      return t(fallbackKey);
    }
  };

const createCaptchaFieldValidator =
  (t: TranslateFn): FieldValidator =>
  ({ value }) => {
    if (!value.trim()) {
      return t("auth.captcha.required", { defaultValue: "请输入图形验证码" });
    }
    return;
  };

const submitLoginForm = async (params: {
  captchaId: string | null;
  loginMutationAsync: (payload: LoginRequest) => Promise<LoginResponse>;
  onFieldError: (field: LoginFieldName, message: string) => void;
  onSuccess: (response: LoginResponse) => void;
  refreshCaptcha: () => Promise<void>;
  t: TranslateFn;
  value: LoginSubmitValue;
}) => {
  const {
    captchaId,
    loginMutationAsync,
    onFieldError,
    onSuccess,
    refreshCaptcha,
    t,
    value,
  } = params;

  const captchaValidation = getCaptchaValidationResult(value.captcha, t);
  if (captchaValidation) {
    onFieldError("captcha", captchaValidation.message);
    if (captchaValidation.shouldRefresh) {
      await refreshCaptcha();
    }
    return;
  }
  if (!captchaId) {
    onFieldError("captcha", t("auth.captcha.required"));
    await refreshCaptcha();
    return;
  }

  try {
    const validated = loginRequestSchema.parse({
      companyCode: value.companyCode,
      identifier: value.userName,
      userName: value.userName,
      password: value.password,
      captchaId,
      captchaCode: value.captcha,
    });
    const response = await loginMutationAsync(validated);
    onSuccess(response);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      if (firstError) {
        const field = firstError.path[0] as
          | "companyCode"
          | "userName"
          | "password";
        const message = t(firstError.message);
        onFieldError(field, message);
      }
      return;
    }
    const errorMessage =
      error instanceof Error ? error.message : t("auth.login.failed");
    onFieldError("password", errorMessage);
    await refreshCaptcha();
  }
};

const ThemeModeIcon = ({ themeMode }: { themeMode: ThemeMode }) => {
  if (themeMode === "dark") {
    return <Sun className="h-4 w-4" />;
  }
  return <Moon className="h-4 w-4" />;
};

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPending, mutateAsync: loginMutationAsync } = useLoginMutation();
  const { isPending: isCaptchaPending, mutateAsync: fetchCaptchaAsync } =
    useCaptchaMutation();
  const setLoginContext = useAuthStore((state) => state.setLoginContext);
  const [captchaData, setCaptchaData] = useState<CaptchaResponse | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const refreshCaptcha = useMemo(
    () => async () => {
      const captcha = await fetchCaptchaAsync();
      setCaptchaData(captcha);
    },
    [fetchCaptchaAsync]
  );
  const validateCompanyCode = useMemo(
    () =>
      createSchemaFieldValidator(
        loginRequestSchema.shape.companyCode.parse,
        "auth.companyCode.required",
        t
      ),
    [t]
  );
  const validateUserName = useMemo(
    () =>
      createSchemaFieldValidator(
        loginRequestSchema.shape.userName.parse,
        "auth.userName.required",
        t
      ),
    [t]
  );
  const validatePassword = useMemo(
    () =>
      createSchemaFieldValidator(
        loginRequestSchema.shape.password.parse,
        "auth.password.invalid",
        t
      ),
    [t]
  );
  const validateCaptcha = useMemo(() => createCaptchaFieldValidator(t), [t]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", themeMode === "dark");
    window.localStorage.setItem("theme-mode", themeMode);
  }, [themeMode]);
  useEffect(() => {
    refreshCaptcha().catch(() => null);
  }, [refreshCaptcha]);

  const form = useForm({
    defaultValues: {
      companyCode: "",
      userName: "",
      password: "",
      captcha: "",
      rememberMe: false,
    },
    onSubmit: ({ value }) =>
      submitLoginForm({
        captchaId: captchaData?.captchaId ?? null,
        loginMutationAsync,
        onFieldError: (field, message) => {
          form.setFieldMeta(field, (prev) => ({
            ...prev,
            errors: [message],
          }));
        },
        onSuccess: (response) => {
          setLoginContext(response);
          navigate({ to: "/" });
        },
        refreshCaptcha,
        t,
        value,
      }),
  });

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[-140px] h-96 w-96 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-28 left-[-120px] h-80 w-80 rounded-full bg-accent/30 blur-3xl dark:bg-primary/20" />
      </div>

      <button
        className="absolute top-5 right-5 z-20 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card/85 text-foreground shadow-sm transition-colors duration-200 hover:border-primary hover:text-primary"
        onClick={() =>
          setThemeMode((prev) => (prev === "dark" ? "light" : "dark"))
        }
        type="button"
      >
        <ThemeModeIcon themeMode={themeMode} />
      </button>

      <div className="relative hidden w-full flex-col justify-between bg-[#0A1427] p-12 text-[#E2E8F0] lg:flex lg:w-[56%]">
        <div className="absolute inset-0 opacity-25">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.45) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <div className="relative">
          <div className="mb-14 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0369A1]">
              <Package className="h-7 w-7 text-[#E0F2FE]" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">TimERP</h2>
              <p className="text-[#94A3B8] text-sm">Enterprise Control Layer</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="mb-4 font-bold text-4xl leading-tight">
                业务入口，
                <span className="block text-[#7DD3FC]">就在这块控制台</span>
              </h1>
              <p className="max-w-lg text-[#CBD5E1] text-lg leading-relaxed">
                登录后即可进入统一看板，关键数据同步刷新。
              </p>
            </div>

            <div className="grid gap-4">
              <div className="group flex cursor-pointer items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors duration-200 hover:border-[#38BDF8]/60 hover:bg-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0369A1]/20">
                  <BarChart3 className="h-5 w-5 text-[#7DD3FC]" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">实时运营指标</h3>
                  <p className="text-[#94A3B8] text-sm">
                    核心 KPI 同步更新，异常即时提醒。
                  </p>
                </div>
              </div>

              <div className="group flex cursor-pointer items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors duration-200 hover:border-[#22C55E]/60 hover:bg-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#22C55E]/20">
                  <TrendingUp className="h-5 w-5 text-[#86EFAC]" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">库存与履约联动</h3>
                  <p className="text-[#94A3B8] text-sm">
                    采购、库存、出库、回款同一链路追踪。
                  </p>
                </div>
              </div>

              <div className="group flex cursor-pointer items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors duration-200 hover:border-[#22C55E]/60 hover:bg-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#22C55E]/20">
                  <ShieldCheck className="h-5 w-5 text-[#86EFAC]" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">安全与审计闭环</h3>
                  <p className="text-[#94A3B8] text-sm">
                    权限可控，操作有迹可循。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-8 border-white/10 border-t pt-8">
          <div>
            <div className="mb-1 font-bold text-2xl">50K+</div>
            <div className="text-[#94A3B8] text-sm">Active Users</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div>
            <div className="mb-1 font-bold text-2xl">99.9%</div>
            <div className="text-[#94A3B8] text-sm">Uptime</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div>
            <div className="mb-1 font-bold text-2xl">24/7</div>
            <div className="text-[#94A3B8] text-sm">Support</div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center p-8 lg:w-[44%]">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Package className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="mb-1 font-bold text-2xl text-foreground">TimERP</h2>
            <p className="text-muted-foreground">Enterprise Login Console</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="mb-8">
              <h1 className="mb-2 font-bold text-2xl text-card-foreground">
                {t("auth.login.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("auth.login.subtitle")}
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="companyCode"
                validators={{
                  onChange: validateCompanyCode,
                }}
              >
                {(field) => (
                  <div className="relative pb-2">
                    <Label
                      className="font-medium text-card-foreground text-sm"
                      htmlFor={field.name}
                    >
                      {t("auth.companyCode.label")}
                    </Label>
                    <div className="relative mt-2">
                      <Building2 className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="h-12 border-input bg-muted pl-11 text-card-foreground transition-colors focus:border-primary focus:bg-card"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("auth.companyCode.placeholder")}
                        value={field.state.value}
                      />
                    </div>
                    <p className="absolute bottom-[-16px] text-[13px] text-destructive">
                      {field.state.meta.errors?.[0] ?? " "}
                    </p>
                  </div>
                )}
              </form.Field>

              <form.Field
                name="userName"
                validators={{
                  onChange: validateUserName,
                }}
              >
                {(field) => (
                  <div className="relative pb-2">
                    <Label
                      className="font-medium text-card-foreground text-sm"
                      htmlFor={field.name}
                    >
                      {t("auth.userName.label")}
                    </Label>
                    <div className="relative mt-2">
                      <User className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="h-12 border-input bg-muted pl-11 text-card-foreground transition-colors focus:border-primary focus:bg-card"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("auth.userName.placeholder")}
                        value={field.state.value}
                      />
                    </div>
                    <p className="absolute bottom-[-16px] text-[13px] text-destructive">
                      {field.state.meta.errors?.[0] ?? " "}
                    </p>
                  </div>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: validatePassword,
                }}
              >
                {(field) => (
                  <div className="relative pb-2">
                    <Label
                      className="font-medium text-card-foreground text-sm"
                      htmlFor={field.name}
                    >
                      {t("auth.password.label")}
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="h-12 border-input bg-muted pl-11 text-card-foreground transition-colors focus:border-primary focus:bg-card"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("auth.password.placeholder")}
                        type="password"
                        value={field.state.value}
                      />
                    </div>
                    <p className="absolute bottom-[-16px] text-[13px] text-destructive">
                      {field.state.meta.errors?.[0] ?? " "}
                    </p>
                  </div>
                )}
              </form.Field>

              <form.Field
                name="captcha"
                validators={{
                  onChange: validateCaptcha,
                }}
              >
                {(field) => (
                  <div className="relative pb-2">
                    <Label
                      className="font-medium text-card-foreground text-sm"
                      htmlFor={field.name}
                    >
                      {t("auth.captcha.label", { defaultValue: "图形验证码" })}
                    </Label>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-12 shrink-0 overflow-hidden rounded-lg border border-input bg-muted">
                        <img
                          alt={t("auth.captcha.imageAlt", {
                            defaultValue: "图形验证码",
                          })}
                          className="h-full w-[210px]"
                          height={50}
                          src={captchaData?.svg ?? ""}
                          width={210}
                        />
                      </div>
                      <button
                        className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-input bg-muted text-muted-foreground transition-colors duration-200 hover:border-primary hover:bg-accent hover:text-accent-foreground"
                        disabled={isCaptchaPending}
                        onClick={() => {
                          refreshCaptcha().catch(() => null);
                        }}
                        title={t("auth.captcha.refresh", {
                          defaultValue: "刷新验证码",
                        })}
                        type="button"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative mt-2">
                      <Image className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="h-12 border-input bg-muted pl-11 text-card-foreground uppercase tracking-[0.2em] transition-colors focus:border-primary focus:bg-card"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("auth.captcha.placeholder", {
                          defaultValue: "输入上方验证码",
                        })}
                        value={field.state.value}
                      />
                    </div>
                    <p className="absolute bottom-[-16px] text-[13px] text-destructive">
                      {field.state.meta.errors?.[0] ?? " "}
                    </p>
                  </div>
                )}
              </form.Field>

              <div className="flex items-center justify-between">
                <form.Field name="rememberMe">
                  {(field) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.state.value}
                        className="border-input data-[state=checked]:bg-primary"
                        id={field.name}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked === true)
                        }
                      />
                      <Label
                        className="cursor-pointer font-normal text-muted-foreground text-sm"
                        htmlFor={field.name}
                      >
                        {t("auth.login.rememberMe")}
                      </Label>
                    </div>
                  )}
                </form.Field>
              </div>

              <Button
                className="group h-12 w-full cursor-pointer bg-primary font-semibold text-base text-primary-foreground transition-colors duration-200 hover:bg-[#075985] dark:hover:bg-[#16A34A]"
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

              <div className="mt-4 border-border border-t pt-5">
                <div className="flex items-center justify-center gap-2 text-center text-muted-foreground text-sm">
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
