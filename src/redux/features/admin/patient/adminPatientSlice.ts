/* eslint-disable @typescript-eslint/no-explicit-any */
import { PatientTableData } from "@/redux/types/adminPatientTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminPatientState {
  searchTerm: string;
  selectedPatient: any | null;
  currentPage: number;
  itemsPerPage: number;
  isViewModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminPatientState = {
  searchTerm: "",
  selectedPatient: null,
  currentPage: 1,
  itemsPerPage: 6,
  isViewModalOpen: false,
  isLoading: false,
  error: null,
};

const adminPatientSlice = createSlice({
  name: "adminPatient",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setSelectedPatient: (
      state,
      action: PayloadAction<PatientTableData | null>
    ) => {
      state.selectedPatient = action.payload;
      state.isViewModalOpen = !!action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    openViewModal: (state) => {
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedPatient = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetState: () => initialState,
  },
});

export const {
  setSearchTerm,
  setSelectedPatient,
  setCurrentPage,
  setItemsPerPage,
  openViewModal,
  closeViewModal,
  setLoading,
  setError,
  resetState,
} = adminPatientSlice.actions;

export default adminPatientSlice.reducer;
