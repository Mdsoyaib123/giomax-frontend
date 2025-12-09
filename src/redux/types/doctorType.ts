// API Response
export interface DoctorApiResponse {
    success: boolean;
    data: DoctorData[];
}

// Main Doctor Data
export interface DoctorData {
    _id: string;
    userId: User;
    phoneNumber: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
    medicalHistory?: MedicalHistory;
    address?: Address[];
    withdrawalMethods?: WithdrawalMethod[];
    paymentMethods?: PaymentMethod[];
    createdAt: string;
    updatedAt: string;
    totalAppointments: number;
    __v: number;
    workingHour?: WorkingHour;
    clinicId?: Clinic;
    licenseNumber?: string;
    serviceType?: string;
    availabilityScheduleDays?: string[];
    appointmentType?: string;
    certificates?: Certificate[];
    professionalInformation?: ProfessionalInformation;
}

// Working Hours
export interface WorkingHour {
    startTime: string;
    endTime: string;
}

// User Info
export interface User {
    _id: string;
    fullName: string;
    email: string;
    password?: string;
    comfirmPassword?: string;
    role?: string;
    profileImage?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

// Clinic
export interface Clinic {
    _id: string;
    userId: string;
    availability?: Availability;
    paymentAndEarnings?: PaymentAndEarnings;
    nationality?: string;
    nationalIdNumber?: string;
    clinicCertificates?: ClinicCertificate[];
    servicesOffered?: string[];
    clinicDescription?: string;
    phoneNumber?: string;
    medicalLicenseNumber?: string;
    reviews?: Review[];
    avarageRating?: number;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

// Clinic availability
export interface Availability {
    startTime?: string;
    endTime?: string;
    workingDays: string[];
    appointmentType?: string;
}

// Payments & Withdrawals
export interface PaymentAndEarnings {
    totalEarnings?: TotalEarnings;
    withdrawalMethods?: WithdrawalMethod[];
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

export interface PaymentMethod {
    _id: string;
    cardHolderName?: string;
    cardNumber?: string;
    cvv?: string;
    expiryDate?: string;
}

// Certificates
export interface ClinicCertificate {
    _id: string;
    uploadCertificates?: string | null;
    certificateType?: string;
    certificateName?: string;
}

export interface Certificate {
    _id: string;
    uploadCertificates?: string | null;
    certificateType?: string;
    certificateName?: string;
}

// Reviews
export interface Review {
    _id: string;
    patientId: string;
    rating: number;
    comment: string;
}

// Professional Information
export interface ProfessionalInformation {
    _id: string;
    speciality: string;
    experienceYears: number;
    medicalLicenseNumber: string;
    qualifications: string;
    about: string;
    onlineConsultationFee: number;
    clinicVisitFee: number;
}

// **Medical History**
export interface MedicalHistory {
    conditions: Condition[];
    Medications: Medication[];
    Allergies: Allergy[];
}

export interface Condition {
    _id: string;
    name: string;
    diagnosedDate: string;
    status: string;
    notes?: string;
}

export interface Medication {
    _id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
}

export interface Allergy {
    _id: string;
    allergyOn: string;
    severity: string;
    reaction: string;
}

// Address
export interface Address {
    _id: string;
    addressLabel: string;
    streetNumber: string;
    apartmentNumber?: string;
    city: string;
    state: string;
    zipCode: string;
}
