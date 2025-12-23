import SectionTitle from "@/common/SectionTitle";
import PatientManagement from "@/components/AdminDashboard/PatientManagement/PatientManagement";

const PatientManagementPage = () => {
  return (
    <div className="space-y-10">
      <div>
        <SectionTitle
          title="Patient Management"
          description="Manage and monitor all registered patients."
        />
      </div>
      <PatientManagement />
    </div>
  );
};

export default PatientManagementPage;
