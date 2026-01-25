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
            query: ({ id, status, prefarenceDate, serviceType, doctorId }) => {
                const params = new URLSearchParams();
                if (status && status !== " " && status !== "All") params.append("status", status);
                if (prefarenceDate) params.append("prefarenceDate", prefarenceDate);
                if (serviceType) params.append("serviceType", serviceType);
                if (doctorId) params.append("doctorId", doctorId);
                
                return `clinic/getClinicAppointments/${id}?${params.toString()}`;
            },
            providesTags: ["DOCTOR_APPOINTMENT"],
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