import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { phones, brands } from "../data/mockData";
import { PhoneCard } from "../components/PhoneCard";
import { useApp } from "../context/AppContext";

export function BrandPage() {
  const { id } = useParams();
  const { darkMode } = useApp();
  const [sortBy, setSortBy] = useState("popular");

  const brand = brands.find((b) => b.id === id);
  const brandName = brand?.name || (id ? id.charAt(0).toUpperCase() + id.slice(1) : "");
  const brandPhones = phones.filter((p) => p.brand.toLowerCase() === brandName.toLowerCase());

  const sorted = [...brandPhones].sort((a, b) => {
    if (sortBy === "price-asc") return a.lowestPrice - b.lowestPrice;
    if (sortBy === "price-desc") return b.lowestPrice - a.lowestPrice;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime();
    return b.reviewCount - a.reviewCount;
  });

  const bg = darkMode ? "#070b14" : "#f8faff";
  const cardBg = darkMode ? "rgba(15,23,42,0.8)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const avgPrice = brandPhones.length
    ? Math.round(brandPhones.reduce((sum, p) => sum + p.lowestPrice, 0) / brandPhones.length)
    : 0;

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: brand?.color || "#3b82f6", minHeight: 200 }}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.4), transparent)" }} />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link to="/search" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl font-bold text-white">
              {brandName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{brandName}</h1>
              <p className="text-white/70">{brandPhones.length} phones available in Pakistan</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: "Total Phones", value: brandPhones.length },
              { label: "Avg. Price", value: `PKR ${avgPrice.toLocaleString()}` },
              { label: "Highest Rated", value: brandPhones.length ? Math.max(...brandPhones.map((p) => p.rating)) : "—" },
              { label: "5G Models", value: brandPhones.filter((p) => p.specs.has5G).length },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: muted }}>{sorted.length} phones found</p>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border text-sm outline-none cursor-pointer"
              style={{ background: cardBg, borderColor: border, color: text }}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Cheapest</option>
              <option value="price-desc">Most Expensive</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: muted }} />
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📱</p>
            <p className="font-semibold mb-2" style={{ color: text }}>No {brandName} phones listed yet</p>
            <Link to="/search" className="text-blue-500 hover:text-blue-600">Browse all phones</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map((phone) => (
              <PhoneCard key={phone.id} phone={phone} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
