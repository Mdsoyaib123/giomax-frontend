export interface DoctorUser {
    _id: string;
    fullName: string;
    role: string;
    profileImage?: string | null;
}

export interface ProfessionalInformation {
    speciality: string;
}

export interface Doctor {
    _id: string;
    userId: DoctorUser;
    professionalInformation: ProfessionalInformation;
}

export interface PatientReference {
    _id: string;
}

export interface Appointment {
    _id: string;
    patientId: PatientReference;
    doctorId: Doctor;
    clinicId?: string;
    serviceType: string;
    visitingType: string;
    reasonForVisit?: string;
    followUpDetails: string;
    status: string;
    prefarenceDate: string;
    prefarenceTime: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface GetSinglePenitentAppointmentResponse {
    success: boolean;
    message: string;
    data: Appointment[] | undefined;
}
