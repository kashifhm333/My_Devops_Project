import { Link } from "react-router";
import { Heart, GitCompare, Trash2 } from "lucide-react";
import { phones } from "../data/mockData";
import { PhoneCard } from "../components/PhoneCard";
import { useApp } from "../context/AppContext";

export function WishlistPage() {
  const { darkMode, wishlist, toggleWishlist, compareList, toggleCompare } = useApp();

  const wishlistPhones = phones.filter((p) => wishlist.includes(p.id));

  const bg = darkMode ? "#070b14" : "#f8faff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-6 h-6 text-red-500" fill="#ef4444" />
          <h1 className="text-2xl font-bold" style={{ color: text }}>My Wishlist</h1>
          <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-600">
            {wishlistPhones.length}
          </span>
        </div>

        {wishlistPhones.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-20 h-20 mx-auto mb-4" style={{ color: muted }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: text }}>Your wishlist is empty</h2>
            <p className="mb-6" style={{ color: muted }}>Save phones you're interested in to compare prices later</p>
            <Link to="/search"
              className="px-6 py-3 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
              Browse Phones
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => wishlistPhones.forEach((p) => !compareList.includes(p.id) && compareList.length < 4 && toggleCompare(p.id))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all hover:shadow-md"
                style={{ background: "#eff6ff", borderColor: "rgba(59,130,246,0.3)", color: "#3b82f6" }}>
                <GitCompare className="w-4 h-4" />
                Compare Selected
              </button>
              <button
                onClick={() => wishlistPhones.forEach((p) => toggleWishlist(p.id))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all hover:shadow-md"
                style={{ background: "#fef2f2", borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}>
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistPhones.map((phone) => (
                <PhoneCard key={phone.id} phone={phone} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
