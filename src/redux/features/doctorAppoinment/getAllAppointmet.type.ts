// ==============
// Reusable Types
// ==============

export type UserRole = 'patient' | 'doctor';

export type BloodGroup =
    | 'A+' | 'A-'
    | 'B+' | 'B-'
    | 'AB+' | 'AB-'
    | 'O+' | 'O-' | string;

// Note: API uses "fristVisit" (typo) — keep as-is unless backend fixes it
export type VisitingType = 'fristVisit' | 'followUp' | string;

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | string;

export type ServiceType = 'online' | 'inClinic';

// ==============
// Interfaces
// ==============

export interface User {
    _id: string;
    fullName: string;
    role: UserRole;
    profileImage?: string; // Present in patient, possibly optional for doctor
}

export interface Patient {
    _id: string;
    userId: User; // Full nested user object
    gender: 'male' | 'female' | 'other' | string;
    bloodGroup: BloodGroup | string; // Allow string if you want flexibility
    age: number;
}

export interface Doctor {
    _id: string;
    userId: User; // Full nested user object (same structure as above)
}

// ⚠️ Keep original field names to match API (typos included)
export interface Appointment {
    _id: string;
    patientId: Patient | null;   // Can be null (as seen in your data)
    doctorId: Doctor;
    clinicId: string;
    serviceType: ServiceType;
    visitingType: VisitingType;          // "fristVisit" is used in API
    reasonForVisit: string;
    followUpDetails: string;
    status: AppointmentStatus;
    prefarenceDate: string;              // ⚠️ typo: should be "preferenceDate"
    prefarenceTime: string;              // ⚠️ typo: should be "preferenceTime"
    appoinmentFee: number;               // ⚠️ typo: should be "appointmentFee"
    createdAt: string; // ISO 8601
    updatedAt: string;
    __v: number;
}

export interface AppointmentResponse {
    success: boolean;
    message: string;
    data: Appointment[]
}