export interface SubService {
  name: string;
  price: number;
  _id: string;
}

export interface Service {
  serviceId: string;
  serviceName: string;
  subServices: SubService[];
  _id: string;
}

export interface ProfessionalInformation {
  speciality: string;
  experience: string;
  MedicalLicense: string;
  qualifications: string;
  about: string;
  consultationFee: string;
  services: Service[];
}

export interface Availability {
  startTime: string;
  endTime: string;
  workingDays: string[];
}

export interface TotalEarnings {
  totalThisMonth: number;
  pending: number;
  availbleForWithdrawal: number;
}

export interface WithdrawalMethod {
  cardHolderName: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
}

export interface PaymentAndEarnings {
  totalEarnings: TotalEarnings;
  withdrawalMethods: WithdrawalMethod[];
}

export interface User {
  status: any;
  fcmToken: string | null;
  _id: string;
  fullName: string;
  email: string;
  password: string;
  comfirmPassword: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface Certificate {
  uploadCertificates: string;
  certificateType: string;
  certificateName: string;
  _id: string;
}

export interface Review {
  patientId: string;
  rating: number;
  comment: string;
  _id: string;
  createdAt: string;
}

export interface Nurse {
  status: any;
  _id: string;
  userId: User;
  professionalInformation: ProfessionalInformation;
  availability: Availability;
  paymentAndEarnings: PaymentAndEarnings;
  nationality: string;
  nationalIdNumber: string;
  certificates: Certificate[];
  avarageRating: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface NursesResponse {
  success: boolean;
  data: Nurse[];
}

export interface SingleNurseResponse {
  success: boolean;
  data: Nurse;
}

export interface NurseStatus {
  status: "active" | "pending" | "suspended";
}

export interface AdminNurseManagementState {
  nurses: Nurse[];
  selectedNurse: Nurse | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  statusFilter: string;
  currentPage: number;
  totalPages: number;
  totalNurses: number;
  isStatusUpdating: boolean;
}
