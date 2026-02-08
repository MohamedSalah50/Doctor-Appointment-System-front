// lib/context/auth-context.tsx (FINAL FIX)

"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/useAuth";
import { IUser } from "@/lib/types/api.types";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isFetching, error } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/doctors",
    "/about",
    "/contact",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if we have a token
  const hasToken = typeof window !== 'undefined' &&
    !!localStorage.getItem('access_token');

  useEffect(() => {
    console.log("AuthContext useEffect triggered");
    console.log("isLoading:", isLoading);
    console.log("isFetching:", isFetching);
    console.log("hasToken:", hasToken);
    console.log("pathname:", pathname);
    console.log("user:", data?.data);
    console.log("error:", error);

    // ✅ FIX: Wait for loading AND fetching to complete
    if (isLoading || isFetching) {
      console.log("Still loading user data, waiting...");
      return; // Don't do anything while loading
    }

    const user = data?.data;

    // ✅ FIX: Check if we have token but no user and got error
    if (hasToken && !user && error) {
      console.log("Token exists but failed to get user, clearing tokens...");
      // Token might be invalid, clear it
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (!isPublicRoute) {
        router.push("/auth/login");
      }
      return;
    }

    // Not authenticated (no token or no user) and trying to access protected route
    if ((!hasToken || !user) && !isPublicRoute) {
      console.log("Not authenticated, redirecting to login...");
      router.push("/auth/login");
      return;
    }

    // Authenticated and trying to access auth pages
    if (user && (pathname === "/auth/login" || pathname === "/auth/signup")) {
      console.log("User authenticated, redirecting from auth page...");
      // Redirect based on role
      if (user.role === "doctor") {
        console.log("Redirecting doctor to dashboard...");
        router.push("/doctor/dashboard");
      } else if (user.role === "patient") {
        console.log("Redirecting patient to dashboard...");
        router.push("/patient/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      }
      return;
    }

    // Authenticated on root page
    if (user && pathname === "/") {
      console.log("User on root, redirecting based on role...");
      if (user.role === "doctor") {
        router.push("/doctor/dashboard");
      } else if (user.role === "patient") {
        router.push("/patient/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      }
      return;
    }

    // Check role-based access for authenticated users
    if (user) {
      // Doctor trying to access patient routes
      if (user.role === "doctor" && pathname.startsWith("/patient")) {
        console.log("Doctor accessing patient route, redirecting...");
        router.push("/doctor/dashboard");
        return;
      }

      // Patient trying to access doctor routes
      if (user.role === "patient" && pathname.startsWith("/doctor")) {
        console.log("Patient accessing doctor route, redirecting...");
        router.push("/patient/dashboard");
        return;
      }
    }
  }, [data, isLoading, isFetching, error, hasToken, isPublicRoute, pathname, router]);

  const value = {
    user: data?.data || null,
    isLoading: isLoading || isFetching,
    isAuthenticated: !!data?.data && hasToken,
  };

  // ✅ Show loading screen while fetching user data
  if ((isLoading || isFetching) && hasToken) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}