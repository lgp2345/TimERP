import { useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { LuUsersRound, LuUserRound, LuEye, LuEyeClosed, LuLock } from "react-icons/lu";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex justify-end items-center p-4 pr-28">
      <div className="w-full max-w-md">
        {/* Login Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-center">Login to Your Account</h2>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Field */}
              <Input label="公司编码" labelPlacement="outside" type="number" startContent={<LuUsersRound />}></Input>
              {/* Username Field */}
              <Input label="用户名" labelPlacement="outside" startContent={<LuUserRound />}></Input>
              {/* Password Field */}
              <Input
                label="密码"
                labelPlacement="outside"
                type={isVisible ? "text" : "password"}
                startContent={<LuLock />}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-solid outline-transparent"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <LuEyeClosed className="text-default-400 pointer-events-none" />
                    ) : (
                      <LuEye className="text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              ></Input>
              {/* Remember Me and Forgot Password */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe}>
                    Remember me
                  </Checkbox>
                </div>
                <button type="button" className="text-sm  hover:underline cursor-pointer">
                  Forgot password?
                </button>
              </div>
            </Form>
          </CardBody>
          <CardFooter>
            <Button type="submit" className="w-full" color="primary" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
