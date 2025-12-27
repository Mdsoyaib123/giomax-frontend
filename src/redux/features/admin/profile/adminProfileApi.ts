// redux/features/admin/profile/adminProfileApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  AdminProfileResponse,
  UpdateProfileRequest,
  UpdateProfileArgs,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/redux/types/admin/adminProfileTypes";

export const adminProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get admin profile
    getAdminProfile: builder.query<AdminProfileResponse, void>({
      query: () => ({
        url: "/user/get-admin",
        method: "GET",
      }),
      providesTags: ["AdminProfile"],
      transformResponse: (response: AdminProfileResponse) => {
        if (typeof window !== "undefined" && response.data?._id) {
          localStorage.setItem("adminId", response.data._id);
        }
        return response;
      },
    }),

    // Update admin profile - Dynamic URL based on user ID
    updateAdminProfile: builder.mutation<
      AdminProfileResponse,
      UpdateProfileArgs
    >({
      query: ({ userId, data }) => {
        const formData = new FormData();

        if (data.fullName) {
          formData.append("fullName", data.fullName);
        }

        // IMPORTANT: Check the correct field name
        // Try one of these field names based on your backend
        if (data.avatar) {
          // Try these common field names (use the correct one):
          formData.append("profileImage", data.avatar); // Most likely
          // OR
          // formData.append("image", data.avatar);
          // OR
          // formData.append("file", data.avatar);
          // OR keep as "avatar" if that's what backend expects
          // formData.append("avatar", data.avatar);
        }

        return {
          url: `/admin/update/${userId}`,
          method: "POST",
          body: formData,
          // Add headers for FormData
          headers: {
            // Don't set Content-Type header - let browser set it with boundary
          },
        };
      },
      invalidatesTags: ["AdminProfile"],
    }),

    // Alternative: Update profile with auto-detected user ID
    updateMyProfile: builder.mutation<
      AdminProfileResponse,
      UpdateProfileRequest
    >({
      query: (data) => {
        const adminId =
          typeof window !== "undefined"
            ? localStorage.getItem("adminId")
            : null;

        if (!adminId) {
          throw new Error("Admin ID not found. Please fetch profile first.");
        }

        const formData = new FormData();

        if (data.fullName) {
          formData.append("fullName", data.fullName);
        }

        if (data.avatar) {
          // IMPORTANT: Use the correct field name here too
          formData.append("profileImage", data.avatar); // Most likely
          // OR
          // formData.append("image", data.avatar);
        }

        return {
          url: `/admin/update/${adminId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["AdminProfile"],
    }),

    // Change password
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (credentials) => ({
        url: "/auth/change-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
} = adminProfileApi;

// // redux/features/admin/profile/adminProfileApi.ts
// import { baseApi } from "@/redux/hooks/baseApi";
// import {
//   AdminProfileResponse,
//   UpdateProfileRequest,
//   UpdateProfileArgs,
//   ChangePasswordRequest,
//   ChangePasswordResponse,
// } from "@/redux/types/admin/adminProfileTypes";

// export const adminProfileApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // Get admin profile
//     getAdminProfile: builder.query<AdminProfileResponse, void>({
//       query: () => ({
//         url: "/user/get-admin",
//         method: "GET",
//       }),
//       providesTags: ["AdminProfile"],
//       transformResponse: (response: AdminProfileResponse) => {
//         // Store the admin ID in localStorage for later use
//         if (typeof window !== "undefined" && response.data?._id) {
//           localStorage.setItem("adminId", response.data._id);
//         }
//         return response;
//       },
//     }),

//     // Update admin profile - Dynamic URL based on user ID
//     updateAdminProfile: builder.mutation<
//       AdminProfileResponse,
//       UpdateProfileArgs
//     >({
//       query: ({ userId, data }) => {
//         const formData = new FormData();

//         if (data.fullName) {
//           formData.append("fullName", data.fullName);
//         }

//         if (data.avatar) {
//           formData.append("avatar", data.avatar);
//         }

//         return {
//           url: `/admin/update/${userId}`,
//           method: "POST",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["AdminProfile"],
//       // Optimistic update
//       async onQueryStarted({ userId, data }, { dispatch, queryFulfilled }) {
//         const patchResult = dispatch(
//           adminProfileApi.util.updateQueryData(
//             "getAdminProfile",
//             undefined,
//             (draft) => {
//               if (data.fullName) {
//                 draft.data.fullName = data.fullName;
//               }
//               draft.data.updatedAt = new Date().toISOString();
//             }
//           )
//         );
//         try {
//           await queryFulfilled;
//         } catch {
//           patchResult.undo();
//         }
//       },
//     }),

//     // Alternative: Update profile with auto-detected user ID
//     updateMyProfile: builder.mutation<
//       AdminProfileResponse,
//       UpdateProfileRequest
//     >({
//       query: (data) => {
//         // Get admin ID from localStorage or from the getAdminProfile response
//         const adminId =
//           typeof window !== "undefined"
//             ? localStorage.getItem("adminId")
//             : null;

//         if (!adminId) {
//           throw new Error("Admin ID not found. Please fetch profile first.");
//         }

//         const formData = new FormData();

//         if (data.fullName) {
//           formData.append("fullName", data.fullName);
//         }

//         if (data.avatar) {
//           formData.append("avatar", data.avatar);
//         }

//         return {
//           url: `/admin/update/${adminId}`,
//           method: "POST",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["AdminProfile"],
//     }),

//     // Change password
//     changePassword: builder.mutation<
//       ChangePasswordResponse,
//       ChangePasswordRequest
//     >({
//       query: (credentials) => ({
//         url: "/auth/change-password",
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetAdminProfileQuery,
//   useUpdateAdminProfileMutation,
//   useUpdateMyProfileMutation,
//   useChangePasswordMutation,
// } = adminProfileApi;
