import { Badge } from "@/components/ui/badge";
import { BiMessageRoundedDetail } from "react-icons/bi";

import {
  Calendar,
  ChartPie,
  ChevronDown,
  CreditCard,
  Hospital,
  LogOut,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { logOut } from "@/redux/features/auth/authSlice";
import { useGetAClinicQuery } from "@/redux/features/admin/clinic/clinicBasicApi";

// Types
export interface SidebarItem {
  icon: ReactNode;
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
  {
    icon: <ChartPie />,
    label: "Dashboard",
    href: "/clinic-dashboard/dashboard",
  },
  {
    icon: <Users />,
    label: "Patient List",
    href: "/clinic-dashboard/patient-list",
  },
  {
    icon: <Stethoscope />,
    label: "Doctor Management",
    href: "/clinic-dashboard/doctor-management",
  },
  {
    icon: <Calendar />,
    label: "Book Management",
    href: "/clinic-dashboard/booking-management",
  },
  {
    icon: <CreditCard />,
    label: "Payment & Earning",
    href: "/clinic-dashboard/payment",
  },
  {
    icon: <BiMessageRoundedDetail />,
    label: "Messages",
    href: "/clinic-dashboard/message",
  },
  { icon: <Settings />, label: "Setting", href: "/clinic-dashboard/settings" },
];

const ClinicSidebar: React.FC<SidebarProps> = ({
  items = defaultSidebarItems,
  onItemClick,
}) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState<string | null>("");

  const { data: clinicResponse } = useGetAClinicQuery(userId!, {
    skip: !userId,
  });

  const clinic = clinicResponse?.data;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };
  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };
  useEffect(() => {
      if (!clinic?.userId) return;
  
      setProfileImage(clinic.userId.profileImage ?? null);
      setClinicName(clinic.userId.fullName ?? "");
    }, [clinic]);

  // FIXED ICON RENDER
  const renderIcon = (icon: ReactNode, alt: string) =>
    typeof icon === "string" ? (
      <img src={icon} alt={alt} className="size-14 rounded-full object-cover" />
    ) : (
      icon
    );

  // const adminData = data?.data;

  return (
    <div
      className="flex flex-col h-full bg-[#FFFFFF]"
      style={{ boxShadow: "3px 4px 42.3px 0px #0000001A" }}
    >
      {/* Logo */}
      <Link to="/clinic-dashboard/dashboard">
        <div className="flex items-center border-b border-gray-200 mt-1 p-2">
          <div className="shrink-0 w-12 h-12 mr-3">
            {
              profileImage ? (
                <img
                  src={profileImage}
                  alt="Wardier Medical Clinic Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-full bg-[#2E6FF3] text-white"><Hospital /></div>
              )
           }
          </div>
          <div>
            <p className="text-base text-[#000000] font-bold">
             {clinicName}
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
                {/* Link Without Children */}
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
                      {renderIcon(item.icon, item.label)}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  // Dropdown Parent Button
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-normal transition-all duration-300 ease-in-out rounded-xl cursor-pointer ${
                      isActive
                        ? "text-white bg-[#2E6FF3] shadow-md"
                        : "text-[#343A40] hover:text-white hover:bg-[#2E6FF3]"
                    }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      {renderIcon(item.icon, item.label)}
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

                {/* Dropdown Items */}
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
      <div
        onClick={handleLogout}
        className="p-2 cursor-pointer flex justify-between items-center gap-5 bg-[#F8F9FA] border border-[#CED4DA] m-4 rounded-2xl"
      >
        {/* Left Section */}
        <div className="gap-3 flex items-center">
          <div>
            <img
              src={clinic?.userId?.profileImage || "/default-avatar.png"}
              alt="Avatar"
              className="h-14 w-14 object-cover rounded-2xl"
            />
          </div>

          <div>
            <h2 className="text-xl font-sans font-semibold">
              {clinic?.userId?.fullName || "Admin"}
            </h2>
            <p className="text-sm text-gray-600">
              {clinic?.userId?.role || "admin"}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="cursor-pointer text-red-600">
          <LogOut />
        </div>
      </div>
    </div>
  );
};

export default ClinicSidebar;
