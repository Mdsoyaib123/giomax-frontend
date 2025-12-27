import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardStats } from "@/redux/types/admin/adminDashboard";

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    setDashboardStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearDashboard: (state) => {
      state.stats = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setDashboardStats, setLoading, setError, clearDashboard } =
  adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
