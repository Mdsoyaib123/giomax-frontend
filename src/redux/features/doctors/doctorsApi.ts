import { baseApi } from "@/redux/hooks/baseApi";
import { DoctorApiResponse } from "@/redux/types/doctorType";

export const doctorsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDoctors: builder.query<DoctorApiResponse, void>({
            query: () => "doctor/getAll",
            providesTags: ["DOCTOR"]

        }),
        addNewDoctor: builder.mutation({
            query: (data) => ({
                url: "user/create-doctor",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["DOCTOR"]
        })
    })
})
export const { useGetAllDoctorsQuery, useAddNewDoctorMutation } = doctorsApi;