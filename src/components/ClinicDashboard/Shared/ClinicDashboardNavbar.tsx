import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoIosSearch } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import user from "@/assets/icons/user.svg";
import { Link } from "react-router-dom";
import { useState } from "react";

export interface NavbarProps {
  onMobileMenuToggle: () => void;
  notificationCount?: number;
  userName?: string;
  isSidebarOpen: boolean;
}

const ClinicDashboardNavbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,

  // userName = "Gemini Chachi",
  isSidebarOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" bg-[#FFFFFF] border-b border-[#E5E7EB]">
      <header
        className={`flex items-center justify-between h-17 px-4 md:px-8 mb-2 ${
          isSidebarOpen ? "max-w-[1400px] mx-auto" : ""
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-black cursor-pointer"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Logo + Dashboard text */}
          {/* <div className="flex items-center space-x-2 pl-0 md:pl-2 lg:pl-70">
            <div className="relative w-full min-w-lg">
              <input
                type="text"
                placeholder="Search anything here...."
                className="w-full bg-[#F5F7FB] pl-3 pr-10 py-3 text-sm md:text-base   rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <IoIosSearch className="bg-[#F5F7FB] absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div> */}

          <div className="flex items-center pl-0 md:pl-2 lg:pl-70">
            {/* Search Container */}
            <div className="relative w-full flex justify-end md:justify-start">
              {/* Mobile View */}
              <div className="block md:hidden">
                {isOpen ? (
                  <div className="relative transition-all duration-300 ease-in-out w-[220px] sm:w-[260px]">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search anything here..."
                      className="w-full bg-[#F5F7FB] pl-3 pr-10 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <IoIosSearch
                      onClick={() => setIsOpen(false)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    />
                  </div>
                ) : (
                  <IoIosSearch
                    onClick={() => setIsOpen(true)}
                    className="text-2xl text-gray-500 cursor-pointer"
                  />
                )}
              </div>

              {/* Desktop / Large Devices */}
              <div className="hidden md:block relative w-full min-w-lg lg:max-w-4xl">
                <input
                  type="text"
                  placeholder="Search anything here..."
                  className="w-full bg-[#F5F7FB] pl-3 pr-10 py-3 text-sm md:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <IoIosSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Dashboard Icon */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white cursor-pointer"
              >
                <img src={user} alt="User" className="w-6 h-6 rounded-full" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-[#346778] text-white w-60 shadow-2xl rounded-3xl border border-[#3A5CFF]/40 backdrop-blur-md overflow-hidden animate-fadeIn"
            >
              <Link to="/admin-dashboard/settings">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[#FEF7ED] hover:text-black transition-colors cursor-pointer">
                  {/* <IoMdSettings className="text-white hover:text-black transition-colors duration-300 cursor-pointer" /> */}
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[#FEF7ED] hover:text-black transition-colors cursor-pointer">
                {/* <RiFileList3Fill className="text-white hover:text-black" /> */}
                <span className="font-medium">Terms & Conditions</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[#FEF7ED] hover:text-black transition-colors cursor-pointer">
                {/* <MdPrivacyTip className="text-white hover:text-black" /> */}
                <span className="font-medium">Privacy Policy</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-red-600 hover:text-black transition-colors cursor-pointer">
                {/* <RiLogoutBoxRLine className="text-red-500" /> */}
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default ClinicDashboardNavbar;
