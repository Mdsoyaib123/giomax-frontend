import DashboardCard from "./DashboardCard";
import ClinicRevenueOverview from "./ClinicRevenueOverview";
import ClinicAppointmentStatistics from "./ClinicAppointmentStatistics";
import ClinicBookingManagementTable from "./ClinicBookingManagementTable";

const Dashboard = () => {
  return (
    <div className=" space-y-6">
      <div>
        <DashboardCard />
      </div>
      {/* part-3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4  gap-5">
        <div className="xl:col-span-2 w-full">
          <ClinicAppointmentStatistics />
        </div>
        <div className="w-full xl:col-span-2">
          <ClinicRevenueOverview />
        </div>
      </div>
      <div>
        <ClinicBookingManagementTable />
      </div>
    </div>
  );
};

export default Dashboard;
