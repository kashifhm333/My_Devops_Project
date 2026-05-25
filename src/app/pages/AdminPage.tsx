import { useState } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard, Smartphone, Tag, Store, Users, Star, BarChart2,
  Settings, Menu, X, TrendingUp, TrendingDown, Eye, Plus, Edit2, Trash2,
  CheckCircle, XCircle, Search, Download, Bell, Shield,
  Globe, Database, Palette, Key, Mail, Save, RefreshCw, AlertCircle,
  ChevronUp, ChevronDown, Clock, Package, DollarSign, MessageSquare,
  UserCheck, UserX
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import { phones, brands } from "../data/mockData";
import { useApp } from "../context/AppContext";

const visitData = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  visits: Math.round(5000 + Math.random() * 8000),
  searches: Math.round(2000 + Math.random() * 4000),
  signups: Math.round(100 + Math.random() * 400),
}));

const monthlyData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: Math.round(80000 + Math.random() * 40000),
  users: Math.round(1000 + i * 200 + Math.random() * 300),
  phones: Math.round(50 + Math.random() * 30),
}));

const topPhones = phones.slice(0, 5).map((p, i) => ({
  name: p.name.split(" ").slice(-2).join(" "),
  views: Math.round(10000 - i * 1200),
  clicks: Math.round(3000 - i * 350),
}));

const pieData = [
  { name: "Samsung", value: 35, color: "#1428A0" },
  { name: "Xiaomi", value: 25, color: "#FF6900" },
  { name: "Oppo", value: 15, color: "#1D6F42" },
  { name: "Vivo", value: 12, color: "#415FFF" },
  { name: "Others", value: 13, color: "#94a3b8" },
];

const mockUsers = Array.from({ length: 20 }, (_, i) => ({
  id: `u${i + 1}`,
  name: ["Ali Hassan", "Fatima Khan", "Ahmed Raza", "Sara Malik", "Bilal Akhtar",
    "Ayesha Tariq", "Usman Shah", "Zainab Ali", "Hamza Qureshi", "Nadia Iqbal",
    "Farhan Siddiqui", "Hira Baig", "Imran Butt", "Sana Javed", "Owais Mirza",
    "Amna Cheema", "Raza Hussain", "Komal Nawaz", "Tariq Mahmood", "Bushra Aslam"][i],
  email: `user${i + 1}@example.com`,
  joined: `${Math.floor(Math.random() * 28) + 1} May 2026`,
  phones: Math.floor(Math.random() * 15),
  reviews: Math.floor(Math.random() * 8),
  status: Math.random() > 0.2 ? "active" : "banned",
  role: i < 2 ? "admin" : "user",
}));

const mockReviews = phones.slice(0, 12).map((p, i) => ({
  id: `r${i + 1}`,
  phone: p.name,
  user: mockUsers[i % mockUsers.length].name,
  rating: Math.floor(Math.random() * 2) + 4,
  comment: [
    "Excellent phone, very happy with the purchase!",
    "Good value for money, camera is outstanding.",
    "Battery life could be better but overall great device.",
    "Highly recommend for gaming enthusiasts.",
    "Smooth performance, no lag at all.",
    "Camera is average but performance is top notch.",
  ][i % 6],
  date: `${Math.floor(Math.random() * 28) + 1} May 2026`,
  status: ["approved", "pending", "rejected"][Math.floor(Math.random() * 3)] as "approved" | "pending" | "rejected",
}));

const mockStores = [
  { id: "s1", name: "Daraz", url: "daraz.pk", phones: 2400, rating: 4.2, status: "active", commission: "5%", city: "Lahore" },
  { id: "s2", name: "iShopping", url: "ishopping.pk", phones: 1800, rating: 4.5, status: "active", commission: "4.5%", city: "Karachi" },
  { id: "s3", name: "Telemart", url: "telemart.pk", phones: 1200, rating: 4.0, status: "active", commission: "5%", city: "Karachi" },
  { id: "s4", name: "PriceOye", url: "priceoye.pk", phones: 3200, rating: 4.6, status: "active", commission: "3%", city: "Lahore" },
  { id: "s5", name: "Samsung Official", url: "samsung.com/pk", phones: 145, rating: 4.8, status: "active", commission: "2%", city: "Nationwide" },
  { id: "s6", name: "Apple Pakistan", url: "apple.com/pk", phones: 32, rating: 4.9, status: "active", commission: "0%", city: "Karachi" },
  { id: "s7", name: "Xiaomi Official", url: "mi.com/pk", phones: 112, rating: 4.5, status: "active", commission: "2%", city: "Lahore" },
  { id: "s8", name: "TechZone PK", url: "techzone.pk", phones: 640, rating: 3.8, status: "pending", commission: "6%", city: "Islamabad" },
];

type Section = "dashboard" | "phones" | "brands" | "stores" | "users" | "reviews" | "analytics" | "settings";

// ──────────────────────────────────────────────────────────────────────────────
// Sub-pages
// ──────────────────────────────────────────────────────────────────────────────

function DashboardSection({ cardBg, text, muted, border, darkMode }: any) {
  const statCards = [
    { label: "Total Users", value: "12,450", change: "+8.2%", up: true, color: "#3b82f6", icon: Users },
    { label: "Total Phones", value: `${phones.length}`, change: `+${phones.length - 8}`, up: true, color: "#8b5cf6", icon: Smartphone },
    { label: "Daily Visits", value: "45,231", change: "+12.1%", up: true, color: "#22c55e", icon: Eye },
    { label: "Price Updates", value: "1,847", change: "-2.3%", up: false, color: "#f59e0b", icon: BarChart2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, change, up, color, icon: Icon }) => (
          <div key={label} className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${up ? "text-green-500" : "text-red-500"}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {change}
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: text }}>{value}</p>
            <p className="text-xs" style={{ color: muted }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
          <h3 className="font-semibold mb-4" style={{ color: text }}>Weekly Traffic</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: muted }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: muted }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, color: text, fontSize: 11 }} />
                <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} fill="url(#colorVisits)" name="Visits" />
                <Line type="monotone" dataKey="searches" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Searches" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
          <h3 className="font-semibold mb-4" style={{ color: text }}>Top Viewed Phones</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPhones} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis type="number" tick={{ fontSize: 10, fill: muted }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: muted }} tickLine={false} axisLine={false} width={72} />
                <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, color: text, fontSize: 11 }} />
                <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent phones table */}
      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: text }}>Recent Phones</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
            <Plus className="w-3 h-3" /> Add Phone
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>{["Phone", "Brand", "Price", "Rating", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left py-2 px-3 text-xs font-semibold" style={{ color: muted }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {phones.slice(0, 6).map((phone) => (
                <tr key={phone.id} className="border-t" style={{ borderColor: border }}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <img src={phone.image} alt={phone.name} className="w-8 h-8 object-cover rounded-lg" />
                      <span className="text-sm font-medium truncate max-w-28" style={{ color: text }}>{phone.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm" style={{ color: muted }}>{phone.brand}</td>
                  <td className="py-3 px-3 text-sm font-medium text-green-500">PKR {phone.lowestPrice.toLocaleString()}</td>
                  <td className="py-3 px-3 text-sm" style={{ color: text }}>⭐ {phone.rating}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${phone.isNew ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                      {phone.isNew ? "New" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      <Link to={`/phone/${phone.id}`} className="text-xs text-blue-500 hover:text-blue-600">View</Link>
                      <button className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PhonesSection({ cardBg, text, muted, border, darkMode }: any) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = phones.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    if (filter === "new") return matchSearch && p.isNew;
    if (filter === "price_drop") return matchSearch && p.isPriceDrop;
    return matchSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: muted }} />
          <input
            placeholder="Search phones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none"
            style={{ background: cardBg, borderColor: border, color: text }}
          />
        </div>
        <div className="flex gap-2">
          {[["all", "All"], ["new", "New"], ["price_drop", "Price Drop"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className="px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
              style={{
                background: filter === val ? "#3b82f6" : "transparent",
                color: filter === val ? "#fff" : muted,
                borderColor: filter === val ? "#3b82f6" : border,
              }}>
              {label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-white ml-auto" style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
          <Plus className="w-3 h-3" /> Add New Phone
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["Phone", "Brand", "Price Range", "Rating", "5G", "PTA", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold" style={{ color: muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((phone) => (
              <tr key={phone.id} className="border-t hover:bg-blue-50/5 transition-colors" style={{ borderColor: border }}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={phone.image} alt={phone.name} className="w-10 h-10 object-cover rounded-xl" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-32" style={{ color: text }}>{phone.name}</p>
                      <p className="text-[10px]" style={{ color: muted }}>{phone.specs.processor.split(" ").slice(0, 2).join(" ")}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm" style={{ color: muted }}>{phone.brand}</td>
                <td className="py-3 px-4">
                  <p className="text-sm font-medium text-green-500">PKR {phone.lowestPrice.toLocaleString()}</p>
                  <p className="text-[10px]" style={{ color: muted }}>to {phone.highestPrice.toLocaleString()}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm" style={{ color: text }}>{phone.rating}</span>
                    <span className="text-[10px]" style={{ color: muted }}>({phone.reviewCount})</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {phone.specs.has5G
                    ? <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700">5G</span>
                    : <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-500">4G</span>}
                </td>
                <td className="py-3 px-4">
                  {phone.specs.ptaApproved
                    ? <CheckCircle className="w-4 h-4 text-green-500" />
                    : <XCircle className="w-4 h-4 text-red-400" />}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                    ${phone.isNew ? "bg-blue-100 text-blue-700" : phone.isPriceDrop ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                    {phone.isNew ? "New" : phone.isPriceDrop ? "Price Drop" : "Active"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Link to={`/phone/${phone.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                    </Link>
                    <button className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors">
                      <Edit2 className="w-3.5 h-3.5 text-yellow-500" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: border }}>
          <span className="text-xs" style={{ color: muted }}>Showing {filtered.length} of {phones.length} phones</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <button key={n} className="w-7 h-7 rounded-lg text-xs font-medium border"
                style={{ background: n === 1 ? "#3b82f6" : "transparent", color: n === 1 ? "#fff" : muted, borderColor: border }}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandsSection({ cardBg, text, muted, border, darkMode }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: muted }}>Manage all phone brands listed on MobileHub PK</p>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
          <Plus className="w-3 h-3" /> Add Brand
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="p-5 rounded-2xl border hover:border-blue-300 transition-colors" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: brand.color }}>
                  {brand.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: text }}>{brand.name}</p>
                  <p className="text-xs" style={{ color: muted }}>{brand.count} phones listed</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors">
                  <Edit2 className="w-3.5 h-3.5 text-yellow-500" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700">Active</span>
              <Link to={`/brand/${brand.id}`} className="text-xs text-blue-500 hover:text-blue-600 transition-colors">View Phones →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoresSection({ cardBg, text, muted, border, darkMode }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: muted }}>{mockStores.length} partner stores listed</p>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
          <Plus className="w-3 h-3" /> Add Store
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["Store", "URL", "City", "Phones Listed", "Rating", "Commission", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold" style={{ color: muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockStores.map((store) => (
              <tr key={store.id} className="border-t hover:bg-blue-50/5 transition-colors" style={{ borderColor: border }}>
                <td className="py-3 px-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {store.name[0]}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm font-medium" style={{ color: text }}>{store.name}</p>
                  <p className="text-xs text-blue-400">{store.url}</p>
                </td>
                <td className="py-3 px-4 text-sm" style={{ color: muted }}>{store.city}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Package className="w-3 h-3" style={{ color: muted }} />
                    <span className="text-sm" style={{ color: text }}>{store.phones.toLocaleString()}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm" style={{ color: text }}>{store.rating}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">{store.commission}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${store.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {store.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors">
                      <Edit2 className="w-3.5 h-3.5 text-yellow-500" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersSection({ cardBg, text, muted, border, darkMode }: any) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = mockUsers.filter((u) => {
    const q = search.toLowerCase();
    const match = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    if (roleFilter === "admin") return match && u.role === "admin";
    if (roleFilter === "banned") return match && u.status === "banned";
    return match;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: muted }} />
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none"
            style={{ background: cardBg, borderColor: border, color: text }}
          />
        </div>
        <div className="flex gap-2">
          {[["all", "All Users"], ["admin", "Admins"], ["banned", "Banned"]].map(([val, label]) => (
            <button key={val} onClick={() => setRoleFilter(val)}
              className="px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
              style={{
                background: roleFilter === val ? "#3b82f6" : "transparent",
                color: roleFilter === val ? "#fff" : muted,
                borderColor: roleFilter === val ? "#3b82f6" : border,
              }}>
              {label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-white ml-auto" style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
          <Plus className="w-3 h-3" /> Add User
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["User", "Joined", "Phones Viewed", "Reviews", "Role", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold" style={{ color: muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t hover:bg-blue-50/5 transition-colors" style={{ borderColor: border }}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: text }}>{user.name}</p>
                      <p className="text-xs" style={{ color: muted }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-xs" style={{ color: muted }}>{user.joined}</td>
                <td className="py-3 px-4 text-sm" style={{ color: text }}>{user.phones}</td>
                <td className="py-3 px-4 text-sm" style={{ color: text }}>{user.reviews}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                      <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      {user.status === "active"
                        ? <UserX className="w-3.5 h-3.5 text-red-400" />
                        : <UserCheck className="w-3.5 h-3.5 text-green-500" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: border }}>
          <span className="text-xs" style={{ color: muted }}>Showing {filtered.length} of {mockUsers.length} users</span>
        </div>
      </div>
    </div>
  );
}

function ReviewsSection({ cardBg, text, muted, border, darkMode }: any) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? mockReviews : mockReviews.filter((r) => r.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {[["all", "All", mockReviews.length], ["pending", "Pending", mockReviews.filter(r => r.status === "pending").length], ["approved", "Approved", mockReviews.filter(r => r.status === "approved").length], ["rejected", "Rejected", mockReviews.filter(r => r.status === "rejected").length]].map(([val, label, count]) => (
            <button key={val} onClick={() => setFilter(val as string)}
              className="px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5"
              style={{
                background: filter === val ? "#3b82f6" : "transparent",
                color: filter === val ? "#fff" : muted,
                borderColor: filter === val ? "#3b82f6" : border,
              }}>
              {label} <span className="px-1.5 py-0.5 rounded-full text-[10px]" style={{ background: filter === val ? "rgba(255,255,255,0.25)" : (darkMode ? "rgba(255,255,255,0.1)" : "#f1f5f9") }}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className="p-4 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {review.user[0]}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold" style={{ color: text }}>{review.user}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{review.phone}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} style={{ fontSize: 11 }}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: muted }}>{review.comment}</p>
                  <p className="text-xs mt-1" style={{ color: darkMode ? "#475569" : "#94a3b8" }}>{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-1 rounded-full text-[10px] font-medium
                  ${review.status === "approved" ? "bg-green-100 text-green-700" : review.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                  {review.status}
                </span>
                {review.status === "pending" && (
                  <>
                    <button className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <XCircle className="w-4 h-4 text-red-400" />
                    </button>
                  </>
                )}
                <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsSection({ cardBg, text, muted, border, darkMode }: any) {
  const summaryCards = [
    { label: "Total Revenue", value: "PKR 12.4M", change: "+18.3%", up: true, color: "#22c55e", icon: DollarSign },
    { label: "Page Views", value: "1.2M", change: "+22.5%", up: true, color: "#3b82f6", icon: Eye },
    { label: "Avg Session", value: "4m 32s", change: "+8.1%", up: true, color: "#8b5cf6", icon: Clock },
    { label: "Bounce Rate", value: "34.2%", change: "-5.1%", up: true, color: "#f59e0b", icon: TrendingDown },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, change, up, color, icon: Icon }) => (
          <div key={label} className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${up ? "text-green-500" : "text-red-500"}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {change}
              </span>
            </div>
            <p className="text-xl font-bold" style={{ color: text }}>{value}</p>
            <p className="text-xs" style={{ color: muted }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
        <h3 className="font-semibold mb-4" style={{ color: text }}>Monthly Growth</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: muted }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: muted }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, color: text, fontSize: 11 }} />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#colorUsers)" name="New Users" />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#colorRevenue)" name="Revenue (PKR)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
          <h3 className="font-semibold mb-4" style={{ color: text }}>Brand Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} fontSize={10}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, color: text, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
          <h3 className="font-semibold mb-4" style={{ color: text }}>Top Search Queries</h3>
          <div className="space-y-3">
            {[
              { q: "Samsung Galaxy S25 Ultra", count: 12450 },
              { q: "iPhone 16 Pro Max", count: 10230 },
              { q: "Redmi Note 14 Pro+", count: 8760 },
              { q: "Xiaomi 15 Pro", count: 7340 },
              { q: "best phone under 50k", count: 6890 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 text-xs text-right shrink-0" style={{ color: muted }}>{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: text }}>{item.q}</span>
                    <span className="text-xs" style={{ color: muted }}>{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "#f1f5f9" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${(item.count / 12450) * 100}%`, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ cardBg, text, muted, border, darkMode }: any) {
  const [siteName, setSiteName] = useState("MobileHub PK");
  const [email, setEmail] = useState("admin@mobilehub.pk");
  const [emailNotif, setEmailNotif] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);

  const ToggleSwitch = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle}
      className="relative w-10 h-5 rounded-full transition-colors"
      style={{ background: on ? "#3b82f6" : (darkMode ? "rgba(255,255,255,0.15)" : "#d1d5db") }}>
      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );

  const Field = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: border }}>
      <div>
        <p className="text-sm font-medium" style={{ color: text }}>{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: muted }}>{desc}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {/* General */}
      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold" style={{ color: text }}>General Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: muted }}>Site Name</label>
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
              style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc", borderColor: border, color: text }} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: muted }}>Admin Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
              style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc", borderColor: border, color: text }} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold" style={{ color: text }}>Notifications</h3>
        </div>
        <Field label="Email Notifications" desc="Receive admin alerts by email"><ToggleSwitch on={emailNotif} onToggle={() => setEmailNotif(!emailNotif)} /></Field>
        <Field label="Auto-Approve Reviews" desc="Automatically approve new reviews"><ToggleSwitch on={autoApprove} onToggle={() => setAutoApprove(!autoApprove)} /></Field>
      </div>

      {/* Maintenance */}
      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold" style={{ color: text }}>Security & Maintenance</h3>
        </div>
        <Field label="Maintenance Mode" desc="Take the site offline for maintenance">
          <ToggleSwitch on={maintenanceMode} onToggle={() => setMaintenanceMode(!maintenanceMode)} />
        </Field>
        <Field label="API Key" desc="Secret key for external integrations">
          <div className="flex items-center gap-2">
            <input type="password" value="sk-••••••••••••••" readOnly
              className="px-3 py-1.5 rounded-lg border text-xs outline-none w-36"
              style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc", borderColor: border, color: muted }} />
            <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
            </button>
          </div>
        </Field>
      </div>

      {/* Database */}
      <div className="p-5 rounded-2xl border" style={{ background: cardBg, borderColor: border }}>
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold" style={{ color: text }}>Database & Backups</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Export Data (CSV)", icon: Download, color: "#3b82f6" },
            { label: "Backup Database", icon: Database, color: "#8b5cf6" },
            { label: "Clear Cache", icon: RefreshCw, color: "#f59e0b" },
          ].map(({ label, icon: Icon, color }) => (
            <button key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all hover:-translate-y-0.5"
              style={{ borderColor: border, color }}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      <button className="w-full py-3 rounded-xl text-sm text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
        <Save className="w-4 h-4" /> Save All Settings
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main AdminPage
// ──────────────────────────────────────────────────────────────────────────────

export function AdminPage() {
  const { darkMode } = useApp();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const bg = darkMode ? "#070b14" : "#f0f4f8";
  const sidebarBg = darkMode ? "rgba(10,15,30,0.98)" : "#fff";
  const cardBg = darkMode ? "rgba(15,23,42,0.8)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const navItems: { id: Section; icon: typeof LayoutDashboard; label: string; badge?: string }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "phones", icon: Smartphone, label: "Phones", badge: `${phones.length}` },
    { id: "brands", icon: Tag, label: "Brands", badge: `${brands.length}` },
    { id: "stores", icon: Store, label: "Stores", badge: `${mockStores.length}` },
    { id: "users", icon: Users, label: "Users", badge: "12.4K" },
    { id: "reviews", icon: Star, label: "Reviews", badge: `${mockReviews.filter(r => r.status === "pending").length} new` },
    { id: "analytics", icon: BarChart2, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const sectionTitles: Record<Section, string> = {
    dashboard: "Dashboard Overview",
    phones: "Phone Management",
    brands: "Brand Management",
    stores: "Store Management",
    users: "User Management",
    reviews: "Review Moderation",
    analytics: "Analytics & Reports",
    settings: "Admin Settings",
  };

  const sharedProps = { cardBg, text, muted, border, darkMode };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: bg }}>
      {/* Sidebar */}
      <div className="transition-all duration-300 flex flex-col"
        style={{ width: sidebarOpen ? 240 : 64, background: sidebarBg, borderRight: `1px solid ${border}`, flexShrink: 0 }}>
        <div className="p-4 flex items-center justify-between h-16 border-b" style={{ borderColor: border }}>
          {sidebarOpen && <span className="font-bold text-sm" style={{ color: text }}>Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ml-auto">
            {sidebarOpen ? <X className="w-4 h-4" style={{ color: muted }} /> : <Menu className="w-4 h-4" style={{ color: muted }} />}
          </button>
        </div>

        <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
          {navItems.map(({ id, icon: Icon, label, badge }) => (
            <button key={id} type="button" onClick={() => setActiveSection(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm relative"
              style={{
                background: activeSection === id ? (darkMode ? "rgba(59,130,246,0.15)" : "#eff6ff") : "transparent",
                color: activeSection === id ? "#3b82f6" : muted,
                border: `1px solid ${activeSection === id ? "rgba(59,130,246,0.3)" : "transparent"}`,
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}>
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{label}</span>
                  {badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: activeSection === id ? "rgba(59,130,246,0.2)" : (darkMode ? "rgba(255,255,255,0.08)" : "#f1f5f9"), color: activeSection === id ? "#3b82f6" : muted }}>
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-3 border-t" style={{ borderColor: border }}>
            <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:bg-blue-50/10"
              style={{ color: muted }}>
              <Globe className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-10 h-16 flex items-center justify-between px-6 border-b"
          style={{ background: darkMode ? "rgba(7,11,20,0.95)" : "rgba(240,244,248,0.95)", borderColor: border, backdropFilter: "blur(12px)" }}>
          <h1 className="font-bold" style={{ color: text }}>{sectionTitles[activeSection]}</h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-4 h-4" style={{ color: muted }} />
              <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">A</div>
            {sidebarOpen && (
              <div className="hidden sm:block">
                <p className="text-xs font-medium" style={{ color: text }}>Admin User</p>
                <p className="text-[10px]" style={{ color: muted }}>admin@mobilehub.pk</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {activeSection === "dashboard" && <DashboardSection {...sharedProps} />}
          {activeSection === "phones" && <PhonesSection {...sharedProps} />}
          {activeSection === "brands" && <BrandsSection {...sharedProps} />}
          {activeSection === "stores" && <StoresSection {...sharedProps} />}
          {activeSection === "users" && <UsersSection {...sharedProps} />}
          {activeSection === "reviews" && <ReviewsSection {...sharedProps} />}
          {activeSection === "analytics" && <AnalyticsSection {...sharedProps} />}
          {activeSection === "settings" && <SettingsSection {...sharedProps} />}
        </div>
      </div>
    </div>
  );
}
