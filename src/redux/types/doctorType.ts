export interface DoctorApiResponse {
    success: boolean;
    data: DoctorData[];
}

export interface DoctorData {
    workingHour: WorkingHour;
    _id: string;
    userId: User;
    clinicId: Clinic;
    phoneNumber: string;
    licenseNumber: string;
    serviceType: string;
    availabilityScheduleDays: string[];
    appointmentType: string;
    certificates: Certificate[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    dateOfBirth?: string;
    gender?: string;
    professionalInformation?: ProfessionalInformation;
}

export interface WorkingHour {
    startTime: string;
    endTime: string;
}

export interface User {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    comfirmPassword?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    profileImage?: string;
}

export interface Clinic {
    availability: Availability;
    paymentAndEarnings: PaymentAndEarnings;
    _id: string;
    userId: string;
    nationality?: string;
    nationalIdNumber?: string;
    clinicCertificates?: ClinicCertificate[];
    servicesOffered?: string[];
    createdAt: string;
    updatedAt: string;
    __v?: number;
    clinicDescription?: string;
    phoneNumber?: string;
    medicalLicenseNumber?: string;
    reviews?: Review[];
    avarageRating?: number;
}

export interface Availability {
    startTime?: string;
    endTime?: string;
    workingDays: string[];
    appointmentType?: string;
}

export interface PaymentAndEarnings {
    totalEarnings: TotalEarnings;
    withdrawalMethods: WithdrawalMethod[];
}

export interface TotalEarnings {
    totalThisMonth: number;
    pending: number;
    availbleForWithdrawal: number;
}

export interface WithdrawalMethod {
    _id: string;
    cardHolderName?: string;
    cardNumber?: string;
    cvv?: string;
    expiryDate?: string;
}

export interface ClinicCertificate {
    uploadCertificates?: string | null;
    certificateType?: string;
    certificateName?: string;
    _id: string;
}

export interface Certificate {
    uploadCertificates?: string | null;
    certificateType?: string;
    certificateName?: string;
    _id: string;
}

export interface Review {
    patientId: string;
    rating: number;
    comment: string;
    _id: string;
}

export interface ProfessionalInformation {
    speciality: string;
    experienceYears: number;
    medicalLicenseNumber: string;
    qualifications: string;
    about: string;
    onlineConsultationFee: number;
    clinicVisitFee: number;
    _id: string;
}
