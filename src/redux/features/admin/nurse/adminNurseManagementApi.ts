import { baseApi } from "@/redux/hooks/baseApi";
import {
  NursesResponse,
  SingleNurseResponse,
} from "@/redux/types/admin/adminNurseManagementTypes";

export const adminNurseManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all nurses
    getAllNurses: builder.query<NursesResponse, void>({
      query: () => ({
        url: "/solo-nurse/getAll",
        method: "GET",
      }),
      providesTags: ["NURSE_MANAGEMENT"],
    }),

    // Get single nurse by userId
    getSingleNurse: builder.query<SingleNurseResponse, string>({
      query: (userId) => ({
        url: `/solo-nurse/getSingle/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "NURSE_MANAGEMENT", id: userId },
      ],
    }),

    // Update nurse status
    // updateNurseStatus: builder.mutation<
    //   { success: boolean; message: string },
    //   { nurseId: string; status: string }
    // >({
    //   query: ({ nurseId, status }) => ({
    //     url: `/admin/nurse/${nurseId}/status`,
    //     method: "PATCH",
    //     body: { status },
    //   }),
    //   invalidatesTags: ["NURSE_MANAGEMENT"],
    // }),

    updateNurseStatus: builder.mutation<
      { success: boolean; message: string },
      { nurseId: string; status: string }
    >({
      query: ({ nurseId, status }) => ({
        url: `/doctor-appointment/update-status/${nurseId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["NURSE_MANAGEMENT"],
    }),

    // Delete nurse
    deleteNurse: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (nurseId) => ({
        url: `/solo-nurse/delete/${nurseId}/${nurseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NURSE_MANAGEMENT"],
    }),
  }),
});

export const {
  useGetAllNursesQuery,
  useGetSingleNurseQuery,
  useUpdateNurseStatusMutation,
  useDeleteNurseMutation,
} = adminNurseManagementApi;
