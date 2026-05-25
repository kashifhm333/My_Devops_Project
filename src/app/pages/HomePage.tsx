import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Mic, ArrowRight, TrendingUp, Zap, Star, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { phones, brands, categories } from "../data/mockData";
import { PhoneCard } from "../components/PhoneCard";
import { useApp } from "../context/AppContext";

export function HomePage() {
  const { darkMode } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const trendingPhones = phones.slice(0, 4);
  const latestPhones = phones.filter((p) => p.isNew).slice(0, 3);
  const priceDropPhones = phones.filter((p) => p.isPriceDrop);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const bg = darkMode ? "#070b14" : "#f8faff";
  const cardBg = darkMode ? "rgba(15,23,42,0.8)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6"
              style={{ background: darkMode ? "rgba(59,130,246,0.15)" : "#eff6ff", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)" }}>
              <Zap className="w-3.5 h-3.5" />
              Live prices from 50+ Pakistani stores
            </span>
            <h1 className="mb-4 px-4" style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: text,
            }}>
              Find the Best Mobile Prices
              <span className="block" style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Across Pakistan
              </span>
            </h1>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: muted }}>
              Compare live prices from trusted stores and buy at the best deal.
            </p>
          </motion.div>

          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <div className="relative flex items-center rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: darkMode ? "rgba(30,41,59,0.9)" : "#fff", border: `1px solid ${border}` }}>
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Samsung, iPhone, Vivo, Redmi..."
                className="flex-1 pl-12 pr-4 py-4 bg-transparent outline-none text-base"
                style={{ color: text }}
              />
              <Mic className="mr-3 w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
              <button type="submit"
                className="m-1.5 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                Search
              </button>
            </div>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/search" className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
              Explore Phones
            </Link>
            <Link to="/compare" className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 border"
              style={{ color: text, borderColor: border, background: darkMode ? "rgba(255,255,255,0.05)" : "#fff" }}>
              Compare Phones
            </Link>
            <Link to="/search?filter=deal" className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{ background: darkMode ? "rgba(34,197,94,0.15)" : "#f0fdf4", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
              Browse Deals
            </Link>
          </motion.div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { value: "2,500+", label: "Phones Listed" },
              { value: "50+", label: "Trusted Stores" },
              { value: "Live", label: "Price Updates" },
              { value: "Free", label: "Price Alerts" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-bold text-xl" style={{ color: "#3b82f6" }}>{stat.value}</p>
                <p className="text-xs" style={{ color: muted }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: text }}>Popular Brands</h2>
            <Link to="/search" className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/brand/${brand.id}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg shrink-0 w-28"
                  style={{ background: cardBg, borderColor: border }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: brand.color }}>
                    {brand.name[0]}
                  </div>
                  <p className="text-xs font-medium text-center" style={{ color: text }}>{brand.name}</p>
                  <p className="text-[10px]" style={{ color: muted }}>{brand.count} phones</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Phones */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold" style={{ color: text }}>Trending Phones</h2>
            </div>
            <Link to="/search" className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingPhones.map((phone, i) => (
              <motion.div
                key={phone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <PhoneCard phone={phone} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Launches */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold" style={{ color: text }}>Latest Launches</h2>
          </div>
          <div className="space-y-4">
            {latestPhones.map((phone, i) => (
              <motion.div
                key={phone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/phone/${phone.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5"
                    style={{ background: cardBg, borderColor: border }}>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-1 h-12 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                      <div className="text-center">
                        <p className="text-lg font-bold" style={{ color: "#3b82f6" }}>
                          {new Date(phone.launchDate).toLocaleDateString("en-PK", { month: "short" })}
                        </p>
                        <p className="text-xs" style={{ color: muted }}>
                          {new Date(phone.launchDate).getFullYear()}
                        </p>
                      </div>
                    </div>
                    <img src={phone.image} alt={phone.name} className="w-14 h-14 object-cover rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500 text-white">New</span>
                        <span className="text-xs" style={{ color: muted }}>{phone.brand}</span>
                      </div>
                      <p className="font-semibold truncate" style={{ color: text }}>{phone.name}</p>
                      <p className="text-sm" style={{ color: "#22c55e" }}>From PKR {phone.lowestPrice.toLocaleString()}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 shrink-0" style={{ color: muted }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Drops */}
      {priceDropPhones.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xl font-bold" style={{ color: text }}>Price Drops Today</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {priceDropPhones.map((phone, i) => (
                <motion.div
                  key={phone.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <PhoneCard phone={phone} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-6" style={{ color: text }}>Best Phones by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/search?category=${cat.id}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg text-center group"
                  style={{ background: cardBg, borderColor: border }}
                >
                  <div className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <p className="text-sm font-semibold" style={{ color: text }}>{cat.name}</p>
                  <p className="text-[10px]" style={{ color: muted }}>{cat.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Finder Banner */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white"
            style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6, #8b5cf6)" }}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 right-8 text-8xl">🤖</div>
            </div>
            <div className="relative max-w-lg">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 mb-4 inline-block">AI-Powered</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Find Your Perfect Phone with AI</h2>
              <p className="opacity-80 mb-6">Tell us your needs and our AI will recommend the best phones within your budget from Pakistan's top stores.</p>
              <Link to="/ai" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5">
                Try AI Finder <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-8 py-12" style={{ borderColor: border }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              { title: "Company", links: ["About Us", "Contact", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "Report Error", "Advertise", "API"] },
              { title: "Legal", links: ["Terms of Use", "Privacy Policy", "Cookie Policy", "Disclaimer"] },
              { title: "Follow Us", links: ["Twitter/X", "Facebook", "Instagram", "YouTube"] },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-3 text-sm" style={{ color: text }}>{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-blue-500 transition-colors" style={{ color: muted }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: border }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <span className="font-bold" style={{ color: text }}>MobileHub Pakistan</span>
            </div>
            <p className="text-sm" style={{ color: muted }}>© 2026 MobileHub PK. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
