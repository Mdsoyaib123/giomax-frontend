import { baseApi } from "@/redux/hooks/baseApi";

export const doctorAppointmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSinglePenitentAppointmentById: builder.query({
            query: (id) => `/doctor-appointment/getSinglePaintentAppointment/${id}`,
            providesTags: ["DOCTOR_APPOINTMENT"]
        })
    })
})
export const { useGetSinglePenitentAppointmentByIdQuery } = doctorAppointmentApi;