import { IAppointment } from "@/redux/types/adminDoctorAppointment";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DoctorAppointmentState {
  appointments: IAppointment[];
  filteredAppointments: IAppointment[];
  selectedAppointment: IAppointment | null;
  filters: {
    status: string;
    serviceType: string;
    clinicId: string;
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: DoctorAppointmentState = {
  appointments: [],
  filteredAppointments: [],
  selectedAppointment: null,
  filters: {
    status: "all",
    serviceType: "all",
    clinicId: "all",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 6,
    totalItems: 0,
  },
  isLoading: false,
  error: null,
};

const doctorAppointmentSlice = createSlice({
  name: "doctorAppointment",
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<IAppointment[]>) => {
      state.appointments = action.payload;
      state.filteredAppointments = action.payload;
      state.pagination.totalItems = action.payload.length;
    },

    setSelectedAppointment: (
      state,
      action: PayloadAction<IAppointment | null>
    ) => {
      state.selectedAppointment = action.payload;
    },

    setFilter: (
      state,
      action: PayloadAction<{ key: "status" | "serviceType" | "clinicId"; value: string }>
    ) => {
      state.filters[action.payload.key] = action.payload.value;

      // Apply filters
      let filtered = state.appointments;

      if (state.filters.status !== "all") {
        filtered = filtered.filter(
          (app) => app.status === state.filters.status
        );
      }

      if (state.filters.serviceType !== "all") {
        filtered = filtered.filter(
          (app) => app.serviceType === state.filters.serviceType
        );
      }

      if (state.filters.clinicId !== "all") {
        filtered = filtered.filter(
          (app) => app.clinicId._id === state.filters.clinicId
        );
      }

      state.filteredAppointments = filtered;
      state.pagination.totalItems = filtered.length;
      state.pagination.currentPage = 1;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearFilters: (state) => {
      state.filters = { status: "all", serviceType: "all", clinicId: "all" };
      state.filteredAppointments = state.appointments;
      state.pagination.totalItems = state.appointments.length;
      state.pagination.currentPage = 1;
    },

    resetState: () => initialState,
  },
});

export const {
  setAppointments,
  setSelectedAppointment,
  setFilter,
  setCurrentPage,
  setLoading,
  setError,
  clearFilters,
  resetState,
} = doctorAppointmentSlice.actions;

export default doctorAppointmentSlice.reducer;
