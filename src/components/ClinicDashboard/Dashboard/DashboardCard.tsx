import { FaUserInjured, FaCalendarCheck } from "react-icons/fa";
import { MdPendingActions, MdCheckCircle } from "react-icons/md";
import { useSingleClinicId } from "@/hooks/userClinicId";
import { useGetClinicDashboardQuery } from "@/redux/features/doctors/doctorsApi";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardCard = () => {
  const { clinicId, isLoading: isClinicIdLoading } = useSingleClinicId();
  const { data, isLoading, isError } = useGetClinicDashboardQuery(
    clinicId as string,
    { skip: !clinicId }
  );

  // Extract data from API response
  const dashboardData = data?.data || {};

  // Only show the data we actually have from the API
  const statusData = [
    {
      title: "Total Patients",
      amount: dashboardData.totalPatients?.toString() || "0",
      change: "0",
      unit: "in clinic",
      icon: <FaUserInjured className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Appointments",
      amount: dashboardData.totalAppointments?.toString() || "0",
      change: "0",
      unit: "all time",
      icon: <FaCalendarCheck className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Appointments",
      amount: dashboardData.totalPendingAppointments?.toString() || "0",
      change: "0",
      unit: "awaiting confirmation",
      icon: <MdPendingActions className="w-6 h-6 text-yellow-500" />,
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed Appointments",
      amount: dashboardData.totalCompletedAppointments?.toString() || "0",
      change: "0",
      unit: "successfully served",
      icon: <MdCheckCircle className="w-6 h-6 text-purple-500" />,
      bgColor: "bg-purple-50",
    },
  ];

  if (isLoading || isClinicIdLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-2xl border border-[#E5E7EB] p-6 flex flex-col"
          >
            <Skeleton className="w-12 h-12 rounded-xl mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-3" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center col-span-4">
        <p className="text-red-600 font-medium">
          Failed to load dashboard data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {statusData.map((single) => {
        return (
          <div
            key={single.title}
            className="bg-white shadow-sm hover:shadow-md transition-all rounded-2xl border border-[#E5E7EB] p-6 flex flex-col"
          >
            {/* Icon */}
            <div
              className={`${single.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
            >
              {single.icon}
            </div>

            {/* Title */}
            <h3 className="text-[#6B7280] text-sm font-normal mb-2">
              {single.title}
            </h3>

            {/* Amount */}
            <h2 className="text-[#111827] text-3xl font-semibold mb-3">
              {single.amount}
            </h2>

            {/* Description */}
            <div className="flex items-center gap-1 mt-2 pb-2">
              <span className="text-xs text-[#6B7280]">{single.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;
