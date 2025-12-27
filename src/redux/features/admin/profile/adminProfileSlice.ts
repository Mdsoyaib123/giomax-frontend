// redux/features/admin/profile/adminProfileSlice.ts
import { AdminProfile } from "@/redux/types/admin/adminProfileTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminProfileState {
  profile: AdminProfile | null;
  isLoading: boolean;
  error: string | null;
  adminId: string | null;
}

const initialState: AdminProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  adminId: null,
};

const adminProfileSlice = createSlice({
  name: "adminProfile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<AdminProfile>) => {
      state.profile = action.payload;
      state.adminId = action.payload._id; // Store admin ID
      state.error = null;

      // Also store in localStorage for API calls
      if (typeof window !== "undefined") {
        localStorage.setItem("adminId", action.payload._id);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.adminId = null;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("adminId");
      }
    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.profileImage = action.payload;
      }
    },
    updateProfileName: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.fullName = action.payload;
      }
    },
    setAdminId: (state, action: PayloadAction<string>) => {
      state.adminId = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("adminId", action.payload);
      }
    },
  },
});

export const {
  setProfile,
  setLoading,
  setError,
  clearProfile,
  updateProfileImage,
  updateProfileName,
  setAdminId,
} = adminProfileSlice.actions;
export default adminProfileSlice.reducer;
