import SectionTitle from "@/common/SectionTitle";
import NurseManagement from "@/components/AdminDashboard/NurseManagement/NurseManagement";

const NurseManagementPage = () => {
  return (
    <div className=" space-y-6">
      <SectionTitle
        title="Nurse Management"
        description="Manage and approve nurse registrations"
      />
      <NurseManagement />
    </div>
  );
};

export default NurseManagementPage;
