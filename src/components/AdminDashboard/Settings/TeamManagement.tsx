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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[320px]">
      <h2 className="text-xl font-semibold font-sans text-gray-900 mb-2">
        Team Management
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage team members who can access this panel
      </p>

      {/* Members list */}
      <div className="space-y-3 mb-6 flex-1">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3"
          >
            <div className="flex-1">
              <p className="font-semibold text-black-900">{member.name}</p>
              <p className="text-sm text-gray-600">{member.email}</p>
            </div>
            <div className="flex items-center gap-2">

              {/* Admin + Moderator Tag */}
              <span className="px-4 py-1 cursor-pointer rounded-lg text-sm font-medium bg-[#2A779E] text-white">
                {member.role}
              </span>

              <button
                onClick={() => handleDeleteMember(member.id)}
                className="p-3 cursor-pointer text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Team Member Button */}
      <button
        onClick={handleInviteMember}
        className="w-full py-3 border-2 cursor-pointer border-blue-600 text-blue-600 rounded-lg bg-[#EFF4FF]
        hover:bg-[#155DFC] hover:text-white font-medium transition-colors flex items-center justify-center gap-2"
      >
        <UserPlus className="w-5 h-5" />
        Invite Team Member
      </button>
    </div>
  );
};

export default TeamManagement;
