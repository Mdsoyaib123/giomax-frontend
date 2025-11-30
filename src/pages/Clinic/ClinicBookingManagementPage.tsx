// import SectionTitle from "@/common/SectionTitle";
import BookingManagement from "@/components/ClinicDashboard/BookingManagement/BookingManagement";

const ClinicBookingManagementPage = () => {
  return (
    <div className=" space-y-5">
      {/* <div>
        <SectionTitle title="Appointments Management" description="View and manage all clinic appointments"/>
      </div> */}

      <BookingManagement />
    </div>
  );
};

export default ClinicBookingManagementPage;
