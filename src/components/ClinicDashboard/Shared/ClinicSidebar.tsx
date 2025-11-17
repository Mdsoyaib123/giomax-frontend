import logo from "@/assets/Pic.png";
import { Badge } from "@/components/ui/badge";

import { RiShareBoxLine } from "react-icons/ri";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

// import { RxDashboard } from "react-icons/rx";
// import { FaUserPlus } from "react-icons/fa";
// import { HiOutlineUserMinus } from "react-icons/hi2";
import img1 from "@/assets/side1.png";
import img2 from "@/assets/side2.png";
import img3 from "@/assets/side3.png";
import img4 from "@/assets/side4.png";
import img5 from "@/assets/side5.png";
import img6 from "@/assets/side6.png";
import img7 from "@/assets/side7.png";

// import { IconType } from "react-icons";

// Types
export interface SidebarItem {
  icon: string; // This is now the image path
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
  { icon: img1, label: "Dashboard", href: "/clinic-dashboard/dashboard" },
  { icon: img2, label: "Parient List", href: "/clinic-dashboard/patient-list" },
  {
    icon: img3,
    label: "Doctor Management",
    href: "/clinic-dashboard/doctor-management",
  },
  {
    icon: img4,
    label: "Booking Management",
    href: "/clinic-dashboard/booking-management",
  },
  { icon: img5, label: "Payment & Earning", href: "/clinic-dashboard/payment" },
  { icon: img6, label: "Messages", href: "/clinic-dashboard/message" },
  { icon: img7, label: "Setting", href: "/clinic-dashboard/settings" },
];

const ClinicSidebar: React.FC<SidebarProps> = ({
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
        <div className="flex items-center border-b border-gray-200 mt-1 p-2">
          <div className="flex-shrink-0 w-12 h-12 mr-3">
            <img
              src={logo}
              alt="Wardier Medical Clinic Logo"
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <p className="text-base text-[#000000] font-bold">
              Wardier Medical Clinic
              <span className="block text-[12px] text-gray-500">
                Powered by Med Connect
              </span>
            </p>
          </div>
        </div>
      </Link>

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
                      <img
                        src={item.icon}
                        alt={item.label}
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
                      <img
                        src={item.icon}
                        alt={item.label}
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
      <div className="border-t border-[#C9C6C3]">
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="h-16 w-full max-w-[300px] object-contain"
          />
        </div>
        <Link
          to="/client-dashboard/help-support"
          className="flex items-center justify-center space-x-3 text-[#343A40] hover:text-sky-500 transition-colors px-3 py-2 rounded-lg"
        >
          <span className="text-sm font-medium">Help & Support</span>
          <RiShareBoxLine className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ClinicSidebar;
