// AdminSidebar.tsx
import logo from "@/assets/Logo/LogoMain.svg";
import logo1 from "@/assets/Logo/userLogout.svg";
import { Badge } from "@/components/ui/badge";

import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import { RxDashboard } from "react-icons/rx";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { TbCalendarUser } from "react-icons/tb";
import { BiSolidUserBadge } from "react-icons/bi";
import { HiOutlineUserMinus } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";

import { IconType } from "react-icons";
import { IoSettingsOutline } from "react-icons/io5";

// Types
export interface SidebarItem {
  icon: IconType;
  label: string;
  href?: string;
  badge?: string;
  children?: { label: string; href: string }[];
}

export interface SidebarProps {
  items?: SidebarItem[];
  onItemClick?: () => void;
}

// Sidebar Items
const defaultSidebarItems: SidebarItem[] = [
  { icon: RxDashboard, label: "Dashboard", href: "/admin-dashboard/dashboard" },
  {
    icon: FaUsers,
    label: "Patient Management",
    href: "/admin-dashboard/patient-management",
  },
  {
    icon: HiOutlineUserMinus,
    label: "Book Management",
    href: "/admin-dashboard/booking-management",
  },
  {
    icon: FaUserPlus,
    label: "Payments",
    href: "/admin-dashboard/payments",
  },
  {
    icon: BiSolidUserBadge,
    label: "Nurse Management",
    href: "/admin-dashboard/nurse-management",
  },
  {
    icon: TbCalendarUser,
    label: "Clinic Management",
    href: "/admin-dashboard/clinic-management",
  },
  {
    icon: IoSettingsOutline,
    label: "Settings",
    href: "/admin-dashboard/settings",
  },
];

const AdminSidebar: React.FC<SidebarProps> = ({
  items = defaultSidebarItems,
  onItemClick,
}) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div
      className="flex flex-col h-full bg-[#FFFFFF]"
      style={{ boxShadow: "3px 4px 42.3px 0px #0000001A" }}
    >
      {/* Logo */}
      <Link to="/admin-dashboard/dashboard">
        <div className="flex items-center justify-center  border-b border-[#E5E7EB] mt-1">
          <div className="flex justify-center mb-1">
            <img
              src={logo}
              alt="Logo"
              className="h-17 w-full max-w-[300px] object-contain"
            />
          </div>
        </div>
      </Link>
      {/* <Link to="/admin-dashboard/dashboard">
        <div className="flex items-center justify-center border-b border-[#E5E7EB] mt-1 w-full">
          <div className="flex justify-center w-full">
            <img
              src={logo}
              alt="Logo"
              className="h-17 w-full max-w-[300px] object-contain"
            />
          </div>
        </div>
      </Link> */}

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4">
        <div className="space-y-4 md:space-y-6">
          {items.map((item) => {
            const isActive =
              location.pathname === item.href ||
              item.children?.some((child) => location.pathname === child.href);
            const isOpen = openMenu === item.label;

            return (
              <div key={item.label}>
                {item.href && !item.children ? (
                  <Link
                    to={item.href}
                    onClick={onItemClick}
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-normal transition-all duration-300 ease-in-out rounded-xl ${
                      isActive
                        ? "text-white bg-[#2E6FF3] shadow-md"
                        : "text-[#343A40] hover:text-white hover:bg-[#2E6FF3]"
                    }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-[#343A40] group-hover:text-white"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-normal transition-all duration-300 ease-in-out rounded-xl cursor-pointer ${
                      isActive
                        ? "text-white bg-[#2E6FF3] shadow-md"
                        : "text-[#343A40] hover:text-white hover:bg-[#2E6FF3]"
                    }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-[#343A40] group-hover:text-white"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.children && (
                      <ChevronDown
                        className={`w-4 h-4 transform transition-transform duration-300 ${
                          isOpen
                            ? "rotate-180 text-white"
                            : "text-[#343A40] group-hover:text-white"
                        }`}
                      />
                    )}

                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-[#3A5CFF]/10 text-[#3A5CFF] border border-[#3A5CFF]/30"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                )}

                {item.children && isOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    {item.children.map((child) => {
                      const childActive = location.pathname === child.href;
                      return (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={onItemClick}
                          className={`group block px-3 py-2 text-sm rounded-lg transition-all ${
                            childActive
                              ? "text-white bg-[#2E6FF3]"
                              : "text-[#343A40] hover:text-white hover:bg-[#2E6FF3]"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Help & Support */}
      <div className=" p-2 flex justify-between items-center gap-5 bg-[#F8F9FA]  border border-[#CED4DA]  m-4 rounded-2xl">
        <div className="gap-3 flex items-center justify-baseline">
          <div>
            <img
              src={logo1}
              alt="Logo"
              className="h-16  w-full max-w-[300px] object-contain"
            />
          </div>
          <div>
            <h2 className=" text-xl font-sans font-semibold">Giorgi M.</h2>
            <p>Admin</p>
          </div>
        </div>
        <div className="  cursor-pointer">
          <FiLogOut className=" text-red-600" />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
