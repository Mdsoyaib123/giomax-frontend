import { baseApi } from "@/redux/hooks/baseApi";
import { ClinicPatientsResponse } from "@/types/patientsType";

export const patientsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getClinicAllPatients: builder.query<ClinicPatientsResponse,
            { id: string | null }
        >({
            query: ({ id }) => `/clinic/getClinicPatients/${id}`,
            providesTags: ["CLINIC_PATIENT"],
        }),

        getSinglePatients: builder.query({
            query: ({ id }: { id: string }) => `patient/getSinglePatient/${id}`,
            providesTags: ["CLINIC_PATIENT"],
        }),
        CreatePatient: builder.mutation({
            query: (data) => ({
                url: "/user/create-paient",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CLINIC_PATIENT"],
        })
    }),
});
export const { useGetClinicAllPatientsQuery, useGetSinglePatientsQuery, useCreatePatientMutation } = patientsApi