// lib/hooks/useAppointment.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../api/services';
import { ICreateAppointmentDto, IAppointmentFilters } from '../types/api.types';

export const APPOINTMENT_KEYS = {
  all: ['appointments'] as const,
  lists: () => [...APPOINTMENT_KEYS.all, 'list'] as const,
  list: (filters?: IAppointmentFilters) => [...APPOINTMENT_KEYS.lists(), filters] as const,
  details: () => [...APPOINTMENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...APPOINTMENT_KEYS.details(), id] as const,
  myAppointments: (filters?: IAppointmentFilters) =>
    [...APPOINTMENT_KEYS.all, 'my-appointments', filters] as const,
  doctorAppointments: (filters?: IAppointmentFilters) =>
    [...APPOINTMENT_KEYS.all, 'doctor-appointments', filters] as const,
  availableSlots: (doctorId: string, date: string) =>
    [...APPOINTMENT_KEYS.all, 'available-slots', doctorId, date] as const,
  stats: () => [...APPOINTMENT_KEYS.all, 'stats'] as const,
};

// Get my appointments (Patient)
export const useMyAppointments = (filters?: IAppointmentFilters) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.myAppointments(filters),
    queryFn: () => appointmentService.getMyAppointments(filters),
  });
};

// Get doctor's appointments
export const useDoctorAppointments = (filters?: IAppointmentFilters) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.doctorAppointments(filters),
    queryFn: () => appointmentService.getDoctorAppointments(filters),
  });
};

// Get appointment by ID
export const useAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.detail(appointmentId),
    queryFn: () => appointmentService.getAppointmentById(appointmentId),
    enabled: !!appointmentId,
  });
};

// Get available slots
export const useAvailableSlots = (doctorId: string, date: string) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.availableSlots(doctorId, date),
    queryFn: () => appointmentService.getAvailableSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });
};

// Get appointment stats
export const useAppointmentStats = () => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.stats(),
    queryFn: () => appointmentService.getAppointmentStats(),
  });
};

// Book appointment
export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateAppointmentDto) =>
      appointmentService.bookAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.myAppointments() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.stats() });
    },
  });
};

// Cancel appointment
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason?: string }) =>
      appointmentService.cancelAppointment(appointmentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.myAppointments() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.doctorAppointments() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.stats() });
    },
  });
};

// Reschedule appointment
export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, newDate }: { appointmentId: string; newDate: Date | string }) =>
      appointmentService.rescheduleAppointment(appointmentId, newDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.myAppointments() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.doctorAppointments() });
    },
  });
};

// Confirm appointment (Doctor)
export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentService.confirmAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.doctorAppointments() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.stats() });
    },
  });
};

// Complete appointment (Doctor)
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, data }: { appointmentId: string; data: any }) =>
      appointmentService.completeAppointment(appointmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.doctorAppointments() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.stats() });
    },
  });
};

// Mark as no-show (Doctor)
export const useMarkAsNoShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentService.markAsNoShow(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.doctorAppointments() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.stats() });
    },
  });
};