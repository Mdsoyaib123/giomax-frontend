export interface IUser {
  _id: string;
  fullName: string;
  role: string;
  profileImage?: string;
}

export interface IPatient {
  _id: string;
  userId: IUser;
  gender: string;
  bloodGroup: string;
  age: number;
}

export interface IDoctor {
  _id: string;
  userId: IUser;
}

export interface IAppointment {
  _id: string;
  patientId: IPatient | null;
  doctorId: IDoctor;
  clinicId: string;
  serviceType: "inClinic" | "online";
  visitingType: "firstVisit" | "followUp";
  reasonForVisit: string;
  followUpDetails: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  prefarenceDate: string;
  prefarenceTime: string;
  appoinmentFee: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAppointmentResponse {
  success: boolean;
  message: string;
  data: IAppointment[];
}

export interface ISingleAppointmentResponse {
  success: boolean;
  message: string;
  data: IAppointment;
}

export interface IUpdateStatusResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface IUpdateStatusPayload {
  appointmentId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

export interface IFilterParams {
  status?: string;
  serviceType?: string;
  doctorId?: string;
  clinicId?: string;
  page?: number;
  limit?: number;
}
