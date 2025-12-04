import { baseApi } from "@/redux/hooks/baseApi";
import { GetSinglePenitentAppointmentResponse } from "@/redux/types/doctorAppinmentType";

export const doctorAppointmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSinglePenitentAppointmentById: builder.query<GetSinglePenitentAppointmentResponse, string>({
            query: (id) => `/doctor-appointment/getSinglePaintentAppointment/${id}`,
            providesTags: ["DOCTOR_APPOINTMENT"]
        })
    })
})
export const { useGetSinglePenitentAppointmentByIdQuery } = doctorAppointmentApi;