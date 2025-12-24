export interface MedicalCondition {
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

export interface MedicalHistory {
  conditions: MedicalCondition[];
  Medications: Medication[];
  Allergies: Allergy[];
}

export interface Address {
  _id: string;
  addressLabel: string;
  streetNumber: string;
  apartmentNumber: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  _id: string;
  userId: User;
  phoneNumber: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  age: number;
  address: Address[];
  paymentMethods: any[];
  medicalHistory: MedicalHistory;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PatientsResponse {
  success: boolean;
  data: Patient[];
}

export interface PatientResponse {
  success: boolean;
  data: Patient;
}

export interface DeletePatientResponse {
  success: boolean;
  message: string;
}

export interface PatientTableData {
  id: string;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  totalBookings?: string;
  lastAppointment?: string;
  createdAt: string;
}
