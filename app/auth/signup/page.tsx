// app/(auth)/signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignup } from "@/lib/hooks/useAuth";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Stethoscope,
  User,
  Phone,
  Calendar,
//   AlertCircle,
  UserPlus,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { RoleEnum, GenderEnum, SpecialtyEnum, DegreeEnum, BloodTypeEnum } from "@/lib/types/api.types";
import { getErrorMessage, getSpecialtyLabel } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignup();

  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Common fields
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "" as GenderEnum,
    dateOfBirth: "",

    // Patient-specific
    bloodType: "" as BloodTypeEnum,

    // Doctor-specific
    specialty: "" as SpecialtyEnum,
    degree: "" as DegreeEnum,
    licenseNumber: "",
    yearsOfExperience: "",
    bio: "",
    consultationFeeInClinic: "",
    consultationFeeOnline: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error("من فضلك أدخل الاسم الكامل");
      return false;
    }

    if (formData.fullName.length < 3) {
      toast.error("الاسم يجب أن يكون 3 أحرف على الأقل");
      return false;
    }

    if (!formData.userName.trim()) {
      toast.error("من فضلك أدخل اسم المستخدم");
      return false;
    }

    if (formData.userName.length < 3) {
      toast.error("اسم المستخدم يجب أن يكون 3 أحرف على الأقل");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("من فضلك أدخل البريد الإلكتروني");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return false;
    }

    if (!formData.password) {
      toast.error("من فضلك أدخل كلمة المرور");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return false;
    }

    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.phoneNumber.trim()) {
      toast.error("من فضلك أدخل رقم الهاتف");
      return false;
    }

    if (!formData.gender) {
      toast.error("من فضلك اختر النوع");
      return false;
    }

    if (!formData.dateOfBirth) {
      toast.error("من فضلك أدخل تاريخ الميلاد");
      return false;
    }

    // Doctor-specific validation
    if (userType === "doctor") {
      if (!formData.specialty) {
        toast.error("من فضلك اختر التخصص");
        return false;
      }

      if (!formData.degree) {
        toast.error("من فضلك اختر الدرجة العلمية");
        return false;
      }

      if (!formData.licenseNumber.trim()) {
        toast.error("من فضلك أدخل رقم الترخيص");
        return false;
      }

      if (!formData.yearsOfExperience) {
        toast.error("من فضلك أدخل سنوات الخبرة");
        return false;
      }

      if (parseInt(formData.yearsOfExperience) < 0 || parseInt(formData.yearsOfExperience) > 70) {
        toast.error("سنوات الخبرة غير صحيحة");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    const signupData: any = {
      fullName: formData.fullName,
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      role: userType === "doctor" ? RoleEnum.doctor : RoleEnum.patient,
    };

    if (userType === "patient") {
      if (formData.bloodType) {
        signupData.bloodType = formData.bloodType;
      }
    } else if (userType === "doctor") {
      signupData.specialty = formData.specialty;
      signupData.degree = formData.degree;
      signupData.licenseNumber = formData.licenseNumber;
      signupData.yearsOfExperience = parseInt(formData.yearsOfExperience);
      
      if (formData.consultationFeeInClinic || formData.consultationFeeOnline) {
        signupData.consultationFee = {
          inClinic: formData.consultationFeeInClinic ? parseFloat(formData.consultationFeeInClinic) : undefined,
          online: formData.consultationFeeOnline ? parseFloat(formData.consultationFeeOnline) : undefined,
        };
      }
    }

    signup(signupData, {
      onSuccess: () => {
        toast.success(
          userType === "doctor"
            ? "تم التسجيل بنجاح! سيتم مراجعة حسابك قريباً"
            : "تم التسجيل بنجاح! يمكنك تسجيل الدخول الآن"
        );
        router.push("/login");
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <UserPlus className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription className="text-base">
            {userType === "doctor"
              ? "انضم كطبيب واستقبل المرضى أونلاين"
              : "سجل كمريض واحجز موعدك مع أفضل الأطباء"}
          </CardDescription>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div
              className={`h-2 w-24 rounded-full transition-colors ${
                step >= 1 ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`h-2 w-24 rounded-full transition-colors ${
                step >= 2 ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            الخطوة {step} من 2
          </p>
        </CardHeader>

        <CardContent>
          {/* User Type Tabs */}
          <Tabs
            value={userType}
            onValueChange={(v) => {
              setUserType(v as any);
              setStep(1);
            }}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Account Info */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                    <Input
                      id="fullName"
                      placeholder="أحمد محمد علي"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      disabled={isPending}
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="userName">اسم المستخدم *</Label>
                    <Input
                      id="userName"
                      placeholder="ahmed_m"
                      value={formData.userName}
                      onChange={(e) =>
                        handleInputChange("userName", e.target.value)
                      }
                      disabled={isPending}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pr-10"
                      disabled={isPending}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور *</Label>
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
                      className="pr-10 pl-10"
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="pr-10 pl-10"
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full"
                  disabled={isPending}
                >
                  التالي
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Personal & Professional Info */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+201234567890"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        className="pr-10"
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">النوع *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={GenderEnum.male}>ذكر</SelectItem>
                        <SelectItem value={GenderEnum.female}>أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">تاريخ الميلاد *</Label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      className="pr-10"
                      disabled={isPending}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                {/* Patient-specific fields */}
                {userType === "patient" && (
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">فصيلة الدم (اختياري)</Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) =>
                        handleInputChange("bloodType", value)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فصيلة الدم" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BloodTypeEnum).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Doctor-specific fields */}
                {userType === "doctor" && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Specialty */}
                      <div className="space-y-2">
                        <Label htmlFor="specialty">التخصص *</Label>
                        <Select
                          value={formData.specialty}
                          onValueChange={(value) =>
                            handleInputChange("specialty", value)
                          }
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التخصص" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(SpecialtyEnum).map((spec) => (
                              <SelectItem key={spec} value={spec}>
                                {getSpecialtyLabel(spec)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Degree */}
                      <div className="space-y-2">
                        <Label htmlFor="degree">الدرجة العلمية *</Label>
                        <Select
                          value={formData.degree}
                          onValueChange={(value) =>
                            handleInputChange("degree", value)
                          }
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الدرجة" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(DegreeEnum).map((deg) => (
                              <SelectItem key={deg} value={deg}>
                                {deg}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* License Number */}
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">رقم الترخيص *</Label>
                        <Input
                          id="licenseNumber"
                          placeholder="LIC-2024-12345"
                          value={formData.licenseNumber}
                          onChange={(e) =>
                            handleInputChange("licenseNumber", e.target.value)
                          }
                          disabled={isPending}
                        />
                      </div>

                      {/* Years of Experience */}
                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience">
                          سنوات الخبرة *
                        </Label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          placeholder="10"
                          value={formData.yearsOfExperience}
                          onChange={(e) =>
                            handleInputChange(
                              "yearsOfExperience",
                              e.target.value
                            )
                          }
                          disabled={isPending}
                          min="0"
                          max="70"
                        />
                      </div>
                    </div>

                    {/* Consultation Fees */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="consultationFeeInClinic">
                          سعر الكشف في العيادة (جنيه)
                        </Label>
                        <Input
                          id="consultationFeeInClinic"
                          type="number"
                          placeholder="500"
                          value={formData.consultationFeeInClinic}
                          onChange={(e) =>
                            handleInputChange(
                              "consultationFeeInClinic",
                              e.target.value
                            )
                          }
                          disabled={isPending}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="consultationFeeOnline">
                          سعر الاستشارة أونلاين (جنيه)
                        </Label>
                        <Input
                          id="consultationFeeOnline"
                          type="number"
                          placeholder="300"
                          value={formData.consultationFeeOnline}
                          onChange={(e) =>
                            handleInputChange(
                              "consultationFeeOnline",
                              e.target.value
                            )
                          }
                          disabled={isPending}
                          min="0"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                    disabled={isPending}
                  >
                    <ChevronRight className="ml-2 h-4 w-4" />
                    السابق
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري التسجيل...
                      </>
                    ) : (
                      <>
                        <Check className="ml-2 h-4 w-4" />
                        إنشاء الحساب
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">لديك حساب بالفعل؟ </span>
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              تسجيل الدخول
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}