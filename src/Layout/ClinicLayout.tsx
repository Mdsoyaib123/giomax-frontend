import ClinicDashboardNavbar from "@/components/ClinicDashboard/Shared/ClinicDashboardNavbar";
import ClinicSidebar from "@/components/ClinicDashboard/Shared/ClinicSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const ClinicLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { pathname } = useLocation();

  const shouldHideNavbar = pathname === "/clinic-dashboard/invoice-form";

  const shouldHideSidebar = () => {
    const hideExact = ["/clinic-dashboard/add-product"];

    const pathnameSegments = pathname.split("/");

    const isProductDetails =
      pathname.startsWith("/clinic-dashboard/all-products/") &&
      pathnameSegments.length === 4;

    const isOrderDetails =
      pathname.startsWith("/clinic-dashboard/all-orders/") &&
      pathnameSegments.length === 4;

    const isBuyerProfile =
      pathname.startsWith("/clinic-dashboard/all-orders/") &&
      pathnameSegments.length === 5 &&
      pathname.endsWith("/buyer-profile");

    return (
      hideExact.includes(pathname) ||
      isProductDetails ||
      isOrderDetails ||
      isBuyerProfile
    );
  };

  useEffect(() => {
    const pathnameSegments = pathname.split("/");

    const isDetailView =
      (pathname.startsWith("/clinic-dashboard/all-products/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/clinic-dashboard/all-orders/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/clinic-dashboard/all-orders/") &&
        pathnameSegments.length === 5 &&
        pathname.endsWith("/buyer-profile"));

    const isAddProduct = pathname === "/clinic-dashboard/add-product";
    const isAllProduct = pathname === "/clinic-dashboard/all-products";
    const isAllOrder = pathname === "/clinic-dashboard/all-orders";
    const isInquiries = pathname === "/clinic-dashboard/inquiries-details";
    const isInvoice = pathname === "/clinic-dashboard/invoice-form";

    setIsSidebarOpen(
      isDetailView ||
        isAddProduct ||
        isAllProduct ||
        isAllOrder ||
        isInquiries ||
        isInvoice
    );
  }, [pathname]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Sidebar - Fixed on Desktop */}
      {!shouldHideSidebar() && (
        <div className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-30  bg-[#FFFFFF]">
          <ClinicSidebar />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-200 ease-in-out ${
          !shouldHideSidebar() ? "lg:ml-72" : ""
        }`}
      >
        {/* Navbar */}
        {!shouldHideNavbar && (
          <div className="fixed top-0 left-0 right-0 z-20  bg-[#FFFFFF] ">
            <ClinicDashboardNavbar
              onMobileMenuToggle={handleMobileMenuToggle}
              notificationCount={3}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        )}

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <div className="hidden" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 p-0 bg-[#FFFFFF] border border-[#E5E7EB]"
          >
            <ClinicSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Scrollable Page Content */}
        <main
          className={`flex-1 overflow-y-auto mt-16 text-black bg-[#F9FAFB] ${
            isSidebarOpen ? "pt-4 md:pt-10" : "p-4 md:p-10"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClinicLayout;

// import AdminDashboardNavBar from "@/components/AdminDashboard/Shared/AdminDashboardNavBar";
// import AdminSidebar from "@/components/AdminDashboard/Shared/AdminSidebar";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { useEffect, useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";

// const ClientLayout = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const { pathname } = useLocation();

//   const shouldHideNavbar = pathname === "/clinic-dashboard/invoice-form";

//   const shouldHideSidebar = () => {
//     const hideExact = ["/clinic-dashboard/add-product"];

//     const pathnameSegments = pathname.split("/");

//     const isProductDetails =
//       pathname.startsWith("/clinic-dashboard/all-products/") &&
//       pathnameSegments.length === 4;

//     const isOrderDetails =
//       pathname.startsWith("/clinic-dashboard/all-orders/") &&
//       pathnameSegments.length === 4;

//     const isBuyerProfile =
//       pathname.startsWith("/clinic-dashboard/all-orders/") &&
//       pathnameSegments.length === 5 &&
//       pathname.endsWith("/buyer-profile");

//     return (
//       hideExact.includes(pathname) ||
//       isProductDetails ||
//       isOrderDetails ||
//       isBuyerProfile
//     );
//   };

//   useEffect(() => {
//     const pathnameSegments = pathname.split("/");

//     const isDetailView =
//       (pathname.startsWith("/clinic-dashboard/all-products/") &&
//         pathnameSegments.length === 4) ||
//       (pathname.startsWith("/clinic-dashboard/all-orders/") &&
//         pathnameSegments.length === 4) ||
//       (pathname.startsWith("/clinic-dashboard/all-orders/") &&
//         pathnameSegments.length === 5 &&
//         pathname.endsWith("/buyer-profile"));

//     const isAddProduct = pathname === "/clinic-dashboard/add-product";
//     const isAllProduct = pathname === "/clinic-dashboard/all-products";
//     const isAllOrder = pathname === "/clinic-dashboard/all-orders";
//     const isInquiries = pathname === "/clinic-dashboard/inquiries-details";
//     const isInvoice = pathname === "/clinic-dashboard/invoice-form";

//     setIsSidebarOpen(
//       isDetailView ||
//         isAddProduct ||
//         isAllProduct ||
//         isAllOrder ||
//         isInquiries ||
//         isInvoice
//     );
//   }, [pathname]);

//   const handleMobileMenuToggle = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-linear-to-r from-[#052318] via-[#0A1C19] to-[#0F131B]">
//       {/* Sidebar - Fixed on Desktop */}
//       {!shouldHideSidebar() && (
//         <div className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-30  bg-[#052218]">
//           <AdminSidebar />
//         </div>
//       )}

//       {/* Main Content */}
//       <div
//         className={`flex flex-col flex-1 transition-all duration-200 ease-in-out ${
//           !shouldHideSidebar() ? "lg:ml-72" : ""
//         }`}
//       >
//         {/* Navbar */}
//         {!shouldHideNavbar && (
//           <div className="fixed top-0 left-0 right-0 z-20 bg-white ">
//             <AdminDashboardNavBar
//               onMobileMenuToggle={handleMobileMenuToggle}
//               notificationCount={3}
//               isSidebarOpen={isSidebarOpen}
//             />
//           </div>
//         )}

//         {/* Mobile Sidebar */}
//         <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
//           <SheetTrigger asChild>
//             <div className="hidden" />
//           </SheetTrigger>
//           <SheetContent side="left" className="w-72 p-0 bg-[#0E131A]">
//             <AdminSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
//           </SheetContent>
//         </Sheet>

//         {/* Scrollable Page Content */}
//         <main
//           className={`flex-1 overflow-y-auto mt-16 text-black bg-[#EBE8E3] ${
//             isSidebarOpen ? "pt-4 md:pt-10" : "p-4 md:p-10"
//           }`}
//         >
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ClientLayout;
