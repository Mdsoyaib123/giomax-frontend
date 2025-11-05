import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div>
      <main className="bg-gradient-to-r from-[#29424C] via-[#0b2521] to-[#052c1e]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
