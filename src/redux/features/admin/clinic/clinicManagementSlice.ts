import { Clinic, ClinicStatus } from "@/redux/types/admin/clinicManagementTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClinicManagementState {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  filterStatus: string;
  searchTerm: string;
}

const initialState: ClinicManagementState = {
  clinics: [],
  selectedClinic: null,
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 6,
  filterStatus: "all",
  searchTerm: "",
};

const clinicManagementSlice = createSlice({
  name: "clinicManagement",
  initialState,
  reducers: {
    setClinics: (state, action: PayloadAction<Clinic[]>) => {
      state.clinics = action.payload;
    },
    setSelectedClinic: (state, action: PayloadAction<Clinic | null>) => {
      state.selectedClinic = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    updateClinicStatus: (
      state,
      action: PayloadAction<{ id: string; status: ClinicStatus["status"] }>
    ) => {
      const clinic = state.clinics.find((c) => c._id === action.payload.id);
      if (clinic) {
        // Update clinic status logic here
        // This is a placeholder - actual implementation depends on your backend
      }
    },
  },
});

export const {
  setClinics,
  setSelectedClinic,
  setLoading,
  setError,
  setCurrentPage,
  setFilterStatus,
  setSearchTerm,
  updateClinicStatus,
} = clinicManagementSlice.actions;

export default clinicManagementSlice.reducer;