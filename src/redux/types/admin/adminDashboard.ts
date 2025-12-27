export interface PaymentData {
  allPaymentTransactions: number;
  totalPaidAmount: number;
  totalPayableAmount: number;
}

export interface AdminOverview {
  totalPatients: number;
  totalDoctors: number;
  totalClinics: number;
  totalAppointments: number;
  totalEarnings: number;
  adminEarnings: number;
}

export interface Transaction {
  _id: string;
  appointmentId: string;
  appointmentType: string;
  patientId: string;
  receiverId: string;
  receiverType: "CLINIC" | "SOLO_NURSE" | "SOLO_DOCTOR";
  amount: number;
  status: "INITIATED" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
  __v: number;
  bogOrderId?: string;
}

export interface DashboardStats {
  paymentData: PaymentData;
  overview: AdminOverview;
  transactions: Transaction[];
}

export interface DashboardResponse {
  success: boolean;
  message?: string;
  data: DashboardStats;
}
