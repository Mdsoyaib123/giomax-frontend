import { baseApi } from "@/redux/hooks/baseApi";
import { GetSinglePenitentAppointmentResponse } from "@/redux/types/doctorAppinmentType";
import { AppointmentResponseByDoctorId } from "./doctorAppointment.type";

export const doctorAppointmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSinglePenitentAppointmentById: builder.query<GetSinglePenitentAppointmentResponse, string>({
            query: (id) => `/doctor-appointment/getSinglePaintentAppointment/${id}`,
            providesTags: ["DOCTOR_APPOINTMENT"]
        }),
        ClinicDoctorAllAppointments: builder.query({
            query: (status) => `/doctor-appointment/getAll?status=${status}`,
            providesTags: ["DOCTOR_APPOINTMENT"]
        }),
        getSingleDoctorAppointmentById: builder.query<AppointmentResponseByDoctorId, string>({
            query: (id) => `/doctor-appointment/getSingleDoctorAppointment/${id}`
        }),
        doctorAppointmentStatusUpdate: builder.mutation({
            query: ({ id, status }) => ({
                url: `/doctor-appointment/update-status/${id}`,
                method: "PATCH",
                body: { status }
            }),
            invalidatesTags: ["DOCTOR_APPOINTMENT"]
        }),
        createDoctorAppointment: builder.mutation({
            query: (data) => ({
                url: "/doctor-appointment/create",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["DOCTOR_APPOINTMENT"]
        })

    })
})
export const { useGetSinglePenitentAppointmentByIdQuery, useClinicDoctorAllAppointmentsQuery, useGetSingleDoctorAppointmentByIdQuery, useDoctorAppointmentStatusUpdateMutation, useCreateDoctorAppointmentMutation } = doctorAppointmentApi;