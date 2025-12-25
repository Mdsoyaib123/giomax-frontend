import { baseApi } from "@/redux/hooks/baseApi";
import { GetSinglePenitentAppointmentResponse } from "@/redux/types/doctorAppinmentType";
import { AppointmentResponseByDoctorId } from "./doctorAppointment.type";

export const doctorAppointmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSinglePenitentAppointmentById: builder.query<GetSinglePenitentAppointmentResponse, string>({
            query: (id) => `/doctor-appointment/getSinglePaintentAppointment/${id}`,
            providesTags: ["DOCTOR_APPOINTMENT"]
        }),
        getAllAppointments: builder.query({
            query: (status) => `/doctor-appointment/getAll?status=${status}`,
            providesTags: ["DOCTOR_APPOINTMENT"]
        }),
        getSingleDoctorAppointmentById: builder.query<AppointmentResponseByDoctorId, string>({
            query: (id) => `/doctor-appointment/getSingleDoctorAppointment/${id}`
        })
    })
})
export const { useGetSinglePenitentAppointmentByIdQuery, useGetAllAppointmentsQuery, useGetSingleDoctorAppointmentByIdQuery } = doctorAppointmentApi;