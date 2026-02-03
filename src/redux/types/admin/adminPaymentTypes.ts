export interface Wallet {
  _id: string;
  ownerType: "SOLO_NURSE" | "CLINIC" | "SOLO_DOCTOR";
  ownerId: string;
  balance: number;
  pendingBalance: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WithdrawRequest {
  _id: string;
  walletId: Wallet | string | null;
  ownerId: string;
  ownerType: "SOLO_NURSE" | "CLINIC" | "SOLO_DOCTOR";
  amount: number;
  status: "PENDING" | "PAID" | "REJECTED";
  ownerUserId?: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WithdrawRequestResponse {
  success: boolean;
  data: WithdrawRequest[];
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  data: WithdrawRequest;
}

export interface WithdrawRequestParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "PAID" | "REJECTED";
  ownerType?: "SOLO_NURSE" | "CLINIC" | "SOLO_DOCTOR";
  search?: string;
}

export interface PaymentStats {
  totalPending: number;
  totalPaid: number;
  totalRejected: number;
  totalAmount: number;
}
