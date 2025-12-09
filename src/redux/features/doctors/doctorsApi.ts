import { baseApi } from "@/redux/hooks/baseApi";
import { DoctorApiResponse } from "@/redux/types/doctorType";

export const doctorsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDoctors: builder.query<DoctorApiResponse, void>({
            query: () => "doctor/getAll",
            providesTags: ["DOCTOR"]

        })
    })
})
export const { useGetAllDoctorsQuery } = doctorsApi;