import SectionTitle from "@/common/SectionTitle";
import TeamManagement from "./TeamManagement";
import Commission from "./Commission";
import Configuration from "./Configuration";
import Notification from "./Notification";
const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle
          title="Settings"
          description="Manage platform settings and configurations"
        />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <TeamManagement />
        <Commission />
        <Configuration />
        <Notification />
      </div>
    </div>
  );
};

export default Settings;
