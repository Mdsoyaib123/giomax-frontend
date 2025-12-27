import { baseApi } from "@/redux/hooks/baseApi";
import { DoctorApiResponse } from "@/redux/types/doctorType";
export const doctorsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDoctors: builder.query<DoctorApiResponse, { id: string | null }>({
            query: ({ id }) => `/clinic/getClinicDoctors/${id}`,
            providesTags: ["DOCTOR"]
        }),
        addNewDoctor: builder.mutation({
            query: (data) => ({
                url: "user/create-doctor",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["DOCTOR"]
        }),
        getSignalClinic: builder.query({
            query: (id) => `/clinic/getSingle/${id}`,

        }),
        updateDoctor: builder.mutation({
            query: ({ id, data }) => ({
                url: `/doctor/update/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["DOCTOR"]
        })
    })
})
export const { useGetAllDoctorsQuery, useAddNewDoctorMutation, useGetSignalClinicQuery, useUpdateDoctorMutation } = doctorsApi;