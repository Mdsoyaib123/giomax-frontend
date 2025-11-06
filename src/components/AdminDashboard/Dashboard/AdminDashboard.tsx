import AppointmentStatistics from "./AppointmentStatistics";
import DashboardCard from "./DashboardCard";
import QuickActions from "./QuickActions";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <DashboardCard />
      </div>
      {/* part-3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4  gap-5">
        <div className="xl:col-span-2 w-full">
          <AppointmentStatistics />
        </div>
        <div className="w-full xl:col-span-2">
          <AppointmentStatistics />
        </div>
      </div>
      <div>
        <QuickActions />
      </div>
    </div>
  );
};

export default AdminDashboard;

//  <div className="flex flex-col lg:flex-row w-full gap-5">
//         <div className="w-full lg:w-1/2">
//           <RevenueOverview />
//         </div>
//         <div className="w-full lg:w-1/2">
//           <ProfitLossSummary />
//         </div>
//       </div>
