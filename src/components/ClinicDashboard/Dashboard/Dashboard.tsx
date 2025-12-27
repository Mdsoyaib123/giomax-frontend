import DashboardCard from "./DashboardCard";

import ClinicBookingManagementTable from "./ClinicBookingManagementTable";
import SectionTitle from "@/common/SectionTitle";

const Dashboard = () => {
  return (
    <div className=" space-y-6">
      <div>
        <SectionTitle
          title="Dashboard Overview"
          description="Welcome back Giorgi! Here's overview of what's happening today."
        />
      </div>
      <div>
        <DashboardCard />
      </div>
      {/* part-3 */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4  gap-5">
        <div className="xl:col-span-2 w-full">
          <ClinicAppointmentStatistics />
        </div>
        <div className="w-full xl:col-span-2">
          <ClinicRevenueOverview />
        </div>
      </div> */}
      <div>
        <ClinicBookingManagementTable />
      </div>
    </div>
  );
};

export default Dashboard;
