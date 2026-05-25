import { Link, useNavigate } from "react-router";
import { Heart, GitCompare, Bell, Clock, Star, Settings, LogOut, ChevronRight, User } from "lucide-react";
import { phones } from "../data/mockData";
import { useApp } from "../context/AppContext";

export function ProfilePage() {
  const { darkMode, wishlist, compareList, recentlyViewed, isLoggedIn, logout } = useApp();
  const navigate = useNavigate();

  const bg = darkMode ? "#070b14" : "#f8faff";
  const cardBg = darkMode ? "rgba(15,23,42,0.8)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: darkMode ? "rgba(59,130,246,0.1)" : "#eff6ff" }}>
            <User className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: text }}>Sign in to view your profile</h2>
          <p className="mb-6" style={{ color: muted }}>Track wishlists, compare phones, and get personalized alerts</p>
          <Link to="/login" className="px-8 py-3 rounded-xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
            Sign In / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const recentPhones = phones.filter((p) => recentlyViewed.includes(p.id)).slice(0, 4);
  const wishlistPhones = phones.filter((p) => wishlist.includes(p.id)).slice(0, 3);

  const stats = [
    { icon: Heart, label: "Wishlist", value: wishlist.length, color: "#ef4444", to: "/wishlist" },
    { icon: GitCompare, label: "Comparing", value: compareList.length, color: "#3b82f6", to: "/compare" },
    { icon: Bell, label: "Alerts", value: 2, color: "#f59e0b", to: "/tracker" },
    { icon: Clock, label: "Viewed", value: recentlyViewed.length, color: "#8b5cf6", to: "#" },
  ];

  const menuItems = [
    { icon: Heart, label: "My Wishlist", sub: `${wishlist.length} phones saved`, to: "/wishlist" },
    { icon: GitCompare, label: "Compare List", sub: `${compareList.length} phones`, to: "/compare" },
    { icon: Bell, label: "Price Alerts", sub: "2 active alerts", to: "/tracker" },
    { icon: Star, label: "My Reviews", sub: "0 reviews", to: "#" },
    { icon: Settings, label: "Settings", sub: "Account preferences", to: "#" },
  ];

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="p-6 rounded-3xl border mb-6" style={{ background: cardBg, borderColor: border }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              A
            </div>
            <div>
              <h2 className="font-bold text-lg" style={{ color: text }}>Kashif Hussain</h2>
              <p className="text-sm" style={{ color: muted }}>kashif@example.com</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">Free Account</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {stats.map(({ icon: Icon, label, value, color, to }) => (
              <Link key={label} to={to}
                className="p-3 rounded-2xl border text-center transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: border, background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc" }}>
                <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
                <p className="font-bold" style={{ color }}>{value}</p>
                <p className="text-[10px]" style={{ color: muted }}>{label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="p-4 rounded-3xl border mb-6" style={{ background: cardBg, borderColor: border }}>
          {menuItems.map(({ icon: Icon, label, sub, to }, i) => (
            <Link key={label} to={to}
              className="flex items-center gap-4 p-3 rounded-2xl transition-all hover:bg-blue-50/10 group"
              style={{ borderBottom: i < menuItems.length - 1 ? `1px solid ${border}` : "none" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: darkMode ? "rgba(59,130,246,0.1)" : "#eff6ff" }}>
                <Icon className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: text }}>{label}</p>
                <p className="text-xs" style={{ color: muted }}>{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: muted }} />
            </Link>
          ))}
        </div>

        {/* Recently Viewed */}
        {recentPhones.length > 0 && (
          <div className="p-5 rounded-3xl border mb-6" style={{ background: cardBg, borderColor: border }}>
            <h3 className="font-semibold mb-4" style={{ color: text }}>Recently Viewed</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recentPhones.map((phone) => (
                <Link key={phone.id} to={`/phone/${phone.id}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderColor: border, background: darkMode ? "rgba(255,255,255,0.02)" : "#f8fafc" }}>
                  <img src={phone.image} alt={phone.name} className="w-12 h-12 object-cover rounded-xl" />
                  <p className="text-[10px] text-center font-medium truncate w-full" style={{ color: text }}>{phone.name}</p>
                  <p className="text-[10px] text-green-500">PKR {phone.lowestPrice.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sign Out */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            logout();
            navigate("/");
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5 text-sm font-medium"
          style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444", background: darkMode ? "rgba(239,68,68,0.05)" : "#fef2f2" }}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
