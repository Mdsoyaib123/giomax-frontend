import SectionTitle from "@/common/SectionTitle";
import ClinicManagementTable from "./ClinicManagementTable";

const ClinicManagement = () => {
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle
          title="Clinic Management"
          description="Manage and approve clinic registrations"
        />
      </div>
      <div>
        <ClinicManagementTable />
      </div>
    </div>
  );
};

export default ClinicManagement;
