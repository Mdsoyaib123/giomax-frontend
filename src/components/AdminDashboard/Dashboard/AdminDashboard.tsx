import DashboardCard from "./DashboardCard";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <DashboardCard />
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
