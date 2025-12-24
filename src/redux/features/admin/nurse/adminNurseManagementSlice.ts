import {
  AdminNurseManagementState,
  Nurse,
} from "@/redux/types/admin/adminNurseManagementTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AdminNurseManagementState = {
  nurses: [],
  selectedNurse: null,
  isLoading: false,
  isError: false,
  errorMessage: "",
  statusFilter: "all",
  currentPage: 1,
  totalPages: 1,
  totalNurses: 0,
  isStatusUpdating: false,
};

const adminNurseManagementSlice = createSlice({
  name: "adminNurseManagement",
  initialState,
  reducers: {
    setNurses: (state, action: PayloadAction<Nurse[]>) => {
      state.nurses = action.payload;
      state.totalNurses = action.payload.length;
      state.totalPages = Math.ceil(action.payload.length / 6);
    },

    setSelectedNurse: (state, action: PayloadAction<Nurse | null>) => {
      state.selectedNurse = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.isError = true;
      state.errorMessage = action.payload;
    },

    clearError: (state) => {
      state.isError = false;
      state.errorMessage = "";
    },

    updateNurseStatus: (
      state,
      action: PayloadAction<{ nurseId: string; status: string }>
    ) => {
      const { nurseId, status } = action.payload;
      const nurseIndex = state.nurses.findIndex((n) => n._id === nurseId);
      if (nurseIndex !== -1) {
        // Update status in nurses array
        // Note: You might want to add a status field to the Nurse type if it doesn't exist
      }
    },

    removeNurse: (state, action: PayloadAction<string>) => {
      state.nurses = state.nurses.filter(
        (nurse) => nurse._id !== action.payload
      );
      state.totalNurses = state.nurses.length;
      state.totalPages = Math.ceil(state.nurses.length / 6);
    },
  },
});

export const {
  setNurses,
  setSelectedNurse,
  setStatusFilter,
  setCurrentPage,
  setLoading,
  setError,
  clearError,
  updateNurseStatus,
  removeNurse,
} = adminNurseManagementSlice.actions;

export default adminNurseManagementSlice.reducer;
