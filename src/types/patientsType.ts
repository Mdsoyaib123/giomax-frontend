export interface Address {
    addressLabel: string;
    streetNumber: string;
    apartmentNumber: string;
    city: string;
    state: string;
    zipCode: string;
    _id: string;
}

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    _id: string;
}

export interface Condition {
    name: string;
    diagnosedDate: string;
    status: string;
    notes?: string;
    _id: string;
}

export interface Allergy {
    allergyOn: string;
    severity: string;
    reaction: string;
    _id: string;
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

export interface Patient {
    _id: string;
    userId: string;
    phoneNumber: string;
    gender: string;
    bloodGroup: string;
    dateOfBirth: string;
    address: Address[];
    medicalHistory: MedicalHistory[];
    paymentMethods: PaymentMethod[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    fullName: string;
    email: string;
}

export interface PatientResponse {
    success: boolean;
    data: Patient[];
}
