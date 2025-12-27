import { baseApi } from "@/redux/hooks/baseApi";


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
        }),
        getSingleWithdrawRequest: builder.query({
            query: (id) => `/wallet/getSingle/${id}`
        })
    }),
});

export const { useGetClinicPaymentsOverviewQuery, useGetWithdrawRequestsQuery, useCreateWithdrawRequestMutation, useGetSingleWithdrawRequestQuery } = clinicPaymentApi;
