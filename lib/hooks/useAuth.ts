// lib/hooks/useAuth.ts (FIXED)

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
  
  return useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled: hasToken,
  });
};

// ==================== LOGIN ====================

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: ILoginCredentials) => 
      authService.login(credentials),
    
    onSuccess: (data) => {
      console.log("useLogin onSuccess - data:", data);
      
      // ✅ FIX: New structure is { message, data: { credentials: { access_token, refresh_token } }, status }
      const credentials = data.data?.credentials;
      
      if (credentials?.access_token && credentials?.refresh_token) {
        console.log("Saving tokens...");
        
        // ✅ Save tokens with new field names
        apiClient.setToken(credentials.access_token);
        apiClient.setRefreshToken(credentials.refresh_token);
        
        console.log("Tokens saved successfully");
        console.log("Access token:", credentials.access_token.substring(0, 20) + "...");
        
        // Invalidate current user to trigger refetch with new token
        queryClient.invalidateQueries({ 
          queryKey: AUTH_KEYS.currentUser 
        });
      } else {
        console.error("No credentials in response:", data);
      }
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