// lib/api/services/schedule.service.ts

import {
  ISchedule,
  ICreateScheduleDto,
  IWorkingHours,
  IResponse,
} from '@/lib/types/api.types';
import { apiClient } from '../client';

export const scheduleService = {
  // Create schedule
  createSchedule: async (data: ICreateScheduleDto) => {
    const response = await apiClient.post<IResponse<ISchedule>>('/schedules', data);
    return response.data;
  },

  // Get my schedules (Doctor)
  getMySchedules: async () => {
    const response = await apiClient.get<IResponse<ISchedule[]>>('/schedules/my-schedules');
    return response.data;
  },

  // Get schedule by ID
  getScheduleById: async (scheduleId: string) => {
    const response = await apiClient.get<IResponse<ISchedule>>(
      `/schedules/${scheduleId}`
    );
    return response.data;
  },

  // Update schedule
  updateSchedule: async (scheduleId: string, data: Partial<ISchedule>) => {
    const response = await apiClient.put<IResponse<ISchedule>>(
      `/schedules/${scheduleId}`,
      data
    );
    return response.data;
  },

  // Delete schedule
  deleteSchedule: async (scheduleId: string) => {
    const response = await apiClient.delete<IResponse>(`/schedules/${scheduleId}`);
    return response.data;
  },

  // Add exception (holiday/custom hours)
  addException: async (
    scheduleId: string,
    exception: {
      date: Date | string;
      reason: string;
      isAvailable: boolean;
      customWorkingHours?: IWorkingHours;
    }
  ) => {
    const response = await apiClient.post<IResponse<ISchedule>>(
      `/schedules/${scheduleId}/exceptions`,
      exception
    );
    return response.data;
  },

  // Remove exception
  removeException: async (scheduleId: string, exceptionDate: string) => {
    const response = await apiClient.delete<IResponse<ISchedule>>(
      `/schedules/${scheduleId}/exceptions/${exceptionDate}`
    );
    return response.data;
  },
};