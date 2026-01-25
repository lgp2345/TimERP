import { loginRequestSchema } from "@repo/schema";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, Loader2, Lock, User } from "lucide-react";
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
    <div className="xl:justify-end-safe flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md xl:mr-20">
        <div className="space-y-8 rounded-2xl border border-border/50 bg-card p-8 shadow-2xl backdrop-blur-sm">
          <div className="space-y-2 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-bold text-3xl tracking-tight">
              {t("auth.login.title")}
            </h1>
            <p className="text-muted-foreground">{t("auth.login.subtitle")}</p>
          </div>

          <form
            className="space-y-6"
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
                      return t(error.errors[0]?.message ?? "validation.error");
                    }
                    return t("auth.companyCode.required");
                  }
                },
              }}
            >
              {(field) => (
                <div className="relative">
                  <Label htmlFor={field.name}>
                    {t("auth.companyCode.label")}
                  </Label>
                  <div className="relative mt-2">
                    <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={t("auth.companyCode.placeholder")}
                      value={field.state.value}
                    />
                  </div>
                  {field.state.meta.errors?.[0] ? (
                    <p className="absolute top-full mt-1 text-destructive text-sm">
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
                      return t(error.errors[0]?.message ?? "validation.error");
                    }
                    return t("auth.userName.required");
                  }
                },
              }}
            >
              {(field) => (
                <div className="relative">
                  <Label htmlFor={field.name}>{t("auth.userName.label")}</Label>
                  <div className="relative mt-2">
                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={t("auth.userName.placeholder")}
                      value={field.state.value}
                    />
                  </div>
                  {field.state.meta.errors?.[0] ? (
                    <p className="absolute top-full mt-1 text-destructive text-sm">
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
                      return t(error.errors[0]?.message ?? "validation.error");
                    }
                    return t("auth.password.invalid");
                  }
                },
              }}
            >
              {(field) => (
                <div className="relative">
                  <Label htmlFor={field.name}>{t("auth.password.label")}</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-10"
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
                    <p className="absolute top-full mt-1 text-destructive text-sm">
                      {field.state.meta.errors[0]}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field name="rememberMe">
              {(field) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.state.value}
                    id={field.name}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                  />
                  <Label
                    className="cursor-pointer font-normal text-sm"
                    htmlFor={field.name}
                  >
                    {t("auth.login.rememberMe")}
                  </Label>
                </div>
              )}
            </form.Field>

            <Button
              className="h-11 w-full cursor-pointer font-semibold text-base"
              type="submit"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                t("auth.login.submit")
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
