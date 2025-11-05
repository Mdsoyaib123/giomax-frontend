import AdminDashboardNavBar from "@/components/AdminDashboard/Shared/AdminDashboardNavBar";
import AdminSidebar from "@/components/AdminDashboard/Shared/AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { pathname } = useLocation();

  const shouldHideNavbar = pathname === "/client-dashboard/invoice-form";

  const shouldHideSidebar = () => {
    const hideExact = ["/client-dashboard/add-product"];

    const pathnameSegments = pathname.split("/");

    const isProductDetails =
      pathname.startsWith("/client-dashboard/all-products/") &&
      pathnameSegments.length === 4;

    const isOrderDetails =
      pathname.startsWith("/client-dashboard/all-orders/") &&
      pathnameSegments.length === 4;

    const isBuyerProfile =
      pathname.startsWith("/client-dashboard/all-orders/") &&
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
      (pathname.startsWith("/client-dashboard/all-products/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/client-dashboard/all-orders/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/client-dashboard/all-orders/") &&
        pathnameSegments.length === 5 &&
        pathname.endsWith("/buyer-profile"));

    const isAddProduct = pathname === "/client-dashboard/add-product";
    const isAllProduct = pathname === "/client-dashboard/all-products";
    const isAllOrder = pathname === "/client-dashboard/all-orders";
    const isInquiries = pathname === "/client-dashboard/inquiries-details";
    const isInvoice = pathname === "/client-dashboard/invoice-form";

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
          <AdminSidebar />
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
            <AdminDashboardNavBar
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
          <SheetContent side="left" className="w-72 p-0 bg-[#FFFFFF] border border-[#E5E7EB]">
            <AdminSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
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

export default AdminLayout;
