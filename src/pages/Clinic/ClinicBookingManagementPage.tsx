import BookingManagement from "@/components/ClinicDashboard/BookingManagement/BookingManagement";

const ClinicBookingManagementPage = () => {
  return (
    <div className=" space-y-5">
      <div className="bg-cyan-100 rounded-lg px-6 py-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
      </div>

      <BookingManagement />
    </div>
  );
};

export default ClinicBookingManagementPage;
