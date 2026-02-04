// lib/context/auth-context.tsx

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
  const { data, isLoading, isFetching } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/doctors",
    "/about",
    "/contact",
  ];
  
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    // Wait for initial load
    if (!isLoading && !isFetching) {
      const user = data?.data;
      
      // Not authenticated and trying to access protected route
      if (!user && !isPublicRoute) {
        router.push("/login");
      }
      
      // Authenticated and trying to access auth pages
      if (user && (pathname === "/login" || pathname === "/signup")) {
        // Redirect based on role
        if (user.role === "doctor") {
          router.push("/doctor/dashboard");
        } else if (user.role === "patient") {
          router.push("/dashboard");
        } else if (user.role === "admin") {
          router.push("/admin/dashboard");
        }
      }
    }
  }, [data, isLoading, isFetching, isPublicRoute, pathname, router]);

  const value = {
    user: data?.data || null,
    isLoading: isLoading || isFetching,
    isAuthenticated: !!data?.data,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}