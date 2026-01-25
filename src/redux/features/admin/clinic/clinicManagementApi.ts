import { baseApi } from "@/redux/hooks/baseApi";
import { ClinicsResponse, SingleClinicResponse } from "@/redux/types/admin/clinicManagementTypes";

export const clinicManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all clinics
    getAllClinics: builder.query<ClinicsResponse, void>({
      query: () => ({
        url: "/clinic/getAll",
        method: "GET",
      }),
      providesTags: ["CLINIC_MANAGEMENT"],
    }),

    // Get single clinic by ID
    getClinicById: builder.query<SingleClinicResponse, string>({
      query: (id) => ({
        url: `/clinic/getById/${id}`,
        method: "GET",
      }),
      providesTags: ["CLINIC_MANAGEMENT"],
    }),

    // Update clinic status
    updateClinicStatus: builder.mutation<
      { success: boolean; message: string },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/clinic/updateStatus/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["CLINIC_MANAGEMENT"],
    }),

    // Delete clinic
    deleteClinic: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/clinic/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CLINIC_MANAGEMENT"],
    }),

    // Approve clinic (example endpoint)
    approveClinic: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/clinic/approve/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["CLINIC_MANAGEMENT"],
    }),

    // Suspend clinic
    suspendClinic: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/clinic/suspend/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["CLINIC_MANAGEMENT"],
    }),
    acceptUser: builder.mutation({
      query: (id) => ({
        url: `/user/add-admin-approval/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["CLINIC_MANAGEMENT"],
    }),
    getAllClinicPreferanceDate: builder.query({
      query: (clinicId: string) => ({
        url: `/clinic/getAllAppoinmentsPrefarenceDate/${clinicId}`,
        method: "GET",
      }),
      providesTags: ["CLINIC_MANAGEMENT"],
    }),
    
  }),
  overrideExisting: false,
});

export const {
  useGetAllClinicsQuery,
  useGetClinicByIdQuery,
  useUpdateClinicStatusMutation,
  useDeleteClinicMutation,
  useApproveClinicMutation,
  useSuspendClinicMutation,
  useAcceptUserMutation,
  useGetAllClinicPreferanceDateQuery
} = clinicManagementApi;