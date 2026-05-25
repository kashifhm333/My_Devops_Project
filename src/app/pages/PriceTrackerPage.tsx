import { useState } from "react";
import { Link } from "react-router";
import { Bell, TrendingDown, TrendingUp, Minus, Search } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { phones } from "../data/mockData";
import { useApp } from "../context/AppContext";

export function PriceTrackerPage() {
  const { darkMode } = useApp();
  const [selectedPhone, setSelectedPhone] = useState(phones[0]);
  const [searchInput, setSearchInput] = useState("");
  const [range, setRange] = useState("30");
  const [showAlert, setShowAlert] = useState(false);
  const [alertPrice, setAlertPrice] = useState(selectedPhone.lowestPrice - 10000);

  const bg = darkMode ? "#070b14" : "#f8faff";
  const cardBg = darkMode ? "rgba(15,23,42,0.8)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const filtered = phones.filter((p) =>
    p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchInput.toLowerCase())
  );

  const priceData = selectedPhone.priceHistory.slice(-parseInt(range));
  const prices = priceData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = selectedPhone.lowestPrice;
  const firstPrice = priceData[0]?.price || currentPrice;
  const change = currentPrice - firstPrice;
  const changePct = ((change / firstPrice) * 100).toFixed(1);

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: text }}>Price Tracker</h1>
        <p className="text-sm mb-8" style={{ color: muted }}>Track price history and set alerts for your favorite phones</p>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Phone List */}
          <div className="lg:col-span-1">
            <div className="p-4 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none"
                  style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc", borderColor: border, color: text }}
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filtered.map((phone) => (
                  <button key={phone.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedPhone(phone);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left hover:shadow-md"
                    style={{
                      background: selectedPhone.id === phone.id ? darkMode ? "rgba(59,130,246,0.15)" : "#eff6ff" : "transparent",
                      border: `1px solid ${selectedPhone.id === phone.id ? "#3b82f6" : "transparent"}`,
                    }}>
                    <img src={phone.image} alt={phone.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: text }}>{phone.name}</p>
                      <p className="text-xs text-green-500">PKR {phone.lowestPrice.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart & Details */}
          <div className="lg:col-span-3 space-y-5">
            {/* Phone Header */}
            <div className="p-5 rounded-2xl border flex flex-wrap gap-4 items-center justify-between"
              style={{ background: cardBg, borderColor: border }}>
              <div className="flex items-center gap-4">
                <img src={selectedPhone.image} alt={selectedPhone.name} className="w-16 h-16 object-cover rounded-xl" />
                <div>
                  <p className="text-xs text-blue-500">{selectedPhone.brand}</p>
                  <Link to={`/phone/${selectedPhone.id}`}>
                    <h2 className="font-bold hover:text-blue-500 transition-colors" style={{ color: text }}>{selectedPhone.name}</h2>
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "Current", value: `PKR ${currentPrice.toLocaleString()}`, color: "#22c55e" },
                  { label: "Lowest", value: `PKR ${minPrice.toLocaleString()}`, color: "#3b82f6" },
                  { label: "Highest", value: `PKR ${maxPrice.toLocaleString()}`, color: "#f59e0b" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xs mb-1" style={{ color: muted }}>{s.label}</p>
                    <p className="font-bold text-sm" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
                <div className="text-center">
                  <p className="text-xs mb-1" style={{ color: muted }}>{range}D Change</p>
                  <div className="flex items-center gap-1">
                    {change < 0
                      ? <TrendingDown className="w-4 h-4 text-green-500" />
                      : change > 0
                        ? <TrendingUp className="w-4 h-4 text-red-500" />
                        : <Minus className="w-4 h-4 text-gray-400" />}
                    <p className="font-bold text-sm" style={{ color: change < 0 ? "#22c55e" : change > 0 ? "#ef4444" : muted }}>
                      {change > 0 ? "+" : ""}{changePct}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: text }}>Price History</h3>
                <div className="flex gap-2">
                  {[
                    { label: "7D", val: "7" },
                    { label: "30D", val: "30" },
                    { label: "All", val: "90" },
                  ].map((r) => (
                    <button key={r.val}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setRange(r.val);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs border transition-all hover:shadow-md"
                      style={{
                        background: range === r.val ? "#3b82f6" : "transparent",
                        borderColor: range === r.val ? "#3b82f6" : border,
                        color: range === r.val ? "#fff" : text,
                      }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData}>
                    <defs>
                      <linearGradient id="priceGrad2" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2.5} fill="url(#priceGrad2)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Set Alert */}
            <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold" style={{ color: text }}>Set Price Alert</h3>
              </div>
              {!showAlert ? (
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-48">
                    <label className="block text-xs mb-2" style={{ color: muted }}>Alert me when price drops to</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: muted }}>PKR</span>
                      <input
                        type="number"
                        value={alertPrice}
                        onChange={(e) => setAlertPrice(+e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-xl border outline-none text-sm"
                        style={{
                          background: darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc",
                          borderColor: border,
                          color: text,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-48">
                    <label className="block text-xs mb-2" style={{ color: muted }}>Your email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-3 py-2.5 rounded-xl border outline-none text-sm"
                      style={{
                        background: darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc",
                        borderColor: border,
                        color: text,
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAlert(true);
                    }}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                    Set Alert
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Alert set successfully!</p>
                    <p className="text-xs text-green-600">We'll notify you when {selectedPhone.name} drops to PKR {alertPrice.toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAlert(false);
                    }}
                    className="ml-auto text-xs text-green-600 hover:text-green-700 transition-colors">Remove</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
