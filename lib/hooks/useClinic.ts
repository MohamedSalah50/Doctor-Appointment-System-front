// lib/hooks/useClinic.ts

import { useQuery } from "@tanstack/react-query";
import { clinicService } from "../api/services";

export const CLINIC_KEYS = {
  all: ["clinics"] as const,
  lists: () => [...CLINIC_KEYS.all, "list"] as const,
  list: (filters?: any) => [...CLINIC_KEYS.lists(), filters] as const,
  details: () => [...CLINIC_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CLINIC_KEYS.details(), id] as const,
  nearby: (lat: number, lng: number) =>
    [...CLINIC_KEYS.all, "nearby", lat, lng] as const,
  doctors: (id: string) => [...CLINIC_KEYS.all, "doctors", id] as const,
};

// Get all clinics
export const useClinics = (filters?: any) => {
  return useQuery({
    queryKey: CLINIC_KEYS.list(filters),
    queryFn: () => clinicService.getAllClinics(filters),
  });
};

// Get clinic by ID
export const useClinic = (clinicId: string) => {
  return useQuery({
    queryKey: CLINIC_KEYS.detail(clinicId),
    queryFn: () => clinicService.getClinicById(clinicId),
    enabled: !!clinicId,
  });
};

// Get nearby clinics
export const useNearbyClinics = (
  lat: number,
  lng: number,
  maxDistance?: number,
) => {
  return useQuery({
    queryKey: CLINIC_KEYS.nearby(lat, lng),
    queryFn: () => clinicService.getNearbyClinics(lat, lng, maxDistance),
    enabled: !!lat && !!lng,
  });
};

// Get clinic doctors
export const useClinicDoctors = (clinicId: string) => {
  return useQuery({
    queryKey: CLINIC_KEYS.doctors(clinicId),
    queryFn: () => clinicService.getClinicDoctors(clinicId),
    enabled: !!clinicId,
  });
};

// Search clinics
export const useSearchClinics = (query: string, filters?: any) => {
  return useQuery({
    queryKey: [...CLINIC_KEYS.all, "search", query, filters],
    queryFn: () => clinicService.searchClinics(query, filters),
    enabled: !!query && query.length >= 2,
  });
};
