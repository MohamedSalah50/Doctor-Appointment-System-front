// lib/context/auth-context.tsx (UPDATED - Single Dashboard)

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
    console.log("user:", data);
    console.log("data", data);
    console.log("error:", error);

    // ✅ Wait for loading AND fetching to complete
    if (isLoading || isFetching) {
      console.log("Still loading user data, waiting...");
      return;
    }

    const user = data;

    // ✅ Check if we have token but no user and got error
    if (hasToken && !user && error) {
      console.log("Token exists but failed to get user, clearing tokens...");
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (!isPublicRoute) {
        router.push("/auth/login");
      }
      return;
    }

    // Not authenticated and trying to access protected route
    if ((!hasToken || !user) && !isPublicRoute) {
      console.log("Not authenticated, redirecting to login...");
      router.push("/auth/login");
      return;
    }
    
    // ✅ Authenticated and on auth pages → redirect to /dashboard
    if (user && (pathname === "/auth/login" || pathname === "/auth/signup")) {
      console.log("User authenticated, redirecting to dashboard...");
      router.push("/dashboard");
      return;
    }

    // ✅ Authenticated on root page → redirect to /dashboard
    if (user && pathname === "/") {
      console.log("User on root, redirecting to dashboard...");
      router.push("/dashboard");
      return;
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