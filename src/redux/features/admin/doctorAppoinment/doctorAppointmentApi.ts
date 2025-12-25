import { baseApi } from "@/redux/hooks/baseApi";
import {
  IAppointmentResponse,
  ISingleAppointmentResponse,
  IUpdateStatusResponse,
  IUpdateStatusPayload,
  IFilterParams,
} from "@/redux/types/adminDoctorAppointment";

export const doctorAppointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all appointments with optional filtering
    getAllAppointments: builder.query<IAppointmentResponse, IFilterParams>({
      query: (params) => ({
        url: "/doctor-appointment/getAll",
        method: "GET",
        params: {
          ...params,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
      providesTags: ["DOCTOR_APPOINTMENT"],
    }),

    // Get single appointment by ID
    getSingleAppointment: builder.query<ISingleAppointmentResponse, string>({
      query: (id) => `/doctor-appointment/getSingle/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "DOCTOR_APPOINTMENT", id },
      ],
    }),

    // Update appointment status
    updateAppointmentStatus: builder.mutation<
      IUpdateStatusResponse,
      IUpdateStatusPayload
    >({
      query: ({ appointmentId, status }) => ({
        url: `/doctor-appointment/update-status/${appointmentId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["DOCTOR_APPOINTMENT"],
    }),

    // Refund appointment (special status update)
    refundAppointment: builder.mutation<IUpdateStatusResponse, string>({
      query: (appointmentId) => ({
        url: `/doctor-appointment/update-status/${appointmentId}`,
        method: "PATCH",
        body: { status: "cancelled" },
      }),
      invalidatesTags: ["DOCTOR_APPOINTMENT"],
    }),
  }),
});

export const {
  useGetAllAppointmentsQuery,
  useGetSingleAppointmentQuery,
  useUpdateAppointmentStatusMutation,
  useRefundAppointmentMutation,
  useLazyGetAllAppointmentsQuery,
} = doctorAppointmentApi;
