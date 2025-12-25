// src/redux/features/nurseAppointment/nurseAppointmentApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import {
  AppointmentResponse,
  SingleAppointmentResponse,
  UpdateAppointmentRequest,
  AppointmentFilter,
} from "@/redux/types/admin/nurseAppointmentTypes";

export const nurseAppointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all nurse appointments with filters
    getNurseAppointments: builder.query<AppointmentResponse, AppointmentFilter>(
      {
        query: (filters) => {
          const params = new URLSearchParams();

          if (filters.status) params.append("status", filters.status);
          if (filters.page) params.append("page", filters.page.toString());
          if (filters.limit) params.append("limit", filters.limit.toString());
          if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
          if (filters.dateTo) params.append("dateTo", filters.dateTo);

          return {
            url: `/solo-nurse-appointment/getAll${
              params.toString() ? `?${params.toString()}` : ""
            }`,
            method: "GET",
          };
        },
        providesTags: ["NURSE_APPOINTMENT"],
      }
    ),

    // Get single appointment
    getNurseAppointment: builder.query<SingleAppointmentResponse, string>({
      query: (id) => ({
        url: `/solo-nurse-appointment/getSingle/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "NURSE_APPOINTMENT", id },
      ],
    }),

    // Update appointment status
    updateNurseAppointment: builder.mutation<
      SingleAppointmentResponse,
      { id: string; data: UpdateAppointmentRequest }
    >({
      query: ({ id, data }) => ({
        url: `/solo-nurse-appointment/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "NURSE_APPOINTMENT", id },
        "NURSE_APPOINTMENT",
      ],
    }),

    // Cancel appointment
    cancelNurseAppointment: builder.mutation<SingleAppointmentResponse, string>(
      {
        query: (id) => ({
          url: `/solo-nurse-appointment/update/${id}`,
          method: "PUT",
          body: { status: "cancelled" },
        }),
        invalidatesTags: (_result, _error, id) => [
          { type: "NURSE_APPOINTMENT", id },
          "NURSE_APPOINTMENT",
        ],
      }
    ),

    // Confirm appointment
    confirmNurseAppointment: builder.mutation<
      SingleAppointmentResponse,
      string
    >({
      query: (id) => ({
        url: `/solo-nurse-appointment/update/${id}`,
        method: "PUT",
        body: { status: "confirmed" },
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "NURSE_APPOINTMENT", id },
        "NURSE_APPOINTMENT",
      ],
    }),
  }),
});

export const {
  useGetNurseAppointmentsQuery,
  useGetNurseAppointmentQuery,
  useUpdateNurseAppointmentMutation,
  useCancelNurseAppointmentMutation,
  useConfirmNurseAppointmentMutation,
} = nurseAppointmentApi;
