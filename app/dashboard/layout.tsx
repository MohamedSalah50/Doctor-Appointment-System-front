// app/dashboard/layout.tsx

"use client";

import { useAuth } from "@/lib/context/auth-context";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  User,
  LogOut,
  Loader2,
  Stethoscope,
  Clock,
  FileText,
  Activity,
} from "lucide-react";
import { useLogout } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { cn, getInitials } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authIsLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(authIsLoading);
  }, [authIsLoading]);

  // Navigation based on role
  const getNavigation = () => {
    const baseNav = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Profile", href: "/dashboard/profile", icon: User },
    ];

    if (user?.role === "patient") {
      return [
        ...baseNav,
        {
          name: "My Appointments",
          href: "/dashboard/appointments",
          icon: Calendar,
        },
        { name: "Find Doctors", href: "/dashboard/doctors", icon: Stethoscope },
        { name: "Clinics", href: "/dashboard/clinics", icon: Building2 },
        {
          name: "Medical Records",
          href: "/dashboard/medical-records",
          icon: FileText,
        },
      ];
    }

    if (user?.role === "doctor") {
      return [
        ...baseNav,
        {
          name: "Appointments",
          href: "/dashboard/appointments",
          icon: Calendar,
        },
        { name: "Schedule", href: "/dashboard/schedule", icon: Clock },
        { name: "Patients", href: "/dashboard/patients", icon: Users },
        { name: "My Clinics", href: "/dashboard/clinics", icon: Building2 },
      ];
    }

    if (user?.role === "admin") {
      return [
        ...baseNav,
        { name: "Users", href: "/dashboard/users", icon: Users },
        { name: "Doctors", href: "/dashboard/doctors", icon: Stethoscope },
        { name: "Clinics", href: "/dashboard/clinics", icon: Building2 },
        { name: "Analytics", href: "/dashboard/analytics", icon: Activity },
      ];
    }

    return baseNav;
  };

  const navigation = getNavigation();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push("/auth/login");
      },
      onError: () => {
        toast.error("Failed to logout");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white shadow-sm">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">MediBook</h1>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || "Dashboard"}
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.fullName ? getInitials(user.fullName) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {user?.role === "doctor" ? "Dr. " : ""}
                  {user?.fullName || "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11",
                      isActive &&
                        "bg-primary/10 text-primary hover:bg-primary/20",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
