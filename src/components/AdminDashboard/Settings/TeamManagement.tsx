import React, { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Moderator";
}

const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@medconnect.com",
      role: "Admin",
    },
    {
      id: "2",
      name: "Sarah Manager",
      email: "sarah@medconnect.com",
      role: "Admin",
    },
    {
      id: "3",
      name: "John Moderator",
      email: "john@medconnect.com",
      role: "Moderator",
    },
  ]);

  const handleDeleteMember = (id: string) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id));
    }
  };

  const handleInviteMember = () => {
    alert("Invite team member functionality");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold font-sans text-gray-900 mb-2">
        Team Management
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage team members who can access this panel
      </p>

      <div className="space-y-3 mb-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex  sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3"
          >
            <div className="flex-1">
              <p className="font-semibold text-black-900">{member.name}</p>
              <p className="text-sm text-gray-600">{member.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-1 cursor-pointer rounded-lg text-sm font-medium ${
                  member.role === "Admin"
                    ? "bg-[#2A779E] text-white"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {member.role}
              </span>
              <button
                onClick={() => handleDeleteMember(member.id)}
                className="p-3 cursor-pointer text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleInviteMember}
        className="w-full py-3 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <UserPlus className="w-5 h-5" />
        Invite Team Member
      </button>
    </div>
  );
};

export default TeamManagement;
