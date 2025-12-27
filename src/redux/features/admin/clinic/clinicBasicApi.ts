/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/hooks/baseApi";
import { SingleClinicResponse } from "@/redux/types/admin/clinicManagementTypes";

export const clinicBasicApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all clinics
        getAllClinics: builder.query<any, void>({
            query: () => ({
                url: "/clinic/update-basic",
                method: "put",
            }),
            providesTags: ["CLINIC_BASIC"],
        }),

        // Get single clinic by ID
        getClinicById: builder.query<SingleClinicResponse, string>({
            query: (id) => ({
                url: `/clinic/getById/${id}`,
                method: "GET",
            }),
            providesTags: ["CLINIC_BASIC"],
        }),
        getAClinic: builder.query<any, string>({

            query: (id) => ({
                url: `/clinic/getSingle/${id}`,
                method: "GET",
            }),
            providesTags: ["CLINIC_BASIC"],
        }),
        updateClinic: builder.mutation({
            query: ({ id, data }) => ({
                url: `/clinic/update-basic/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["CLINIC_BASIC"]
        }),
    }),
});

export const {
    useGetAllClinicsQuery,
    useGetClinicByIdQuery,
    useGetAClinicQuery,
    useUpdateClinicMutation

} = clinicBasicApi;