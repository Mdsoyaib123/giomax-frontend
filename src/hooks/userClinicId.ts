/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSignalClinicQuery } from "@/redux/features/doctors/doctorsApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";

interface UseSingleClinicResult {
    clinicId: string | null;
    isLoading: boolean;
    isError: boolean;
    error: any;
}

export const useSingleClinicId = (): UseSingleClinicResult => {
    const user = useAppSelector((state) => state.auth.user);

    const userId = user?.id ?? "";

    const { data, isLoading, isError, error } = useGetSignalClinicQuery(userId, {
        skip: !userId,
    });


    const clinicId = data?.data?._id || null;

    return { clinicId, isLoading, isError, error };
};
