import AuditComplianceLog from "./AuditComplianceLog";
import ExternalIntegrationStatus from "./ExternalIntegrationStatus";
import SystemDefaults from "./SystemDefaults";

const Settings = () => {
  return (
    <div className=" space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4  gap-5">
        <div className="xl:col-span-2 w-full">
          <SystemDefaults />
        </div>
        <div className="w-full xl:col-span-2">
          <AuditComplianceLog />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4  gap-5">
        <div className="xl:col-span-4 w-full">
          <ExternalIntegrationStatus />
        </div>
      </div>
    </div>
  );
};

export default Settings;
