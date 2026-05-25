import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Search, SlidersHorizontal, Grid, List, X, ChevronDown } from "lucide-react";
import { phones } from "../data/mockData";
import { PhoneCard } from "../components/PhoneCard";
import { useApp } from "../context/AppContext";

export function SearchPage() {
  const { darkMode, compareList } = useApp();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [gridView, setGridView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [filters, setFilters] = useState({
    brands: [] as string[],
    minPrice: 0,
    maxPrice: 500000,
    ram: [] as string[],
    storage: [] as string[],
    has5G: false,
    ptaApproved: false,
    category: initialCategory,
  });

  const bg = darkMode ? "#070b14" : "#f8faff";
  const cardBg = darkMode ? "rgba(15,23,42,0.8)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const inputBg = darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9";

  const filtered = useMemo(() => {
    let result = phones.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.brand.toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (p.lowestPrice < filters.minPrice || p.lowestPrice > filters.maxPrice) return false;
      if (filters.ram.length > 0 && !filters.ram.some((r) => p.specs.ram.includes(r))) return false;
      if (filters.has5G && !p.specs.has5G) return false;
      if (filters.ptaApproved && !p.specs.ptaApproved) return false;
      if (filters.category && !p.category.includes(filters.category)) return false;
      return true;
    });

    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.lowestPrice - b.lowestPrice);
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.lowestPrice - a.lowestPrice);
    else if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") result = [...result].sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());

    return result;
  }, [query, filters, sortBy]);

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand) ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand],
    }));
  };

  const toggleRam = (ram: string) => {
    setFilters((prev) => ({
      ...prev,
      ram: prev.ram.includes(ram) ? prev.ram.filter((r) => r !== ram) : [...prev.ram, ram],
    }));
  };

  const uniqueBrands = [...new Set(phones.map((p) => p.brand))];

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search phones..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none text-sm"
              style={{ background: inputBg, borderColor: border, color: text }}
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowFilters(!showFilters);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-md"
            style={{ background: showFilters ? "#3b82f6" : cardBg, borderColor: border, color: showFilters ? "#fff" : text }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pr-8 pl-3 py-2.5 rounded-xl border text-sm outline-none cursor-pointer"
              style={{ background: cardBg, borderColor: border, color: text }}
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
              <option value="newest">Newest First</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: muted }} />
          </div>
          <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: border }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setGridView(true);
              }}
              className="p-2.5 transition-colors hover:opacity-80"
              style={{ background: gridView ? "#3b82f6" : cardBg, color: gridView ? "#fff" : muted }}>
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setGridView(false);
              }}
              className="p-2.5 transition-colors hover:opacity-80"
              style={{ background: !gridView ? "#3b82f6" : cardBg, color: !gridView ? "#fff" : muted }}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 shrink-0 space-y-6">
              <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: text }}>Filters</h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFilters({ brands: [], minPrice: 0, maxPrice: 500000, ram: [], storage: [], has5G: false, ptaApproved: false, category: "" });
                    }}
                    className="text-xs text-blue-500 hover:text-blue-600 transition-colors">Clear all</button>
                </div>

                {/* Price Range */}
                <div className="mb-5">
                  <h4 className="text-sm font-medium mb-3" style={{ color: text }}>Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range" min={0} max={500000} step={5000}
                      value={filters.maxPrice}
                      onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: +e.target.value }))}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs" style={{ color: muted }}>
                      <span>PKR 0</span>
                      <span>PKR {filters.maxPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-5">
                  <h4 className="text-sm font-medium mb-3" style={{ color: text }}>Brand</h4>
                  <div className="space-y-2">
                    {uniqueBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="accent-blue-500"
                        />
                        <span className="text-sm" style={{ color: text }}>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* RAM */}
                <div className="mb-5">
                  <h4 className="text-sm font-medium mb-3" style={{ color: text }}>RAM</h4>
                  <div className="flex flex-wrap gap-2">
                    {["4GB", "6GB", "8GB", "12GB", "16GB"].map((r) => (
                      <button key={r}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleRam(r);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs border transition-all hover:shadow-md"
                        style={{
                          background: filters.ram.includes(r) ? "#3b82f6" : "transparent",
                          borderColor: filters.ram.includes(r) ? "#3b82f6" : border,
                          color: filters.ram.includes(r) ? "#fff" : text,
                        }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  {[
                    { key: "has5G", label: "5G Only" },
                    { key: "ptaApproved", label: "PTA Approved" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm" style={{ color: text }}>{label}</span>
                      <div
                        onClick={() => setFilters((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                        className="w-9 h-5 rounded-full transition-colors cursor-pointer relative"
                        style={{ background: (filters as any)[key] ? "#3b82f6" : border }}
                      >
                        <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                          style={{ transform: (filters as any)[key] ? "translateX(1.1rem)" : "translateX(0.125rem)" }} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <p className="text-sm mb-4" style={{ color: muted }}>
              {filtered.length} phones found
              {query && <> for "<span className="text-blue-500">{query}</span>"</>}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">📱</p>
                <p className="font-semibold mb-2" style={{ color: text }}>No phones found</p>
                <p className="text-sm" style={{ color: muted }}>Try adjusting your filters</p>
              </div>
            ) : gridView ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((phone) => (
                  <PhoneCard key={phone.id} phone={phone} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((phone) => (
                  <div key={phone.id} className="flex gap-4 p-4 rounded-2xl border transition-all hover:shadow-md"
                    style={{ background: cardBg, borderColor: border }}>
                    <img src={phone.image} alt={phone.name} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-500 mb-1">{phone.brand}</p>
                      <p className="font-semibold" style={{ color: text }}>{phone.name}</p>
                      <p className="text-xs mb-2" style={{ color: muted }}>{phone.specs.processor} · {phone.specs.ram} · {phone.specs.storage}</p>
                      <p className="font-bold text-green-500">PKR {phone.lowestPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare Panel */}
      {compareList.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-4 px-5 py-3 rounded-2xl shadow-2xl text-white"
            style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", backdropFilter: "blur(20px)" }}>
            <span className="text-sm font-medium">{compareList.length} phones selected</span>
            <a href="/compare" className="px-4 py-1.5 bg-white text-blue-600 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
              Compare Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
