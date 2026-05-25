import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Phone } from "../data/mockData";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "price_drop" | "new_phone" | "review" | "system";
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Price Drop!", message: "Samsung Galaxy A55 dropped by PKR 5,000", time: "2 min ago", read: false, type: "price_drop" },
  { id: "n2", title: "New Phone Added", message: "iPhone 16 Pro Max now available in Pakistan", time: "1 hr ago", read: false, type: "new_phone" },
  { id: "n3", title: "Wishlist Alert", message: "Xiaomi 15 Pro is back in stock at Daraz", time: "3 hr ago", read: false, type: "system" },
  { id: "n4", title: "Price Drop!", message: "Redmi Note 14 Pro+ price reduced to PKR 59,999", time: "5 hr ago", read: true, type: "price_drop" },
  { id: "n5", title: "Review Posted", message: "Your review on Vivo V40 Pro was approved", time: "1 day ago", read: true, type: "review" },
  { id: "n6", title: "New Phone Added", message: "Realme GT 6 now listed on MobileHub PK", time: "2 days ago", read: true, type: "new_phone" },
];

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  compareList: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareList([]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const addRecentlyViewed = (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => i !== id);
      return [id, ...filtered].slice(0, 6);
    });
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismissNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        wishlist,
        toggleWishlist,
        compareList,
        toggleCompare,
        clearCompare,
        isLoggedIn,
        login,
        logout,
        recentlyViewed,
        addRecentlyViewed,
        notifications,
        unreadCount,
        markAllRead,
        markRead,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
