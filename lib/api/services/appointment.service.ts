// lib/api/services/appointment.service.ts

import {
  IAppointment,
  IAppointmentWithDetails,
  ICreateAppointmentDto,
  IAppointmentFilters,
  IAppointmentStats,
  IAvailableSlots,
  IResponse,
  IPaginationResponse,
} from '@/lib/types/api.types';
import { apiClient } from '../client';

export const appointmentService = {
  // Book appointment (Patient)
  bookAppointment: async (data: ICreateAppointmentDto) => {
    const response = await apiClient.post<IResponse<IAppointmentWithDetails>>(
      '/appointments',
      data
    );
    return response.data;
  },

  // Get my appointments
  getMyAppointments: async (filters?: IAppointmentFilters) => {
    const response = await apiClient.get<IResponse<IPaginationResponse<IAppointmentWithDetails>>>(
      '/appointments/my-appointments',
      { params: filters }
    );
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId: string) => {
    const response = await apiClient.get<IResponse<IAppointmentWithDetails>>(
      `/appointments/${appointmentId}`
    );
    return response.data;
  },

  // Get available time slots
  getAvailableSlots: async (doctorId: string, date: string) => {
    const response = await apiClient.get<IResponse<IAvailableSlots>>(
      `/doctors/${doctorId}/available-slots`,
      { params: { date } }
    );
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId: string, reason?: string) => {
    const response = await apiClient.put<IResponse<IAppointment>>(
      `/appointments/${appointmentId}/cancel`,
      { reason }
    );
    return response.data;
  },

  // Reschedule appointment
  rescheduleAppointment: async (appointmentId: string, newDate: Date | string) => {
    const response = await apiClient.put<IResponse<IAppointment>>(
      `/appointments/${appointmentId}/reschedule`,
      { newDate }
    );
    return response.data;
  },

  // ==================== DOCTOR ENDPOINTS ====================

  // Confirm appointment (Doctor)
  confirmAppointment: async (appointmentId: string) => {
    const response = await apiClient.put<IResponse<IAppointment>>(
      `/appointments/${appointmentId}/confirm`
    );
    return response.data;
  },

  // Complete appointment (Doctor)
  completeAppointment: async (
    appointmentId: string,
    data: {
      diagnosis?: string;
      treatmentPlan?: string;
      doctorNotes?: string;
      nextFollowUpDate?: Date | string;
    }
  ) => {
    const response = await apiClient.put<IResponse<IAppointment>>(
      `/appointments/${appointmentId}/complete`,
      data
    );
    return response.data;
  },

  // Mark as no-show (Doctor)
  markAsNoShow: async (appointmentId: string) => {
    const response = await apiClient.put<IResponse<IAppointment>>(
      `/appointments/${appointmentId}/no-show`
    );
    return response.data;
  },

  // Get doctor's appointments
  getDoctorAppointments: async (filters?: IAppointmentFilters) => {
    const response = await apiClient.get<IResponse<IPaginationResponse<IAppointmentWithDetails>>>(
      '/doctors/appointments',
      { params: filters }
    );
    return response.data;
  },

  // Get appointment stats
  getAppointmentStats: async () => {
    const response = await apiClient.get<IResponse<IAppointmentStats>>(
      '/appointments/stats'
    );
    return response.data;
  },
};