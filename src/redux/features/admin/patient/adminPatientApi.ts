import { baseApi } from "@/redux/hooks/baseApi";
import {
  PatientsResponse,
  PatientResponse,
  DeletePatientResponse,
  Patient,
} from "@/redux/types/adminPatientTypes";

export const adminPatientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all patients
    getAllPatients: builder.query<PatientsResponse, void>({
      query: () => ({
        url: "/patient/getAll",
        method: "GET",
      }),
      providesTags: ["PATIENT"],
    }),

    // Get single patient by user ID
    getSinglePatient: builder.query<PatientResponse, string>({
      query: (userId) => ({
        url: `/patient/getSinglePatient/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PATIENT", id }],
    }),

    // Delete patient by ID
    deletePatient: builder.mutation<DeletePatientResponse, string>({
      query: (patientId) => ({
        url: `/patient/deletePatient/${patientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PATIENT"],
    }),

    // Update patient
    updatePatient: builder.mutation<
      PatientResponse,
      { id: string; data: Partial<Patient> }
    >({
      query: ({ id, data }) => ({
        url: `/patient/updatePatient/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PATIENT"],
    }),
  }),
});

export const {
  useGetAllPatientsQuery,
  useGetSinglePatientQuery,
  useDeletePatientMutation,
  useUpdatePatientMutation,
} = adminPatientApi;
