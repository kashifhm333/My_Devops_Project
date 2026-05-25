import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  Star, Heart, GitCompare, Share2, ShoppingCart, ChevronRight,
  Check, X, ExternalLink, TrendingDown, Package, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { phones } from "../data/mockData";
import { PhoneCard } from "../components/PhoneCard";
import { useApp } from "../context/AppContext";

export function PhoneDetailPage() {
  const { id } = useParams();
  const { darkMode, wishlist, toggleWishlist, compareList, toggleCompare, addRecentlyViewed } = useApp();
  const [activeTab, setActiveTab] = useState("display");
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [chartRange, setChartRange] = useState("30");

  const phone = phones.find((p) => p.id === id);

  useEffect(() => {
    if (phone) addRecentlyViewed(phone.id);
  }, [phone?.id]);

  if (!phone) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">📱</p>
        <p className="text-lg font-semibold">Phone not found</p>
        <Link to="/search" className="mt-4 inline-block text-blue-500">Browse all phones</Link>
      </div>
    </div>
  );

  const isWished = wishlist.includes(phone.id);
  const isCompared = compareList.includes(phone.id);
  const relatedPhones = phones.filter((p) => p.id !== phone.id && p.brand === phone.brand).slice(0, 4);

  const bg = darkMode ? "#070b14" : "#f8faff";
  const cardBg = darkMode ? "rgba(15,23,42,0.8)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const priceData = phone.priceHistory.slice(-parseInt(chartRange));

  const specTabs = [
    { id: "display", label: "Display" },
    { id: "processor", label: "Processor" },
    { id: "camera", label: "Camera" },
    { id: "battery", label: "Battery" },
    { id: "memory", label: "Memory" },
    { id: "connectivity", label: "Connectivity" },
    { id: "body", label: "Body" },
  ];

  const specData: Record<string, { label: string; value: string }[]> = {
    display: [
      { label: "Screen Size", value: phone.specs.displaySize },
      { label: "Display Type", value: phone.specs.display },
      { label: "Refresh Rate", value: phone.specs.refreshRate },
    ],
    processor: [
      { label: "Chipset", value: phone.specs.processor },
    ],
    camera: [
      { label: "Main Camera", value: phone.specs.mainCamera },
      { label: "Front Camera", value: phone.specs.frontCamera },
    ],
    battery: [
      { label: "Capacity", value: phone.specs.battery },
      { label: "Charging", value: phone.specs.charging },
    ],
    memory: [
      { label: "RAM", value: phone.specs.ram },
      { label: "Storage", value: phone.specs.storage },
    ],
    connectivity: [
      { label: "5G", value: phone.specs.has5G ? "Yes" : "No" },
      { label: "PTA Approved", value: phone.specs.ptaApproved ? "Yes" : "No" },
    ],
    body: [
      { label: "Weight", value: phone.specs.weight },
      { label: "Dimensions", value: phone.specs.dimensions },
    ],
  };

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: muted }}>
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/brand/${phone.brand.toLowerCase()}`} className="hover:text-blue-500">{phone.brand}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: text }}>{phone.name}</span>
        </div>

        {/* Main Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Left: Images */}
          <div>
            <div className="rounded-2xl overflow-hidden mb-3 aspect-[4/3]"
              style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc" }}>
              <img
                src={phone.images[selectedImage] || phone.image}
                alt={phone.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {phone.images.map((img, i) => (
                <button key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImage(i);
                  }}
                  className="w-16 h-16 rounded-xl overflow-hidden border-2 transition-all hover:opacity-80"
                  style={{ borderColor: selectedImage === i ? "#3b82f6" : "transparent" }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Color Selection */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2" style={{ color: text }}>Colors</p>
              <div className="flex gap-2">
                {phone.colors.map((color, i) => (
                  <button key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(i);
                    }}
                    className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      background: color,
                      borderColor: selectedColor === i ? "#3b82f6" : "transparent",
                      boxShadow: selectedColor === i ? `0 0 0 2px #fff, 0 0 0 4px #3b82f6` : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div>
            {phone.isNew && (
              <span className="px-3 py-1 rounded-full text-xs bg-blue-500 text-white mb-3 inline-block">New Launch</span>
            )}
            <h1 style={{ color: text, fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3, marginBottom: "0.5rem" }}>
              {phone.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4"
                    style={{ color: "#fbbf24", fill: i <= Math.round(phone.rating) ? "#fbbf24" : "none" }} />
                ))}
              </div>
              <span className="font-semibold" style={{ color: text }}>{phone.rating}</span>
              <span className="text-sm" style={{ color: muted }}>({phone.reviewCount.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="p-4 rounded-2xl border mb-5" style={{ background: darkMode ? "rgba(34,197,94,0.05)" : "#f0fdf4", borderColor: "rgba(34,197,94,0.2)" }}>
              <p className="text-xs mb-1" style={{ color: muted }}>Lowest Price in Pakistan</p>
              <p style={{ color: "#22c55e", fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>
                PKR {phone.lowestPrice.toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: muted }}>
                Available at {phone.stores.filter((s) => s.inStock).length} stores • up to PKR {phone.highestPrice.toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(phone.id);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm hover:shadow-md"
                style={{
                  background: isWished ? "#fef2f2" : "transparent",
                  borderColor: isWished ? "#fca5a5" : border,
                  color: isWished ? "#ef4444" : text,
                }}>
                <Heart className="w-4 h-4" fill={isWished ? "#ef4444" : "none"} />
                Wishlist
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleCompare(phone.id);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm hover:shadow-md"
                style={{
                  background: isCompared ? "#eff6ff" : "transparent",
                  borderColor: isCompared ? "#93c5fd" : border,
                  color: isCompared ? "#3b82f6" : text,
                }}>
                <GitCompare className="w-4 h-4" />
                Compare
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Share functionality will be implemented here");
                }}
                className="p-2.5 rounded-xl border transition-all hover:bg-blue-50/10" style={{ borderColor: border, color: muted }}>
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Display", value: phone.specs.displaySize },
                { label: "Processor", value: phone.specs.processor.split(" ").slice(0, 2).join(" ") },
                { label: "RAM", value: phone.specs.ram },
                { label: "Camera", value: phone.specs.mainCamera.split("+")[0].trim() },
                { label: "Battery", value: phone.specs.battery },
                { label: "5G", value: phone.specs.has5G ? "✓ Supported" : "✗ Not available" },
              ].map((spec) => (
                <div key={spec.label} className="p-3 rounded-xl border" style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc", borderColor: border }}>
                  <p className="text-xs mb-0.5" style={{ color: muted }}>{spec.label}</p>
                  <p className="text-sm font-medium" style={{ color: text }}>{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Comparison Table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: text }}>Buy from Stores</h2>
          <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc" }}>
                    {["Store", "Price", "Delivery", "Rating", "Stock", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...phone.stores].sort((a, b) => a.price - b.price).map((store, i) => (
                    <tr key={store.store}
                      className="border-t transition-colors hover:bg-blue-50/5"
                      style={{ borderColor: border, background: i === 0 ? darkMode ? "rgba(34,197,94,0.05)" : "#f0fdf4" : "transparent" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: "#3b82f6" }}>{store.logo}</div>
                          <div>
                            <p className="font-medium text-sm" style={{ color: text }}>{store.store}</p>
                            {i === 0 && <span className="text-xs text-green-500">Best Price</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: i === 0 ? "#22c55e" : text }}>
                        PKR {store.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: muted }}>{store.delivery}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm" style={{ color: text }}>{store.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${store.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {store.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {store.inStock && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Redirecting to ${store.store} to purchase...`);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white transition-all hover:shadow-md hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                            <ShoppingCart className="w-3 h-3" /> Buy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Price History Chart */}
        <section className="mb-10">
          <div className="p-6 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: text }}>Price History</h2>
              <div className="flex gap-2">
                {[
                  { label: "7D", value: "7" },
                  { label: "30D", value: "30" },
                  { label: "3M", value: "90" },
                ].map((range) => (
                  <button key={range.value}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setChartRange(range.value);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border hover:shadow-md"
                    style={{
                      background: chartRange === range.value ? "#3b82f6" : "transparent",
                      borderColor: chartRange === range.value ? "#3b82f6" : border,
                      color: chartRange === range.value ? "#fff" : text,
                    }}>
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: muted }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    formatter={(v: number) => [`PKR ${v.toLocaleString()}`, "Price"]}
                    contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, color: text }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fill="url(#priceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Specs Tabs */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: text }}>Specifications</h2>
          <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
            <div className="flex overflow-x-auto border-b" style={{ borderColor: border }}>
              {specTabs.map((tab) => (
                <button key={tab.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }}
                  className="px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 hover:bg-blue-50/5"
                  style={{
                    borderBottomColor: activeTab === tab.id ? "#3b82f6" : "transparent",
                    color: activeTab === tab.id ? "#3b82f6" : muted,
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-4">
              {(specData[activeTab] || []).map((spec) => (
                <div key={spec.label} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: border }}>
                  <span className="text-sm" style={{ color: muted }}>{spec.label}</span>
                  <span className="text-sm font-medium" style={{ color: text }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: text }}>Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border" style={{ background: darkMode ? "rgba(34,197,94,0.05)" : "#f0fdf4", borderColor: "rgba(34,197,94,0.15)" }}>
              <h3 className="font-semibold mb-4 text-green-600">✓ Pros</h3>
              <ul className="space-y-2">
                {phone.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm" style={{ color: text }}>
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-2xl border" style={{ background: darkMode ? "rgba(239,68,68,0.05)" : "#fef2f2", borderColor: "rgba(239,68,68,0.15)" }}>
              <h3 className="font-semibold mb-4 text-red-500">✗ Cons</h3>
              <ul className="space-y-2">
                {phone.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-sm" style={{ color: text }}>
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Expert Scores */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: text }}>Expert Review Scores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(phone.scores).map(([key, val]) => (
              <div key={key} className="p-4 rounded-2xl border text-center" style={{ background: cardBg, borderColor: border }}>
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke={darkMode ? "rgba(255,255,255,0.06)" : "#f1f5f9"} strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="3"
                      strokeDasharray={`${(val / 100) * 94.2} 94.2`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: text }}>{val}</span>
                </div>
                <p className="text-xs capitalize" style={{ color: muted }}>{key}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Phones */}
        {relatedPhones.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: text }}>Related {phone.brand} Phones</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedPhones.map((p) => (
                <PhoneCard key={p.id} phone={p} compact />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
