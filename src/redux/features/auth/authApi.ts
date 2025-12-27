// src/redux/features/auth/authApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  GetAdminResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/redux/types/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/create-user",
        method: "POST",
        body: userData,
      }),
    }),

    // 🔥 GET ADMIN DATA
    getAdmin: builder.query<GetAdminResponse, void>({
      query: () => ({
        url: "/user/get-admin",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useGetAdminQuery } =
  authApi;

// import { baseApi } from "@/redux/hooks/baseApi";
// import {
//   LoginRequest,
//   LoginResponse,
//   RegisterRequest,
//   RegisterResponse,
// } from "@/redux/types/auth.type";

// export const authApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginRequest>({
//       query: (credentials) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//       invalidatesTags: ["User"],
//     }),
//     register: builder.mutation<RegisterResponse, RegisterRequest>({
//       query: (userData) => ({
//         url: "/auth/create-user",
//         method: "POST",
//         body: userData,
//       }),
//     }),
//   }),
// });

// export const { useLoginMutation, useRegisterMutation } = authApi;
