import { Outlet, useLocation } from "react-router";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { useApp } from "../context/AppContext";

export function Root() {
  const { darkMode } = useApp();
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";
  const isLogin = location.pathname === "/login";

  if (isAdmin || isLogin) {
    return <Outlet />;
  }

  return (
    <div style={{ background: darkMode ? "#070b14" : "#f8faff" }}>
      <Navbar />
      <main className="pb-20 sm:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
