// src/redux/features/nurseAppointment/nurseAppointmentSlice.ts
import {
  Appointment,
  AppointmentsState,
} from "@/redux/types/admin/nurseAppointmentTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AppointmentsState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 1,
};

const nurseAppointmentSlice = createSlice({
  name: "nurseAppointment",
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },

    setSelectedAppointment: (
      state,
      action: PayloadAction<Appointment | null>
    ) => {
      state.selectedAppointment = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    updateAppointmentInList: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (appointment) => appointment._id === action.payload._id
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }

      if (state.selectedAppointment?._id === action.payload._id) {
        state.selectedAppointment = action.payload;
      }
    },

    setPagination: (
      state,
      action: PayloadAction<{
        total: number;
        currentPage: number;
        totalPages: number;
      }>
    ) => {
      state.total = action.payload.total;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },

    clearAppointments: (state) => {
      state.appointments = [];
      state.selectedAppointment = null;
      state.loading = false;
      state.error = null;
      state.total = 0;
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
});

export const {
  setAppointments,
  setSelectedAppointment,
  setLoading,
  setError,
  updateAppointmentInList,
  setPagination,
  clearAppointments,
} = nurseAppointmentSlice.actions;

export default nurseAppointmentSlice.reducer;
