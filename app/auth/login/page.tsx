// app/(auth)/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Stethoscope,
  User,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.email.trim()) {
      toast.error("من فضلك أدخل البريد الإلكتروني");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("من فضلك أدخل كلمة المرور");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    // Make API call
    login(formData, {
      onSuccess: (data) => {
        toast.success("تم تسجيل الدخول بنجاح");

        // Redirect based on role
        const role = data.data?.user.role;
        if (role === "doctor") {
          router.push("/doctor/dashboard");
        } else if (role === "patient") {
          router.push("/dashboard");
        } else if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Demo credentials
  const fillDemoCredentials = (type: "patient" | "doctor") => {
    if (type === "patient") {
      setFormData({
        email: "patient@example.com",
        password: "123456",
      });
    } else {
      setFormData({
        email: "doctor@example.com",
        password: "123456",
      });
    }
    setUserType(type);
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Stethoscope className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription className="text-base">
            أدخل بياناتك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* User Type Tabs */}
          <Tabs
            value={userType}
            onValueChange={(v) => setUserType(v as any)}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient" className="gap-2">
                <User className="h-4 w-4" />
                مريض
              </TabsTrigger>
              <TabsTrigger value="doctor" className="gap-2">
                <Stethoscope className="h-4 w-4" />
                طبيب
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pr-10 h-11"
                  disabled={isPending}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  كلمة المرور
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="pr-10 pl-10 h-11"
                  disabled={isPending}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <LogIn className="ml-2 h-4 w-4" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-center text-muted-foreground">
              للتجربة السريعة:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("patient")}
                disabled={isPending}
                className="text-xs"
              >
                <User className="ml-1 h-3 w-3" />
                حساب مريض
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("doctor")}
                disabled={isPending}
                className="text-xs"
              >
                <Stethoscope className="ml-1 h-3 w-3" />
                حساب طبيب
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">ليس لديك حساب؟ </span>
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            بالمتابعة، أنت توافق على{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              الشروط والأحكام
            </Link>{" "}
            و
            <Link href="/privacy" className="underline hover:text-foreground">
              {" "}
              سياسة الخصوصية
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
