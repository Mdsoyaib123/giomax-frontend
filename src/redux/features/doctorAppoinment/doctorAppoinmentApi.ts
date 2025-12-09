import { baseApi } from "@/redux/hooks/baseApi";
import { GetSinglePenitentAppointmentResponse } from "@/redux/types/doctorAppinmentType";

export const doctorAppointmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSinglePenitentAppointmentById: builder.query<GetSinglePenitentAppointmentResponse, string>({
            query: (id) => `/doctor-appointment/getSinglePaintentAppointment/${id}`,
            providesTags: ["DOCTOR_APPOINTMENT"]
        }),
        getAllAppointments: builder.query({
            query: (status) => `/doctor-appointment/getAll?status=${status}`,
            providesTags: ["DOCTOR_APPOINTMENT"]
        })
    })
})
export const { useGetSinglePenitentAppointmentByIdQuery, useGetAllAppointmentsQuery } = doctorAppointmentApi;