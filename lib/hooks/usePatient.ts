// ==================== PATIENT HOOKS ====================
// lib/hooks/usePatient.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../api/services";
import { AUTH_KEYS } from "./useAuth";

export const PATIENT_KEYS = {
  all: ["patients"] as const,
  myProfile: () => [...PATIENT_KEYS.all, "my-profile"] as const,
  medicalSummary: () => [...PATIENT_KEYS.all, "medical-summary"] as const,
};

// Get my patient profile
export const useMyPatientProfile = () => {
  return useQuery({
    queryKey: PATIENT_KEYS.myProfile(),
    queryFn: () => patientService.getMyProfile(),
  });
};

// Get medical summary
export const useMedicalSummary = () => {
  return useQuery({
    queryKey: PATIENT_KEYS.medicalSummary(),
    queryFn: () => patientService.getMedicalSummary(),
  });
};

// Update my patient profile
export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => patientService.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.myProfile() });
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });
    },
  });
};

// Update medical info
export const useUpdateMedicalInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => patientService.updateMedicalInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.myProfile() });
      queryClient.invalidateQueries({
        queryKey: PATIENT_KEYS.medicalSummary(),
      });
    },
  });
};

// Update emergency contact
export const useUpdateEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => patientService.updateEmergencyContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.myProfile() });
    },
  });
};
