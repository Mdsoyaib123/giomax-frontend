import SectionTitle from "@/common/SectionTitle";
import DoctorManagement from "@/components/AdminDashboard/DoctorManagement/DoctorManagement";

const DoctorManagementPage = () => {
  return (
    <div className=" space-y-6">
      <SectionTitle
        title="Doctor Management"
        description="Manage and approve doctor registrations"
      />
      <DoctorManagement />
    </div>
  );
};

export default DoctorManagementPage;
