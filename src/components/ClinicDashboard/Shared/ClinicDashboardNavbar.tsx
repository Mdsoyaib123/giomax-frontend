import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoMdArrowDropdownCircle } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo1 from "@/assets/Logo/userLogout.svg";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AdvancedFilter from "./AdvancedFilter";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { logOut } from "@/redux/features/auth/authSlice";
import { useGetAClinicQuery } from "@/redux/features/admin/clinic/clinicBasicApi";

export interface NavbarProps {
  onMobileMenuToggle: () => void;
  notificationCount?: number;
  userName?: string;
  isSidebarOpen: boolean;
}

const ClinicDashboardNavbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  isSidebarOpen,
}) => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  // const [isNotifOpen, setIsNotifOpen] = useState(false);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };
  const { data: clinicResponse } = useGetAClinicQuery(userId!, {
    skip: !userId,
  });
  const clinic = clinicResponse?.data;
  useEffect(() => {
    if (!clinic?.userId) return;

    setProfileImage(clinic.userId.profileImage ?? null);
    setClinicName(clinic.userId.fullName ?? "");
  }, [clinic]);

  return (
    <div className="bg-white border-b border-gray-200">
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

          {/* Search Box */}
          <div className="flex items-center pl-0 md:pl-2 lg:pl-70">
            <div className="relative w-full flex justify-end md:justify-start">
              {/* Mobile Search */}
              {/* <div className="block md:hidden">
                {isSearchOpen ? (
                  <div className="relative w-[220px] sm:w-[260px]">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search anything here..."
                      onClick={() => setIsFilterOpen(true)}
                      className="w-full bg-gray-100 pl-3 pr-10 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <IoIosSearch
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    />
                  </div>
                ) : (
                  <IoIosSearch
                    onClick={() => setIsSearchOpen(true)}
                    className="text-2xl text-gray-500 cursor-pointer"
                  />
                )}
              </div> */}

              {/* Desktop Search */}
              {/* <div className="hidden md:block relative w-full min-w-lg lg:max-w-3xl">
                <input
                  type="text"
                  placeholder="Search anything here..."
                  onClick={() => setIsFilterOpen(true)}
                  className="w-full bg-gray-100 pl-3 pr-10 py-3 text-sm md:text-base rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiFilter
                  onClick={() => setIsFilterOpen(true)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              </div> */}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notification */}
          {/* <div
            className="relative p-2 border border-gray-300 rounded-xl w-fit cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsNotifOpen(true)}
          >
            <IoMdNotificationsOutline className="w-8 h-8" />
            <span className="absolute top-0.5 right-2 bg-green-600 text-white text-xs font-semibold rounded-2xl w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div> */}

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="p-2 flex justify-between items-center gap-5 m-4 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={profileImage || logo1}
                    alt="User"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold whitespace-nowrap">
                      {clinicName}
                    </h2>
                    <p>Clinic</p>
                  </div>
                </div>
                <IoMdArrowDropdownCircle className="text-sky-500 h-9 w-6" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-white w-60 shadow-lg rounded-xl border border-gray-200 p-2"
            >
              <Link to="/clinic-dashboard/settings">
                <DropdownMenuItem
                  className={`px-4 py-3 mb-1 cursor-pointer rounded-lg text-base font-medium transition-colors ${
                    activeItem === "settings"
                      ? "bg-blue-400 text-white"
                      : "text-gray-700 hover:bg-blue-400 hover:text-white"
                  }`}
                  onClick={() => setActiveItem("settings")}
                >
                  Settings
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                className={`px-4 py-3 cursor-pointer rounded-lg text-base font-medium transition-colors ${
                  activeItem === "signout"
                    ? "bg-blue-400 text-white"
                    : "text-gray-700 hover:bg-blue-400 hover:text-white"
                }`}
                onClick={handleLogout}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Notification Drawer */}
      {/* {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsNotifOpen(false)}
          ></div>

          <div className="relative w-96 bg-white h-full shadow-xl overflow-y-auto">
            <NotificationPanel onClose={() => setIsNotifOpen(false)} />
          </div>
        </div>
      )} */}

      {/* Advanced Filter Modal */}
      {isFilterOpen && (
        <AdvancedFilter onClose={() => setIsFilterOpen(false)} />
      )}
    </div>
  );
};

export default ClinicDashboardNavbar;

// import { Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   IoIosSearch,
//   IoMdArrowDropdownCircle,
//   IoMdNotificationsOutline,
// } from "react-icons/io";
// import { FiFilter } from "react-icons/fi";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import logo1 from "@/assets/Logo/userLogout.svg";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import NotificationPanel from "@/components/AdminDashboard/Shared/NotificationPanel";
// // import NotificationPanel from "@/components/AdminDashboard";

// export interface NavbarProps {
//   onMobileMenuToggle: () => void;
//   notificationCount?: number;
//   userName?: string;
//   isSidebarOpen: boolean;
// }

// const ClinicDashboardNavbar: React.FC<NavbarProps> = ({
//   onMobileMenuToggle,
//   isSidebarOpen,
// }) => {
//   const [isNotifOpen, setIsNotifOpen] = useState(false); // Notification panel state
//   const [isSearchOpen, setIsSearchOpen] = useState(false); // Mobile search

//   return (
//     <div className="bg-white border-b border-gray-200">
//       <header
//         className={`flex items-center justify-between h-17 px-4 md:px-8 mb-2 ${isSidebarOpen ? "max-w-[1400px] mx-auto" : ""
//           }`}
//       >
//         {/* Left Section */}
//         <div className="flex items-center space-x-4">
//           {/* Mobile Menu */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="lg:hidden text-black cursor-pointer"
//             onClick={onMobileMenuToggle}
//           >
//             <Menu className="w-6 h-6" />
//           </Button>

//           {/* Search Box */}
//           <div className="flex items-center pl-0 md:pl-2 lg:pl-70">
//             <div className="relative w-full flex justify-end md:justify-start">
//               {/* Mobile Search */}
//               <div className="block md:hidden">
//                 {isSearchOpen ? (
//                   <div className="relative w-[220px] sm:w-[260px]">
//                     <input
//                       type="text"
//                       autoFocus
//                       placeholder="Search anything here..."
//                       className="w-full bg-gray-100 pl-3 pr-10 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <IoIosSearch
//                       onClick={() => setIsSearchOpen(false)}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
//                     />
//                   </div>
//                 ) : (
//                   <IoIosSearch
//                     onClick={() => setIsSearchOpen(true)}
//                     className="text-2xl text-gray-500 cursor-pointer"
//                   />
//                 )}
//               </div>

//               {/* Desktop Search */}
//               <div className="hidden md:block relative w-full min-w-lg lg:max-w-3xl">
//                 <input
//                   type="text"
//                   placeholder="Search anything here..."
//                   className="w-full bg-gray-100 pl-3 pr-10 py-3 text-sm md:text-base rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center space-x-4">
//           {/* Notification Button */}
//           <div
//             className="relative p-2 border border-gray-300 rounded-xl w-fit cursor-pointer"
//             onClick={() => setIsNotifOpen(true)}
//           >
//             <IoMdNotificationsOutline className="w-8 h-8" />
//             <span className="absolute top-0.5 right-2 bg-green-600 text-white text-xs font-semibold rounded-2xl w-5 h-5 flex items-center justify-center">
//               3
//             </span>
//           </div>

//           {/* User Dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <div className="p-2 flex justify-between items-center gap-5 m-4 rounded-2xl cursor-pointer">
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={logo1}
//                     alt="User"
//                     className="h-12 w-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <h2 className="text-xl font-semibold whitespace-nowrap">
//                       Giorgi M.
//                     </h2>
//                     <p>Admin</p>
//                   </div>
//                 </div>
//                 <IoMdArrowDropdownCircle className="text-sky-500 h-9 w-6" />
//               </div>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent
//               align="end"
//               className="bg-blue-700 text-white w-60 shadow-2xl rounded-3xl border border-blue-500/40 overflow-hidden"
//             >
//               <Link to="/admin-dashboard/settings">
//                 <DropdownMenuItem className="px-4 py-2 cursor-pointer hover:bg-yellow-50 hover:text-black">
//                   Settings
//                 </DropdownMenuItem>
//               </Link>
//               <DropdownMenuItem className="px-4 py-2 cursor-pointer hover:bg-yellow-50 hover:text-black">
//                 Terms & Conditions
//               </DropdownMenuItem>
//               <DropdownMenuItem className="px-4 py-2 cursor-pointer hover:bg-yellow-50 hover:text-black">
//                 Privacy Policy
//               </DropdownMenuItem>
//               <DropdownMenuItem className="px-4 py-2 cursor-pointer hover:bg-red-600 hover:text-black">
//                 Sign Out
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </header>

//       {/* Notification Drawer */}
//       {isNotifOpen && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 bg-black/40"
//             onClick={() => setIsNotifOpen(false)}
//           ></div>

//           {/* Panel */}
//           <div className="relative w-96 bg-white h-full shadow-xl overflow-y-auto">
//             <NotificationPanel onClose={() => setIsNotifOpen(false)} />

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClinicDashboardNavbar;
