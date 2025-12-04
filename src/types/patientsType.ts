export interface Address {
    _id: string;
    addressLabel: string;
    streetNumber: string;
    apartmentNumber: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface Medication {
    _id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
}

export interface Condition {
    _id: string;
    name: string;
    diagnosedDate: string;
    status: string;
    notes?: string;
}

export interface Allergy {
    _id: string;
    allergyOn: string;
    severity: string;
    reaction: string;
}

export interface MedicalHistory {
    conditions: Condition[];
    Medications: Medication[];
    Allergies: Allergy[];
}

export interface PaymentMethod {
    cardHolderName: string;
    cardNumber: string;
    cvv: string;
    expiryDate: string;
}

export interface WithdrawalMethod {
    cardHolderName: string;
    cardNumber: string;
    cvv: string;
    expiryDate: string;
}

export interface User {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string | null;
}

export interface Patient {
    _id: string | null | undefined;
    userId: User;
    phoneNumber: string;
    gender: string;
    bloodGroup: string;
    dateOfBirth: string;
    address: Address[];
    medicalHistory: MedicalHistory[];
    withdrawalMethods?: WithdrawalMethod[]; // optional
    paymentMethods: PaymentMethod[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface PatientResponse {
    success: boolean;
    data: Patient[];
}
