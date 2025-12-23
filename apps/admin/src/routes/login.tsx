import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const setAccessToken = useAppStore((s) => s.setAccessToken);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: value.username,
          password: value.password,
        }),
      });

      if (!res.ok) throw new Error("登录失败");
      const data: unknown = await res.json();
      const accessToken =
        typeof (data as { accessToken?: unknown }).accessToken === "string"
          ? (data as { accessToken: string }).accessToken
          : null;
      if (!accessToken) throw new Error("登录失败");

      setAccessToken(accessToken, value.rememberMe ? "local" : "session");
    },
  });

  return (
    <div className="xl:justify-end-safe flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md xl:mr-20">
        <div className="space-y-8 rounded-2xl border border-border/50 bg-card p-8 shadow-2xl backdrop-blur-sm">
          <div className="space-y-2 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-bold text-3xl tracking-tight">欢迎登录</h1>
            <p className="text-muted-foreground">请输入您的登录信息</p>
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
              name="username"
              validators={{
                onChange: ({ value }) => (value ? undefined : "账号不能为空"),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>账号</Label>
                  <div className="relative">
                    <User className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="请输入账号"
                      value={field.state.value}
                    />
                  </div>
                  {field.state.meta.errors && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => (value ? undefined : "密码不能为空"),
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>密码</Label>
                  <div className="relative">
                    <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="请输入密码"
                      type="password"
                      value={field.state.value}
                    />
                  </div>
                  {field.state.meta.errors && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
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
                    记住我
                  </Label>
                </div>
              )}
            </form.Field>

            <Button
              className="h-11 w-full font-semibold text-base"
              type="submit"
            >
              登录
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
