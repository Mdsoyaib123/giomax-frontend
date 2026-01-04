/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";
import {
  WithdrawRequestResponse,
  UpdateStatusResponse,
  WithdrawRequestParams,
} from "@/redux/types/admin/adminPaymentTypes";

export const adminPaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all withdraw requests for admin
    getAllWithdrawRequests: builder.query<
      WithdrawRequestResponse,
      WithdrawRequestParams
    >({
      query: (params) => ({
        url: "/withdrawRequest/getAll/admin",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status,
          ownerType: params.ownerType,
          search: params.search,
        },
      }),
      providesTags: ["WITHDRAW_REQUEST"],
    }),

    markAsPaid: builder.mutation<UpdateStatusResponse, string>({
      query: (id) => ({
        url: `/withdrawRequest/markAsPaid/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["WITHDRAW_REQUEST", "PAYMENT_STATS"],
    }),

    // Reject withdraw request
    rejectWithdrawRequest: builder.mutation<UpdateStatusResponse, string>({
      query: (id) => ({
        url: `/withdrawRequest/reject/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["WITHDRAW_REQUEST", "PAYMENT_STATS"],
    }),

    // Get withdraw requests for specific user
    getWithdrawRequestsByUser: builder.query<WithdrawRequestResponse, string>({
      query: (ownerId) =>
        `/withdrawRequest/getWithdrawRequests/me?ownerId=${ownerId}`,
      providesTags: ["WITHDRAW_REQUEST"],
    }),
    getAllrefundRequests: builder.query<any, void>({
      query: () => ({
        url: "/refund/getAll",
        method: "GET",
      }),
      providesTags: ["REFUND_REQUEST"],
    }),
  }),
});

export const {
  useGetAllWithdrawRequestsQuery,
  useMarkAsPaidMutation,
  useRejectWithdrawRequestMutation,
  useGetWithdrawRequestsByUserQuery,
  useGetAllrefundRequestsQuery,
} = adminPaymentApi;
