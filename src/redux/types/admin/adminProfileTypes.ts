// types/adminProfileTypes.ts
export interface AdminProfile {
  _id: string;
  fullName: string;
  email: string;
  password?: string;
  comfirmPassword?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  fcmToken?: string;
  profileImage?: string;
}

export interface AdminProfileResponse {
  success: boolean;
  data: AdminProfile;
  message?: string;
  meta?: any;
}

export interface UpdateProfileRequest {
  fullName?: string;
  avatar?: File;
}

export interface UpdateProfileArgs {
  userId: string;
  data: UpdateProfileRequest;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: string;
  meta: any;
}
