// lib/api/services/doctor.service.ts

import {
  IDoctor,
  IDoctorPublicProfile,
  IDoctorSearchFilters,
  IDoctorStats,
  IResponse,
  IPaginationResponse,
} from '@/lib/types/api.types';
import { apiClient } from '../client';

export const doctorService = {
  // Get all doctors with filters
  getAllDoctors: async (filters?: IDoctorSearchFilters) => {
    const response = await apiClient.get<IResponse<IPaginationResponse<IDoctorPublicProfile>>>(
      '/doctors',
      { params: filters }
    );
    return response.data;
  },

  // Get doctor by ID (public profile)
  getDoctorById: async (doctorId: string) => {
    const response = await apiClient.get<IResponse<IDoctorPublicProfile>>(
      `/doctors/${doctorId}`
    );
    return response.data;
  },

  // Get my doctor profile (for logged-in doctors)
  getMyProfile: async () => {
    const response = await apiClient.get<IResponse<IDoctor>>('/doctors/my-profile');
    return response.data;
  },

  // Update my doctor profile
  updateMyProfile: async (data: Partial<IDoctor>) => {
    const response = await apiClient.put<IResponse<IDoctor>>(
      '/doctors/my-profile',
      data
    );
    return response.data;
  },

  // Get doctor stats (for logged-in doctors)
  getMyStats: async () => {
    const response = await apiClient.get<IResponse<IDoctorStats>>('/doctors/my-stats');
    return response.data;
  },

  // Search doctors
  searchDoctors: async (query: string, filters?: IDoctorSearchFilters) => {
    const response = await apiClient.get<IResponse<IPaginationResponse<IDoctorPublicProfile>>>(
      '/doctors/search',
      { params: { search: query, ...filters } }
    );
    return response.data;
  },

  // Get top-rated doctors
  getTopRatedDoctors: async (limit: number = 10) => {
    const response = await apiClient.get<IResponse<IDoctorPublicProfile[]>>(
      '/doctors/top-rated',
      { params: { limit } }
    );
    return response.data;
  },

  // Get doctors by specialty
  getDoctorsBySpecialty: async (specialty: string, filters?: IDoctorSearchFilters) => {
    const response = await apiClient.get<IResponse<IPaginationResponse<IDoctorPublicProfile>>>(
      '/doctors',
      { params: { specialty, ...filters } }
    );
    return response.data;
  },
};