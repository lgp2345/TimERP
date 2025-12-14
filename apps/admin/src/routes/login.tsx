import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, User, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
	const form = useForm({
		defaultValues: {
			companyCode: "",
			username: "",
			password: "",
			rememberMe: false,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
			<div className="w-full max-w-md">
				<div className="bg-card rounded-2xl shadow-2xl border border-border/50 p-8 space-y-8 backdrop-blur-sm">
					<div className="text-center space-y-2">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
							<Building2 className="w-8 h-8 text-primary" />
						</div>
						<h1 className="text-3xl font-bold tracking-tight">欢迎登录</h1>
						<p className="text-muted-foreground">请输入您的登录信息</p>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<form.Field
							name="companyCode"
							validators={{
								onChange: ({ value }) => (!value ? "公司编码不能为空" : undefined),
							}}
						>
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>公司编码</Label>
									<div className="relative">
										<Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className="pl-10"
											placeholder="请输入公司编码"
										/>
									</div>
									{field.state.meta.errors && <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>}
								</div>
							)}
						</form.Field>

						<form.Field
							name="username"
							validators={{
								onChange: ({ value }) => (!value ? "账号不能为空" : undefined),
							}}
						>
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>账号</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className="pl-10"
											placeholder="请输入账号"
										/>
									</div>
									{field.state.meta.errors && <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>}
								</div>
							)}
						</form.Field>

						<form.Field
							name="password"
							validators={{
								onChange: ({ value }) => (!value ? "密码不能为空" : undefined),
							}}
						>
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>密码</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
										<Input
											id={field.name}
											name={field.name}
											type="password"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className="pl-10"
											placeholder="请输入密码"
										/>
									</div>
									{field.state.meta.errors && <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>}
								</div>
							)}
						</form.Field>

						<form.Field name="rememberMe">
							{(field) => (
								<div className="flex items-center space-x-2">
									<Checkbox
										id={field.name}
										checked={field.state.value}
										onCheckedChange={(checked) => field.handleChange(checked === true)}
									/>
									<Label htmlFor={field.name} className="text-sm font-normal cursor-pointer">
										记住我
									</Label>
								</div>
							)}
						</form.Field>

						<Button type="submit" className="w-full h-11 text-base font-semibold">
							登录
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
