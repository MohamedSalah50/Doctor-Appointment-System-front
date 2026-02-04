// lib/api/services/patient.service.ts

import {
  IPatient,
//   IPatientWithUser,
  IResponse,
} from '@/lib/types/api.types';
import { apiClient } from '../client';

export const patientService = {
  // Get my patient profile
  getMyProfile: async () => {
    const response = await apiClient.get<IResponse<IPatient>>('/patients/my-profile');
    return response.data;
  },

  // Update my patient profile
  updateMyProfile: async (data: Partial<IPatient>) => {
    const response = await apiClient.put<IResponse<IPatient>>(
      '/patients/my-profile',
      data
    );
    return response.data;
  },

  // Get patient medical summary
  getMedicalSummary: async () => {
    const response = await apiClient.get<IResponse<{
      patientId: string;
      bloodType?: string;
      allergies: string[];
      chronicDiseases: string[];
      height?: number;
      weight?: number;
      bmi?: number;
    }>>('/patients/medical-summary');
    return response.data;
  },

  // Update medical info
  updateMedicalInfo: async (data: {
    bloodType?: string;
    allergies?: string[];
    chronicDiseases?: string[];
    height?: number;
    weight?: number;
  }) => {
    const response = await apiClient.put<IResponse<IPatient>>(
      '/patients/medical-info',
      data
    );
    return response.data;
  },

  // Update emergency contact
  updateEmergencyContact: async (data: {
    name: string;
    relationship: string;
    phoneNumber: string;
  }) => {
    const response = await apiClient.put<IResponse<IPatient>>(
      '/patients/emergency-contact',
      data
    );
    return response.data;
  },
};