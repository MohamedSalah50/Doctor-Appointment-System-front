// lib/api/services/clinic.service.ts

import {
  IClinic,
  IClinicWithDoctors,
  IDoctorPublicProfile,
  IResponse,
  IPaginationResponse,
} from '@/lib/types/api.types';
import { apiClient } from '../client';

export const clinicService = {
  // Get all clinics
  getAllClinics: async (filters?: {
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<IResponse<IPaginationResponse<IClinic>>>(
      '/clinics',
      { params: filters }
    );
    return response.data;
  },

  // Get clinic by ID
  getClinicById: async (clinicId: string) => {
    const response = await apiClient.get<IResponse<IClinicWithDoctors>>(
      `/clinics/${clinicId}`
    );
    return response.data;
  },

  // Get nearby clinics
  getNearbyClinics: async (lat: number, lng: number, maxDistance?: number) => {
    const response = await apiClient.get<IResponse<IClinic[]>>(
      '/clinics/nearby',
      {
        params: {
          lat,
          lng,
          maxDistance: maxDistance || 5000, // 5km default
        },
      }
    );
    return response.data;
  },

  // Get clinic doctors
  getClinicDoctors: async (clinicId: string) => {
    const response = await apiClient.get<IResponse<IDoctorPublicProfile[]>>(
      `/clinics/${clinicId}/doctors`
    );
    return response.data;
  },

  // Search clinics
  searchClinics: async (query: string, filters?: { city?: string }) => {
    const response = await apiClient.get<IResponse<IPaginationResponse<IClinic>>>(
      '/clinics',
      { params: { search: query, ...filters } }
    );
    return response.data;
  },
};