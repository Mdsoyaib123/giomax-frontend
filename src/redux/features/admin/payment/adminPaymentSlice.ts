import { WithdrawRequest } from "@/redux/types/admin/adminPaymentTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminPaymentState {
  selectedRequest: WithdrawRequest | null;
  filters: {
    status: "PENDING" | "PAID" | "REJECTED" | "ALL";
    ownerType: "SOLO_NURSE" | "CLINIC" | "SOLO_DOCTOR" | "ALL";
    search: string;
  };
  currentPage: number;
  itemsPerPage: number;
}

const initialState: AdminPaymentState = {
  selectedRequest: null,
  filters: {
    status: "ALL",
    ownerType: "ALL",
    search: "",
  },
  currentPage: 1,
  itemsPerPage: 10,
};

const adminPaymentSlice = createSlice({
  name: "adminPayment",
  initialState,
  reducers: {
    setSelectedRequest: (
      state,
      action: PayloadAction<WithdrawRequest | null>
    ) => {
      state.selectedRequest = action.payload;
    },
    setFilterStatus: (
      state,
      action: PayloadAction<AdminPaymentState["filters"]["status"]>
    ) => {
      state.filters.status = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setFilterOwnerType: (
      state,
      action: PayloadAction<AdminPaymentState["filters"]["ownerType"]>
    ) => {
      state.filters.ownerType = action.payload;
      state.currentPage = 1;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
  },
});

export const {
  setSelectedRequest,
  setFilterStatus,
  setFilterOwnerType,
  setSearchFilter,
  setCurrentPage,
  setItemsPerPage,
  resetFilters,
} = adminPaymentSlice.actions;

export default adminPaymentSlice.reducer;
