import { baseApi } from "@/redux/hooks/baseApi";
import { DashboardResponse } from "@/redux/types/admin/adminDashboard";

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPaymentData: build.query({
      query: () => ({
        url: "/payment/admin/payment-data",
        method: "GET",
      }),
      providesTags: ["PAYMENT_STATS"],
    }),

    getAdminOverview: build.query({
      query: () => ({
        url: "/admin/overview",
        method: "GET",
      }),
      providesTags: ["PAYMENT_STATS"],
    }),

    getAllTransactions: build.query({
      query: () => ({
        url: "/payment/admin/get-all-transation",
        method: "GET",
      }),
      providesTags: ["PAYMENT_STATS"],
    }),

    getDashboardStats: build.query<DashboardResponse, void>({
      query: () => ({
        url: "/admin/dashboard-stats",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to fetch dashboard stats:", error);
        }
      },
      providesTags: ["PAYMENT_STATS"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentDataQuery,
  useGetAdminOverviewQuery,
  useGetAllTransactionsQuery,
  useGetDashboardStatsQuery,
} = adminDashboardApi;
