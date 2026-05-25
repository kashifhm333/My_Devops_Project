import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search, Sun, Moon, Heart, GitCompare, Bell, User,
  Menu, X, Mic, Smartphone, Tag, TrendingDown, CheckCheck, Trash2
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { phones } from "../data/mockData";

export function Navbar() {
  const {
    darkMode, toggleDarkMode, wishlist, compareList, isLoggedIn,
    notifications, unreadCount, markAllRead, markRead, dismissNotification,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredSuggestions = searchQuery.length > 1
    ? phones.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const trendingPhones = phones.slice(0, 4);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  function notifIcon(type: string) {
    if (type === "price_drop") return <TrendingDown className="w-4 h-4 text-red-500" />;
    if (type === "new_phone") return <Smartphone className="w-4 h-4 text-blue-500" />;
    if (type === "review") return <Tag className="w-4 h-4 text-purple-500" />;
    return <Bell className="w-4 h-4 text-yellow-500" />;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl"
      style={{ background: darkMode ? "rgba(10,10,30,0.95)" : "rgba(255,255,255,0.95)" }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:block font-bold text-lg"
            style={{ color: darkMode ? "#fff" : "#0f172a" }}>
            MobileHub <span className="text-blue-500">PK</span>
          </span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Samsung, iPhone, Vivo, Redmi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.07)" : "#f1f5f9",
                  borderColor: darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                  color: darkMode ? "#fff" : "#0f172a",
                }}
              />
              <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
            </div>
          </form>

          {/* Search Dropdown */}
          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border overflow-hidden z-50"
              style={{
                background: darkMode ? "#0f172a" : "#fff",
                borderColor: darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0",
              }}>
              {filteredSuggestions.length > 0 ? (
                <div className="p-2">
                  <p className="text-xs px-3 py-1.5" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>Results</p>
                  {filteredSuggestions.map((phone) => (
                    <Link
                      key={phone.id}
                      to={`/phone/${phone.id}`}
                      onClick={() => setShowSearch(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    >
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium" style={{ color: darkMode ? "#fff" : "#0f172a" }}>{phone.name}</p>
                        <p className="text-xs" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>PKR {phone.lowestPrice.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-3">
                  <p className="text-xs mb-2 px-1" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>Trending</p>
                  {trendingPhones.map((phone) => (
                    <Link
                      key={phone.id}
                      to={`/phone/${phone.id}`}
                      onClick={() => setShowSearch(false)}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Smartphone className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm" style={{ color: darkMode ? "#e2e8f0" : "#0f172a" }}>{phone.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1 ml-auto">
          <Link to="/compare" className="relative p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors hidden sm:flex">
            <GitCompare className="w-5 h-5" style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
            {compareList.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </Link>
          <Link to="/wishlist" className="relative p-2 rounded-xl hover:bg-red-50 transition-colors hidden sm:flex">
            <Heart className="w-5 h-5" style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Bell Icon with Notification Dropdown */}
          <div ref={notifRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              style={{ background: showNotifications ? (darkMode ? "rgba(255,255,255,0.1)" : "#f1f5f9") : "transparent" }}
            >
              <Bell className="w-5 h-5" style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border overflow-hidden z-50"
                style={{ background: darkMode ? "#0f172a" : "#fff", borderColor: darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: darkMode ? "rgba(255,255,255,0.07)" : "#f1f5f9" }}>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-sm" style={{ color: darkMode ? "#fff" : "#0f172a" }}>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">{unreadCount}</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                {/* Notification list */}
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
                      <p className="text-sm" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50/30 transition-colors cursor-pointer border-b"
                        style={{
                          borderColor: darkMode ? "rgba(255,255,255,0.04)" : "#f8fafc",
                          background: notif.read ? "transparent" : (darkMode ? "rgba(59,130,246,0.07)" : "#eff6ff"),
                        }}
                        onClick={() => markRead(notif.id)}
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "#f1f5f9" }}>
                          {notifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}>{notif.title}</p>
                          <p className="text-[11px] leading-snug mt-0.5" style={{ color: darkMode ? "#64748b" : "#64748b" }}>{notif.message}</p>
                          <p className="text-[10px] mt-1" style={{ color: darkMode ? "#475569" : "#94a3b8" }}>{notif.time}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                          className="p-1 rounded hover:bg-red-50 transition-colors shrink-0"
                        >
                          <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t text-center" style={{ borderColor: darkMode ? "rgba(255,255,255,0.07)" : "#f1f5f9" }}>
                  <button
                    type="button"
                    className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all activity
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link
            to={isLoggedIn ? "/profile" : "/login"}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors hidden sm:flex"
          >
            <User className="w-5 h-5" style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-yellow-50 transition-colors"
          >
            {darkMode
              ? <Sun className="w-5 h-5 text-yellow-400" />
              : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
          <button
            className="p-2 rounded-xl md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen
              ? <X className="w-5 h-5" style={{ color: darkMode ? "#fff" : "#0f172a" }} />
              : <Menu className="w-5 h-5" style={{ color: darkMode ? "#fff" : "#0f172a" }} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search phones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{
                background: darkMode ? "rgba(255,255,255,0.07)" : "#f1f5f9",
                borderColor: darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                color: darkMode ? "#fff" : "#0f172a",
              }}
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 py-3 space-y-1"
          style={{
            background: darkMode ? "#0f172a" : "#fff",
            borderColor: darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0",
          }}>
          {[
            { to: "/", label: "Home" },
            { to: "/search", label: "Browse Phones" },
            { to: "/compare", label: `Compare (${compareList.length})` },
            { to: "/wishlist", label: `Wishlist (${wishlist.length})` },
            { to: "/ai", label: "AI Finder" },
            { to: isLoggedIn ? "/profile" : "/login", label: isLoggedIn ? "Profile" : "Login" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-blue-50 text-sm transition-colors"
              style={{ color: darkMode ? "#e2e8f0" : "#0f172a" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
