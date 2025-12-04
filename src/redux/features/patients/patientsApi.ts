import { baseApi } from "@/redux/hooks/baseApi";
import { PatientResponse } from "@/types/patientsType";

export const patientsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPatients: builder.query<PatientResponse, void>({
            query: () => "patient/getAll",

        }),
    }),
});
export const { useGetAllPatientsQuery } = patientsApi