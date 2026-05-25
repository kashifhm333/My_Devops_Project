import { Link, useLocation } from "react-router";
import { Home, Search, GitCompare, Heart, User } from "lucide-react";
import { useApp } from "../context/AppContext";

export function BottomNav() {
  const { darkMode, wishlist, compareList } = useApp();
  const location = useLocation();

  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/compare", icon: GitCompare, label: "Compare", badge: compareList.length },
    { to: "/wishlist", icon: Heart, label: "Wishlist", badge: wishlist.length },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t"
      style={{
        background: darkMode ? "rgba(10,10,30,0.97)" : "rgba(255,255,255,0.97)",
        borderColor: darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(({ to, icon: Icon, label, badge }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 relative px-3 py-1"
            >
              <div className="relative">
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: active ? "#3b82f6" : darkMode ? "#64748b" : "#94a3b8" }}
                />
                {badge != null && badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] transition-colors"
                style={{ color: active ? "#3b82f6" : darkMode ? "#64748b" : "#94a3b8" }}
              >
                {label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
