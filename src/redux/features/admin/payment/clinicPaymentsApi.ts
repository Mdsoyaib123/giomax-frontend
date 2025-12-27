import { baseApi } from "@/redux/hooks/baseApi";
import { create } from "domain";

export const clinicPaymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getClinicPaymentsOverview: builder.query({
            query: (id) => `/clinic/getClinicPaymentData/${id}`
        }),
        getWithdrawRequests: builder.query({
            query: (id) => `/withdrawRequest/getWithdrawRequests/me?ownerId=${id}`
        }),
        createWithdrawRequest: builder.mutation({
            query: (data) => ({
                url: "/withdrawRequest/create",
                method: "POST",
                body: data
            })
        })
    }),
});

export const { useGetClinicPaymentsOverviewQuery, useGetWithdrawRequestsQuery, useCreateWithdrawRequestMutation } = clinicPaymentApi;
