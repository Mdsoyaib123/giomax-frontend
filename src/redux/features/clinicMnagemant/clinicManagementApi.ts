import { baseApi } from "@/redux/hooks/baseApi";
export const clinicManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllClinics: builder.query({
            query: () => "/clinic/getAll",
            providesTags: ["CLINIC_MANAGEMENT"]
        })
    })
})

export const { useGetAllClinicsQuery } = clinicManagementApi;