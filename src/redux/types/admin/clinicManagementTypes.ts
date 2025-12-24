export interface ClinicCertificate {
    uploadCertificates: string | null;
    certificateType: string;
    certificateName: string;
    _id: string;
  }
  
  export interface WithdrawalMethod {
    _id: string;
    cardHolderName?: string;
    cardNumber?: string;
    cvv?: string;
    expiryDate?: string;
  }
  
  export interface User {
    _id: string;
    fullName: string;
    email: string;
    password?: string;
    comfirmPassword?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    profileImage?: string;
    fcmToken?: string | null;
  }
  
  export interface ReviewPatient {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
      profileImage?: string;
    };
  }
  
  export interface Review {
    patientId: ReviewPatient;
    rating: number;
    comment: string;
    _id: string;
    createdAt: string;
  }
  
  export interface Availability {
    startTime: string;
    endTime: string;
    workingDays: string[];
    appointmentType: "online" | "offline" | "both";
  }
  
  export interface TotalEarnings {
    totalThisMonth: number;
    pending: number;
    availbleForWithdrawal: number;
  }
  
  export interface PaymentAndEarnings {
    totalEarnings: TotalEarnings;
    withdrawalMethods: WithdrawalMethod[];
  }
  
  export interface Clinic {
    _id: string;
    userId: User | string;
    nationality: string;
    nationalIdNumber: string;
    clinicCertificates: ClinicCertificate[];
    servicesOffered: string[];
    avarageRating: number;
    reviews: Review[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    address?: string;
    clinicDescription?: string;
    phoneNumber?: string;
    medicalLicenseNumber?: string;
    availability: Availability;
    paymentAndEarnings: PaymentAndEarnings;
  }
  
  export interface ClinicsResponse {
    success: boolean;
    data: Clinic[];
  }
  
  export interface SingleClinicResponse {
    success: boolean;
    data: Clinic;
  }
  
  export interface ClinicStatus {
    id: string;
    licenceNumber: string;
    earnings: string;
    clinicName: string;
    services: string;
    status: "Pending" | "Active" | "Cancelled" | "Suspended";
    totalDoctors: string;
    address: string;
    servicesProvided: string;
  }