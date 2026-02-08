// lib/hooks/useAuth.ts (WITH DEBUG LOGS)

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { authService } from '../api/services';
import { ILoginCredentials, ISignupData } from '../types/api.types';

// ==================== QUERY KEYS ====================

export const AUTH_KEYS = {
  currentUser: ['auth', 'current-user'] as const,
};

// ==================== GET CURRENT USER ====================

export const useCurrentUser = () => {
  const hasToken =
    typeof window !== 'undefined' && !!localStorage.getItem('access_token');
  
  console.log("useCurrentUser - hasToken:", hasToken);
  
  return useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: async () => {
      console.log("useCurrentUser - queryFn running...");
      try {
        const result = await authService.getCurrentUser();
        console.log("useCurrentUser - result:", result);
        return result;
      } catch (error) {
        console.error("useCurrentUser - error:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled: hasToken,
  });
};

// ==================== LOGIN ====================

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: ILoginCredentials) => {
      console.log("useLogin - mutationFn called with:", credentials);
      return authService.login(credentials);
    },
    
    onSuccess: (data) => {
      console.log("useLogin - onSuccess triggered");
      console.log("useLogin - response data:", data);
      
      const credentials = data.data?.credentials;
      
      console.log("useLogin - extracted credentials:", credentials);
      
      if (credentials?.access_token && credentials?.refresh_token) {
        console.log("useLogin - saving tokens...");
        
        apiClient.setToken(credentials.access_token);
        apiClient.setRefreshToken(credentials.refresh_token);
        
        console.log("useLogin - tokens saved");
        console.log("useLogin - access_token:", credentials.access_token.substring(0, 30) + "...");
        
        console.log("useLogin - invalidating currentUser query...");
        queryClient.invalidateQueries({ 
          queryKey: AUTH_KEYS.currentUser 
        });
        
        console.log("useLogin - query invalidated, should trigger refetch");
      } else {
        console.error("useLogin - no credentials in response:", data);
      }
    },
    
    onError: (error) => {
      console.error("useLogin - onError:", error);
    },
  });
};

// ==================== SIGNUP ====================

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: ISignupData) => authService.signup(data),
  });
};

// ==================== LOGOUT ====================

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    
    onSuccess: () => {
      apiClient.clearTokens();
      queryClient.clear();
    },
  });
};

// ==================== UPDATE PROFILE ====================

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      authService.updateProfile(userId, data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: AUTH_KEYS.currentUser 
      });
    },
  });
};

// ==================== CHANGE PASSWORD ====================

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      authService.changePassword(data),
  });
};