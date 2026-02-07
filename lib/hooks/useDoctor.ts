// lib/hooks/useDoctor.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '../api/services';
import { IDoctorSearchFilters } from '../types/api.types';

export const DOCTOR_KEYS = {
  all: ['doctors'] as const,
  lists: () => [...DOCTOR_KEYS.all, 'list'] as const,
  list: (filters?: IDoctorSearchFilters) => [...DOCTOR_KEYS.lists(), filters] as const,
  details: () => [...DOCTOR_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...DOCTOR_KEYS.details(), id] as const,
  myProfile: () => [...DOCTOR_KEYS.all, 'my-profile'] as const,
  myStats: () => [...DOCTOR_KEYS.all, 'my-stats'] as const,
  topRated: (limit?: number) => [...DOCTOR_KEYS.all, 'top-rated', limit] as const,
  bySpecialty: (specialty: string) => [...DOCTOR_KEYS.all, 'specialty', specialty] as const,
};

// Get all doctors
export const useDoctors = (filters?: IDoctorSearchFilters) => {
  return useQuery({
    queryKey: DOCTOR_KEYS.list(filters),
    queryFn: () => doctorService.getAllDoctors(filters),
  });
};

// Get doctor by ID
export const useDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: DOCTOR_KEYS.detail(doctorId),
    queryFn: () => doctorService.getDoctorById(doctorId),
    enabled: !!doctorId,
  });
};

// Get my doctor profile
export const useMyDoctorProfile = () => {
  return useQuery({
    queryKey: DOCTOR_KEYS.myProfile(),
    queryFn: () => doctorService.getMyProfile(),
  });
};

// Get my doctor stats
export const useMyDoctorStats = () => {
  return useQuery({
    queryKey: DOCTOR_KEYS.myStats(),
    queryFn: () => doctorService.getMyStats(),
  });
};

// Update my doctor profile
export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => doctorService.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.myProfile() });
    },
  });
};

// Search doctors
export const useSearchDoctors = (query: string, filters?: IDoctorSearchFilters) => {
  return useQuery({
    queryKey: [...DOCTOR_KEYS.all, 'search', query, filters],
    queryFn: () => doctorService.searchDoctors(query, filters),
    enabled: !!query && query.length >= 2,
  });
};

// Get top-rated doctors
export const useTopRatedDoctors = (limit: number = 10) => {
  return useQuery({
    queryKey: DOCTOR_KEYS.topRated(limit),
    queryFn: () => doctorService.getTopRatedDoctors(limit),
  });
};

// Get doctors by specialty
export const useDoctorsBySpecialty = (specialty: string, filters?: IDoctorSearchFilters) => {
  return useQuery({
    queryKey: DOCTOR_KEYS.bySpecialty(specialty),
    queryFn: () => doctorService.getDoctorsBySpecialty(specialty, filters),
    enabled: !!specialty,
  });
};