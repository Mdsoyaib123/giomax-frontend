import { MedicalHistory } from "@/redux/types/adminPatientTypes";

export interface ClinicPatientsResponse {
    success: boolean;
    message: string;
    data: Appointment[];
}
export interface Appointment {
    _id: string;
    patientId: Patient | null;
    doctorId: Doctor;
    clinicId: string;
    serviceType: "online" | "inClinic";
    visitingType: "fristVisit" | "followUp";
    reasonForVisit: string;
    followUpDetails: string;

    status: "pending" | "confirmed" | "cancelled";
    prefarenceDate: string; // ISO date string
    prefarenceTime: string;
    appoinmentFee: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
export interface Patient {
    _id: string;
    userId: User;
    phoneNumber: string;
    age: number;
    gender: string;
    bloodGroup: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    dateOfBirth?: string;
    medicalHistory?: MedicalHistory[]
}
export interface Doctor {
    _id: string;
    userId: string;
}
export interface User {
    _id: string;
    fullName: string;
    email: string;
    role: "patient" | "doctor" | "admin";
    profileImage?: string;
}
