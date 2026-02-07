// lib/hooks/useSchedule.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../api/services';
import { ICreateScheduleDto, IWorkingHours } from '../types/api.types';

export const SCHEDULE_KEYS = {
  all: ['schedules'] as const,
  lists: () => [...SCHEDULE_KEYS.all, 'list'] as const,
  mySchedules: () => [...SCHEDULE_KEYS.all, 'my-schedules'] as const,
  details: () => [...SCHEDULE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SCHEDULE_KEYS.details(), id] as const,
};

// Get my schedules
export const useMySchedules = () => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.mySchedules(),
    queryFn: () => scheduleService.getMySchedules(),
  });
};

// Get schedule by ID
export const useSchedule = (scheduleId: string) => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.detail(scheduleId),
    queryFn: () => scheduleService.getScheduleById(scheduleId),
    enabled: !!scheduleId,
  });
};

// Create schedule
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateScheduleDto) => scheduleService.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.mySchedules() });
    },
  });
};

// Update schedule
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: string; data: any }) =>
      scheduleService.updateSchedule(scheduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.mySchedules() });
    },
  });
};

// Delete schedule
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => scheduleService.deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.mySchedules() });
    },
  });
};

// Add exception
export const useAddException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scheduleId,
      exception,
    }: {
      scheduleId: string;
      exception: {
        date: Date | string;
        reason: string;
        isAvailable: boolean;
        customWorkingHours?: IWorkingHours;
      };
    }) => scheduleService.addException(scheduleId, exception),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.mySchedules() });
    },
  });
};

// Remove exception
export const useRemoveException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, exceptionDate }: { scheduleId: string; exceptionDate: string }) =>
      scheduleService.removeException(scheduleId, exceptionDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.mySchedules() });
    },
  });
};