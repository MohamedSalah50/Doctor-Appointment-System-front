// app/auth/signup/page.tsx (COMPLETE FIXED VERSION)

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ChevronRight,
  ChevronLeft,
  Check,
  UserPlus,
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
    consultationFeeInClinic: "",
    consultationFeeOnline: "",
  });

  const handleInputChange = (field: string, value: any) => {
    // ✅ FIX: Remove spaces from password fields
    if (field === 'password' || field === 'confirmPassword') {
      value = value.replace(/\s/g, ''); // Remove all whitespace
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }

    if (formData.fullName.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }

    if (!formData.userName.trim()) {
      toast.error("Please enter a username");
      return false;
    }

    if (formData.userName.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!formData.password) {
      toast.error("Please enter a password");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
      return false;
    }

    // ✅ FIX: Direct comparison (spaces already removed)
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      console.log("Password:", formData.password);
      console.log("Confirm Password:", formData.confirmPassword);
      return false;
    }

    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }

    if (!formData.gender) {
      toast.error("Please select your gender");
      return false;
    }

    if (!formData.dateOfBirth) {
      toast.error("Please enter your date of birth");
      return false;
    }

    // Doctor-specific validation
    if (userType === "doctor") {
      if (!formData.specialty) {
        toast.error("Please select your specialty");
        return false;
      }

      if (!formData.degree) {
        toast.error("Please select your degree");
        return false;
      }

      if (!formData.licenseNumber.trim()) {
        toast.error("Please enter your license number");
        return false;
      }

      if (!formData.yearsOfExperience) {
        toast.error("Please enter years of experience");
        return false;
      }

      const years = parseInt(formData.yearsOfExperience);
      if (years < 0 || years > 70) {
        toast.error("Invalid years of experience");
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
      fullName: formData.fullName.trim(),
      userName: formData.userName.trim(),
      email: formData.email.trim(),
      password: formData.password, // Already has no spaces
      phoneNumber: formData.phoneNumber.trim(),
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
      signupData.licenseNumber = formData.licenseNumber.trim();
      signupData.yearsOfExperience = parseInt(formData.yearsOfExperience);
      
      if (formData.consultationFeeInClinic || formData.consultationFeeOnline) {
        signupData.consultationFee = {
          inClinic: formData.consultationFeeInClinic ? parseFloat(formData.consultationFeeInClinic) : undefined,
          online: formData.consultationFeeOnline ? parseFloat(formData.consultationFeeOnline) : undefined,
        };
      }
    }

    console.log("Signup data:", signupData);

    signup(signupData, {
      onSuccess: () => {
        toast.success(
          userType === "doctor"
            ? "Registration successful! Your account will be reviewed soon"
            : "Registration successful! You can now log in"
        );
        router.push("/auth/login"); // ✅ Fixed route
      },
      onError: (error) => {
        console.error("Signup error:", error);
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <UserPlus className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription className="text-base">
            {userType === "doctor"
              ? "Join as a doctor and manage your practice"
              : "Register as a patient and book appointments"}
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
            Step {step} of 2
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
                Patient
              </TabsTrigger>
              <TabsTrigger value="doctor" className="gap-2">
                <Stethoscope className="h-4 w-4" />
                Doctor
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
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      disabled={isPending}
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="userName">Username *</Label>
                    <Input
                      id="userName"
                      placeholder="john_doe"
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
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10"
                      disabled={isPending}
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-10 pr-10"
                      disabled={isPending}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    At least 6 characters, no spaces
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="pl-10 pr-10"
                      disabled={isPending}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
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
                  Next
                  <ChevronRight className="mr-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Personal & Professional Info */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+1234567890"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        className="pl-10"
                        disabled={isPending}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={GenderEnum.male}>Male</SelectItem>
                        <SelectItem value={GenderEnum.female}>Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      className="pl-10"
                      disabled={isPending}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                {/* Patient-specific fields */}
                {userType === "patient" && (
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type (Optional)</Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) =>
                        handleInputChange("bloodType", value)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
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
                        <Label htmlFor="specialty">Specialty *</Label>
                        <Select
                          value={formData.specialty}
                          onValueChange={(value) =>
                            handleInputChange("specialty", value)
                          }
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
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
                        <Label htmlFor="degree">Degree *</Label>
                        <Select
                          value={formData.degree}
                          onValueChange={(value) =>
                            handleInputChange("degree", value)
                          }
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select degree" />
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
                        <Label htmlFor="licenseNumber">License Number *</Label>
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
                          Years of Experience *
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
                          In-Clinic Fee (Optional)
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
                          Online Fee (Optional)
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
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Create Account
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
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/auth/login"
              className="text-primary font-semibold hover:underline"
            >
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}