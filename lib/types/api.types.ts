// lib/types/api.types.ts

// ==================== ENUMS ====================

export enum RoleEnum {
  patient = 'patient',
  doctor = 'doctor',
  admin = 'admin',
}

export enum GenderEnum {
  male = 'male',
  female = 'female',
}

export enum BloodTypeEnum {
  'A+' = 'A+',
  'A-' = 'A-',
  'B+' = 'B+',
  'B-' = 'B-',
  'AB+' = 'AB+',
  'AB-' = 'AB-',
  'O+' = 'O+',
  'O-' = 'O-',
}

export enum SpecialtyEnum {
  generalPractice = 'general_practice',
  internalMedicine = 'internal_medicine',
  familyMedicine = 'family_medicine',
  generalSurgery = 'general_surgery',
  cardiacSurgery = 'cardiac_surgery',
  neurosurgery = 'neurosurgery',
  orthopedicSurgery = 'orthopedic_surgery',
  plasticSurgery = 'plastic_surgery',
  gynecology = 'gynecology',
  obstetrics = 'obstetrics',
  pediatrics = 'pediatrics',
  neonatology = 'neonatology',
  radiology = 'radiology',
  pathology = 'pathology',
  laboratoryMedicine = 'laboratory_medicine',
  cardiology = 'cardiology',
  dermatology = 'dermatology',
  neurology = 'neurology',
  psychiatry = 'psychiatry',
  ophthalmology = 'ophthalmology',
  ent = 'ent',
  urology = 'urology',
  gastroenterology = 'gastroenterology',
  pulmonology = 'pulmonology',
  nephrology = 'nephrology',
  endocrinology = 'endocrinology',
  rheumatology = 'rheumatology',
  oncology = 'oncology',
  dentistry = 'dentistry',
  physicalTherapy = 'physical_therapy',
}

export enum DegreeEnum {
  md = 'MD',
  mbbs = 'MBBS',
  phd = 'PhD',
  mbbch = 'MBBCh',
  msc = 'MSc',
  fellowship = 'Fellowship',
  diploma = 'Diploma',
}

export enum AppointmentStatusEnum {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
  completed = 'completed',
  noShow = 'no_show',
  rescheduled = 'rescheduled',
}

export enum AppointmentTypeEnum {
  checkup = 'checkup',
  followUp = 'follow_up',
  consultation = 'consultation',
  emergency = 'emergency',
  surgery = 'surgery',
  vaccination = 'vaccination',
  labTest = 'lab_test',
  imaging = 'imaging',
}

export enum ConsultationModeEnum {
  inClinic = 'in_clinic',
  online = 'online',
  homeVisit = 'home_visit',
}

export enum DayOfWeekEnum {
  sunday = 0,
  monday = 1,
  tuesday = 2,
  wednesday = 3,
  thursday = 4,
  friday = 5,
  saturday = 6,
}

export enum ScheduleStatusEnum {
  active = 'active',
  inactive = 'inactive',
  holiday = 'holiday',
}

export enum PaymentStatusEnum {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
  refunded = 'refunded',
  cancelled = 'cancelled',
}

export enum PaymentMethodEnum {
  cash = 'cash',
  creditCard = 'credit_card',
  debitCard = 'debit_card',
  insurance = 'insurance',
  mobileWallet = 'mobile_wallet',
}

// ==================== BASE INTERFACES ====================

export interface IResponse<T = any> {
  message?: string;
  status?: number;
  data?: T;
}

export interface IPaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==================== USER INTERFACES ====================

export interface IUser {
  _id?: string;
  id?: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  gender?: GenderEnum;
  dateOfBirth?: Date | string;
  role: RoleEnum;
  isActive: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  lastLoginAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ISignupData {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: RoleEnum;
  gender?: GenderEnum;
  dateOfBirth?: Date | string;
  
  // Patient-specific
  bloodType?: BloodTypeEnum;
  
  // Doctor-specific
  specialty?: SpecialtyEnum;
  degree?: DegreeEnum;
  licenseNumber?: string;
  yearsOfExperience?: number;
  consultationFee?: {
    inClinic?: number;
    online?: number;
  };
}

export interface ILoginResponse {
  user: IUser;
  profile?: IPatient | IDoctor;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// ==================== PATIENT INTERFACES ====================

export interface IPatient {
  _id?: string;
  userId: string;
  bloodType?: BloodTypeEnum;
  allergies?: string[];
  chronicDiseases?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceExpiryDate?: Date | string;
  height?: number;
  weight?: number;
  bmi?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferredLanguage?: 'ar' | 'en';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IPatientWithUser extends IPatient {
  user: IUser;
}

// ==================== DOCTOR INTERFACES ====================

export interface IDoctor {
  _id?: string;
  userId: string;
  specialty: SpecialtyEnum;
  subSpecialties?: SpecialtyEnum[];
  degree: DegreeEnum;
  licenseNumber: string;
  yearsOfExperience: number;
  bio?: string;
  about?: string;
  languages?: string[];
  education?: {
    degree: string;
    institution: string;
    year: number;
    country?: string;
  }[];
  certifications?: {
    title: string;
    issuedBy: string;
    issuedDate: Date | string;
    expiryDate?: Date | string;
  }[];
  consultationModes: ConsultationModeEnum[];
  consultationFee: {
    inClinic?: number;
    online?: number;
    homeVisit?: number;
    followUp?: number;
  };
  sessionDuration: number;
  clinics?: string[];
  status: string;
  isAcceptingNewPatients: boolean;
  isVerified: boolean;
  rating?: number;
  totalReviews?: number;
  totalPatients?: number;
  totalAppointments?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IDoctorWithUser extends IDoctor {
  user: IUser;
}

export interface IDoctorPublicProfile {
  id: string;
  fullName: string;
  avatar?: string;
  specialty: SpecialtyEnum;
  subSpecialties?: SpecialtyEnum[];
  degree: DegreeEnum;
  yearsOfExperience: number;
  bio?: string;
  languages?: string[];
  consultationModes: ConsultationModeEnum[];
  consultationFee: {
    inClinic?: number;
    online?: number;
    homeVisit?: number;
  };
  sessionDuration: number;
  rating?: number;
  totalReviews?: number;
  isAcceptingNewPatients: boolean;
  isVerified: boolean;
  clinics?: {
    id: string;
    name: string;
    address: string;
  }[];
}

// ==================== APPOINTMENT INTERFACES ====================

export interface IAppointment {
  _id?: string;
  patientId: string;
  doctorId: string;
  clinicId?: string;
  appointmentNumber: string;
  scheduledDate: Date | string;
  appointmentType: AppointmentTypeEnum;
  consultationMode: ConsultationModeEnum;
  duration: number;
  status: AppointmentStatusEnum;
  confirmedAt?: Date | string;
  completedAt?: Date | string;
  cancelledAt?: Date | string;
  cancelledBy?: string;
  cancellationReason?: string;
  consultationFee: number;
  platformFee: number;
  totalFee: number;
  isPaid: boolean;
  paymentId?: string;
  chiefComplaint?: string;
  symptoms?: string[];
  patientNotes?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  doctorNotes?: string;
  isFollowUp: boolean;
  previousAppointmentId?: string;
  nextFollowUpDate?: Date | string;
  meetingLink?: string;
  reminderSent: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IAppointmentWithDetails extends IAppointment {
  patient: IUser;
  doctor: IUser & { specialty?: SpecialtyEnum; degree?: DegreeEnum };
  clinic?: IClinic;
}

export interface ICreateAppointmentDto {
  doctorUserId: string;
  clinicId?: string;
  scheduledDate: Date | string;
  appointmentType: AppointmentTypeEnum;
  consultationMode: ConsultationModeEnum;
  chiefComplaint?: string;
  symptoms?: string[];
  patientNotes?: string;
  isFollowUp?: boolean;
  previousAppointmentId?: string;
}

// ==================== SCHEDULE INTERFACES ====================

export interface IWorkingHours {
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  breakStartTime?: string;
  breakEndTime?: string;
}

export interface ISchedule {
  _id?: string;
  doctorId: string;
  clinicId?: string;
  isRecurring: boolean;
  dayOfWeek?: DayOfWeekEnum;
  workingHours?: IWorkingHours;
  specificDate?: Date | string;
  specificDateWorkingHours?: IWorkingHours;
  consultationMode: ConsultationModeEnum;
  slotDuration: number;
  bufferTime: number;
  maxPatientsPerSlot: number;
  maxAppointmentsPerDay?: number;
  status: ScheduleStatusEnum;
  exceptions?: {
    date: Date | string;
    reason: string;
    isAvailable: boolean;
    customWorkingHours?: IWorkingHours;
  }[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ITimeSlot {
  startTime: Date | string;
  endTime: Date | string;
  isAvailable: boolean;
  isBooked?: boolean;
  isPast?: boolean;
}

export interface IAvailableSlots {
  date: Date | string;
  slots: ITimeSlot[];
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  message?: string;
}

export interface ICreateScheduleDto {
  isRecurring: boolean;
  dayOfWeek?: DayOfWeekEnum;
  specificDate?: Date | string;
  workingHours: IWorkingHours;
  consultationMode: ConsultationModeEnum;
  slotDuration: number;
  bufferTime?: number;
  clinicId?: string;
  maxPatientsPerSlot?: number;
}

// ==================== CLINIC INTERFACES ====================

export interface IClinic {
  _id?: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  phoneNumber: string;
  alternativePhoneNumber?: string;
  email?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
    buildingNumber?: string;
    floorNumber?: string;
    landmark?: string;
  };
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  logo?: string;
  images?: string[];
  facilities?: string[];
  hasParking: boolean;
  hasWifi: boolean;
  hasPharmacy: boolean;
  isWheelchairAccessible: boolean;
  workingHours?: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  doctors?: string[];
  services?: string[];
  acceptedInsuranceProviders?: string[];
  rating?: number;
  totalReviews?: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IClinicWithDoctors extends IClinic {
  doctorProfiles: IDoctorPublicProfile[];
}

// ==================== SEARCH & FILTER INTERFACES ====================

export interface IDoctorSearchFilters {
  specialty?: SpecialtyEnum;
  minRating?: number;
  isVerified?: boolean;
  isAcceptingNewPatients?: boolean;
  city?: string;
  minFee?: number;
  maxFee?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IAppointmentFilters {
  status?: AppointmentStatusEnum;
  startDate?: Date | string;
  endDate?: Date | string;
  page?: number;
  limit?: number;
}

// ==================== STATS INTERFACES ====================

export interface IAppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  upcoming: number;
  past: number;
  todayAppointments: number;
}

export interface IDoctorStats {
  totalPatients: number;
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
}