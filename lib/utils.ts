// lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistance } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * Tailwind CSS class merger
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Arabic
 */
export function formatDateAr(date: Date | string, formatStr: string = 'PPP') {
  return format(new Date(date), formatStr, { locale: ar });
}

/**
 * Format relative time in Arabic
 */
export function formatRelativeAr(date: Date | string) {
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale: ar,
  });
}

/**
 * Format price in EGP
 */
export function formatPrice(price: number) {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Get specialty label in Arabic
 */
export function getSpecialtyLabel(specialty: string): string {
  const labels: Record<string, string> = {
    general_practice: 'طب عام',
    internal_medicine: 'باطنة',
    family_medicine: 'طب الأسرة',
    general_surgery: 'جراحة عامة',
    cardiac_surgery: 'جراحة القلب',
    neurosurgery: 'جراحة المخ والأعصاب',
    orthopedic_surgery: 'جراحة العظام',
    plastic_surgery: 'جراحة تجميل',
    gynecology: 'نساء وتوليد',
    obstetrics: 'توليد',
    pediatrics: 'أطفال',
    neonatology: 'حديثي الولادة',
    radiology: 'أشعة',
    pathology: 'باثولوجيا',
    laboratory_medicine: 'طب المختبرات',
    cardiology: 'قلب',
    dermatology: 'جلدية',
    neurology: 'مخ وأعصاب',
    psychiatry: 'طب نفسي',
    ophthalmology: 'عيون',
    ent: 'أنف وأذن وحنجرة',
    urology: 'مسالك بولية',
    gastroenterology: 'جهاز هضمي',
    pulmonology: 'صدر وجهاز تنفسي',
    nephrology: 'كلى',
    endocrinology: 'غدد صماء',
    rheumatology: 'روماتيزم',
    oncology: 'أورام',
    dentistry: 'أسنان',
    physical_therapy: 'علاج طبيعي',
  };
  return labels[specialty] || specialty;
}

/**
 * Get appointment status label in Arabic
 */
export function getAppointmentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    cancelled: 'ملغى',
    completed: 'مكتمل',
    no_show: 'لم يحضر',
    rescheduled: 'تم إعادة الجدولة',
  };
  return labels[status] || status;
}

/**
 * Get appointment status color
 */
export function getAppointmentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    no_show: 'bg-gray-100 text-gray-800',
    rescheduled: 'bg-purple-100 text-purple-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get consultation mode label in Arabic
 */
export function getConsultationModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    in_clinic: 'في العيادة',
    online: 'أونلاين',
    home_visit: 'زيارة منزلية',
  };
  return labels[mode] || mode;
}

/**
 * Get appointment type label in Arabic
 */
export function getAppointmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    checkup: 'كشف عادي',
    follow_up: 'متابعة',
    consultation: 'استشارة',
    emergency: 'طارئ',
    surgery: 'عملية',
    vaccination: 'تطعيم',
    lab_test: 'تحليل',
    imaging: 'أشعة',
  };
  return labels[type] || type;
}

/**
 * Get day of week label in Arabic
 */
export function getDayLabel(day: number): string {
  const labels = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return labels[day] || '';
}

/**
 * Format time from "HH:MM" to Arabic
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const period = h >= 12 ? 'م' : 'ص';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

/**
 * Calculate BMI
 */
export function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): {
  label: string;
  color: string;
} {
  if (bmi < 18.5) {
    return { label: 'نحيف', color: 'text-blue-600' };
  } else if (bmi < 25) {
    return { label: 'طبيعي', color: 'text-green-600' };
  } else if (bmi < 30) {
    return { label: 'زيادة وزن', color: 'text-yellow-600' };
  } else {
    return { label: 'سمنة', color: 'text-red-600' };
  }
}

/**
 * Validate Egyptian phone number
 */
export function isValidEgyptianPhone(phone: string): boolean {
  // Egyptian phone: +20XXXXXXXXXX or 01XXXXXXXXX
  const regex = /^(\+20|0)?1[0125][0-9]{8}$/;
  return regex.test(phone.replace(/\s/g, ''));
}

/**
 * Format Egyptian phone number
 */
export function formatEgyptianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('20')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
  return new Date(date) < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string): boolean {
  return new Date(date) > new Date();
}

/**
 * Get error message from API error
 */
export function getErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'حدث خطأ غير متوقع';
}