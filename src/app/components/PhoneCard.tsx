import { Link } from "react-router";
import { Heart, GitCompare, Star, TrendingDown, Zap } from "lucide-react";
import { Phone } from "../data/mockData";
import { useApp } from "../context/AppContext";

interface PhoneCardProps {
  phone: Phone;
  compact?: boolean;
}

export function PhoneCard({ phone, compact = false }: PhoneCardProps) {
  const { darkMode, wishlist, toggleWishlist, compareList, toggleCompare } = useApp();
  const isWished = wishlist.includes(phone.id);
  const isCompared = compareList.includes(phone.id);

  const cardBg = darkMode
    ? "rgba(30,41,59,0.8)"
    : "rgba(255,255,255,0.9)";
  const borderColor = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div
      className="group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{ background: cardBg, borderColor, backdropFilter: "blur(12px)" }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
        {phone.isNew && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">New</span>
        )}
        {phone.isPriceDrop && phone.discountPercent && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />-{phone.discountPercent}%
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); toggleWishlist(phone.id); }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: isWished ? "#fef2f2" : darkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)" }}
      >
        <Heart
          className="w-4 h-4 transition-colors"
          style={{ color: isWished ? "#ef4444" : "#94a3b8" }}
          fill={isWished ? "#ef4444" : "none"}
        />
      </button>

      <Link to={`/phone/${phone.id}`}>
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ height: compact ? 140 : 180, background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc" }}
        >
          <img
            src={phone.image}
            alt={phone.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs mb-1" style={{ color: "#3b82f6" }}>{phone.brand}</p>
          <h3
            className="text-sm font-semibold leading-snug mb-2 line-clamp-2"
            style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}
          >
            {phone.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium" style={{ color: darkMode ? "#e2e8f0" : "#334155" }}>
              {phone.rating}
            </span>
            <span className="text-xs" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>
              ({phone.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="space-y-0.5">
            {phone.isPriceDrop && phone.oldPrice && (
              <p className="text-xs line-through" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>
                PKR {phone.oldPrice.toLocaleString()}
              </p>
            )}
            <p className="font-bold" style={{ color: "#22c55e", fontSize: "15px" }}>
              PKR {phone.lowestPrice.toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>
              up to PKR {phone.highestPrice.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggleCompare(phone.id); }}
          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all border hover:shadow-md"
          style={{
            background: isCompared ? "#3b82f6" : "transparent",
            borderColor: isCompared ? "#3b82f6" : darkMode ? "rgba(255,255,255,0.15)" : "#e2e8f0",
            color: isCompared ? "#fff" : darkMode ? "#94a3b8" : "#64748b",
          }}
        >
          <span className="flex items-center justify-center gap-1">
            <GitCompare className="w-3 h-3" />
            {isCompared ? "Added" : "Compare"}
          </span>
        </button>
        <Link
          to={`/phone/${phone.id}`}
          className="flex-1 py-2 rounded-xl text-xs font-medium text-center transition-all text-white"
          style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
