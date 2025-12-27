// src/types/nurseAppointmentTypes.ts
export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type VisitingType = "fristVisit" | "followUp"; // Note: typo in API response "fristVisit"

export interface UserInfo {
  _id: string;
  fullName: string;
  role: string;
  profileImage: string;
}

export interface PatientInfo {
  _id: string;
  userId: UserInfo | string; // Can be object or string based on API response
}

export interface SoloNurseInfo {
  _id: string;
  userId: UserInfo;
}

export interface Appointment {
  _id: string;
  patientId: PatientInfo | null;
  soloNurseId: SoloNurseInfo;
  homeAddress: string;
  visitingType: VisitingType;
  followUpDetails: string;
  reasonForVisit: string;
  status: AppointmentStatus;
  prefarenceDate: string;
  prefarenceTime: string;
  subService: string;
  appointmentFee: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment[];
}

export interface SingleAppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment;
}

export interface UpdateAppointmentRequest {
  status: AppointmentStatus;
}

export interface AppointmentFilter {
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface AppointmentsState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
}
