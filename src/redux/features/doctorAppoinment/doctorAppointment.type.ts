interface User {
    _id: string;
    fullName: string;
    role: 'patient' | 'doctor' | string; // You can restrict to known roles if needed
}

interface Patient {
    _id: string;
    userId: User;
    gender: 'male' | 'female' | 'other' | string;
    bloodGroup: string; // e.g., "A+", "O-", etc.
    age: number;
}

interface Doctor {
    _id: string;
    userId: string; // This appears to be just an ID string in some cases
}

interface Appointment {
    _id: string;
    patientId: Patient | null;
    doctorId: Doctor;
    clinicId: string;
    serviceType: 'online' | 'inClinic';
    visitingType: 'fristVisit' | 'followUp' | string; // Note: likely a typo ("firstVisit")
    reasonForVisit: string;
    followUpDetails: string;
    status: 'confirmed' | 'pending' | 'cancelled' | string; // Add other statuses as needed
    prefarenceDate: string; // ISO date string like "2025-10-19"
    prefarenceTime: string; // Time string like "10:49 AM"
    appoinmentFee: number; // Note: typo in "appointment"
    createdAt: string; // ISO 8601 date string
    updatedAt: string;
    __v: number;
}

export interface AppointmentResponseByDoctorId {
    success: boolean;
    message: string;
    data: Appointment[];
}