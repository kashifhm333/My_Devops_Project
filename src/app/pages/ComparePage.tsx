import { useState } from "react";
import { Link } from "react-router";
import { X, Plus, Star, Check, Minus, GitCompare } from "lucide-react";
import { phones } from "../data/mockData";
import { useApp } from "../context/AppContext";

export function ComparePage() {
  const { darkMode, compareList, toggleCompare, clearCompare } = useApp();
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const bg = darkMode ? "#070b14" : "#f8faff";
  const cardBg = darkMode ? "rgba(15,23,42,0.8)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const comparePhones = phones.filter((p) => compareList.includes(p.id));
  const searchResults = phones
    .filter((p) => !compareList.includes(p.id) &&
      (p.name.toLowerCase().includes(searchInput.toLowerCase()) || p.brand.toLowerCase().includes(searchInput.toLowerCase())))
    .slice(0, 5);

  const specs = [
    { label: "Price", key: (p: typeof phones[0]) => `PKR ${p.lowestPrice.toLocaleString()}`, numeric: (p: typeof phones[0]) => p.lowestPrice, lowerBetter: true },
    { label: "Rating", key: (p: typeof phones[0]) => `${p.rating} ⭐`, numeric: (p: typeof phones[0]) => p.rating },
    { label: "Display", key: (p: typeof phones[0]) => p.specs.display, numeric: null },
    { label: "Refresh Rate", key: (p: typeof phones[0]) => p.specs.refreshRate, numeric: (p: typeof phones[0]) => parseInt(p.specs.refreshRate) },
    { label: "Processor", key: (p: typeof phones[0]) => p.specs.processor, numeric: null },
    { label: "RAM", key: (p: typeof phones[0]) => p.specs.ram, numeric: (p: typeof phones[0]) => parseInt(p.specs.ram) },
    { label: "Storage", key: (p: typeof phones[0]) => p.specs.storage, numeric: (p: typeof phones[0]) => parseInt(p.specs.storage) },
    { label: "Main Camera", key: (p: typeof phones[0]) => p.specs.mainCamera.split("+")[0].trim(), numeric: (p: typeof phones[0]) => parseInt(p.specs.mainCamera) },
    { label: "Battery", key: (p: typeof phones[0]) => p.specs.battery, numeric: (p: typeof phones[0]) => parseInt(p.specs.battery) },
    { label: "Charging", key: (p: typeof phones[0]) => p.specs.charging, numeric: (p: typeof phones[0]) => parseInt(p.specs.charging) },
    { label: "OS", key: (p: typeof phones[0]) => p.specs.os, numeric: null },
    { label: "5G", key: (p: typeof phones[0]) => p.specs.has5G ? "Yes" : "No", numeric: (p: typeof phones[0]) => p.specs.has5G ? 1 : 0 },
    { label: "PTA Approved", key: (p: typeof phones[0]) => p.specs.ptaApproved ? "Yes" : "No", numeric: null },
    { label: "Weight", key: (p: typeof phones[0]) => p.specs.weight, numeric: (p: typeof phones[0]) => parseInt(p.specs.weight) },
  ];

  function getBest(specItem: typeof specs[0], pIndex: number) {
    if (!specItem.numeric || comparePhones.length < 2) return false;
    const values = comparePhones.map((p) => specItem.numeric!(p));
    const best = specItem.lowerBetter ? Math.min(...values) : Math.max(...values);
    return specItem.numeric(comparePhones[pIndex]) === best;
  }

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <GitCompare className="w-6 h-6 text-blue-500" />
            <h1 style={{ color: text, fontSize: "1.75rem", fontWeight: 700 }}>Compare Phones</h1>
          </div>
          {comparePhones.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                clearCompare();
              }}
              className="text-sm text-red-500 hover:text-red-600 transition-colors">Clear all</button>
          )}
        </div>

        {/* Phone Slots */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <td className="w-40 pr-4" />
                {[...Array(4)].map((_, i) => {
                  const phone = comparePhones[i];
                  return (
                    <td key={i} className="p-3 align-top" style={{ minWidth: 200 }}>
                      {phone ? (
                        <div className="relative p-4 rounded-2xl border text-center" style={{ background: cardBg, borderColor: border }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleCompare(phone.id);
                            }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-red-500" />
                          </button>
                          <img src={phone.image} alt={phone.name} className="w-24 h-24 object-cover rounded-xl mx-auto mb-3" />
                          <p className="text-xs text-blue-500 mb-1">{phone.brand}</p>
                          <Link to={`/phone/${phone.id}`}>
                            <p className="font-semibold text-sm leading-snug hover:text-blue-500 transition-colors" style={{ color: text }}>{phone.name}</p>
                          </Link>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs" style={{ color: muted }}>{phone.rating}</span>
                          </div>
                          <p className="font-bold text-green-500 mt-2">PKR {phone.lowestPrice.toLocaleString()}</p>
                        </div>
                      ) : (
                        <div className="relative" onBlur={() => setTimeout(() => setShowDropdown(false), 200)}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowDropdown(i === comparePhones.length);
                            }}
                            className="w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:border-blue-400 hover:bg-blue-50/10"
                            style={{ borderColor: border }}
                          >
                            <Plus className="w-8 h-8" style={{ color: muted }} />
                            <span className="text-sm" style={{ color: muted }}>Add Phone</span>
                          </button>
                          {showDropdown && i === comparePhones.length && (
                            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl border z-20 overflow-hidden"
                              style={{ background: darkMode ? "#0f172a" : "#fff", borderColor: border }}>
                              <div className="p-2">
                                <input
                                  autoFocus
                                  value={searchInput}
                                  onChange={(e) => setSearchInput(e.target.value)}
                                  placeholder="Search phone..."
                                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none mb-2"
                                  style={{
                                    background: darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc",
                                    borderColor: border,
                                    color: text,
                                  }}
                                />
                                {searchResults.map((p) => (
                                  <button key={p.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleCompare(p.id);
                                      setShowDropdown(false);
                                      setSearchInput("");
                                    }}
                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 text-left transition-colors"
                                  >
                                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                                    <div>
                                      <p className="text-sm font-medium" style={{ color: text }}>{p.name}</p>
                                      <p className="text-xs text-green-500">PKR {p.lowestPrice.toLocaleString()}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </thead>

            {comparePhones.length >= 2 && (
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.label} className="border-t" style={{ borderColor: border }}>
                    <td className="py-3 pr-4 text-sm font-medium whitespace-nowrap" style={{ color: muted }}>{spec.label}</td>
                    {[...Array(4)].map((_, i) => {
                      const phone = comparePhones[i];
                      const isBest = phone ? getBest(spec, i) : false;
                      return (
                        <td key={i} className="py-3 px-3">
                          {phone ? (
                            <div className="flex items-center gap-2">
                              {isBest && (
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3 text-green-600" />
                                </div>
                              )}
                              <span className="text-sm" style={{ color: isBest ? "#22c55e" : text, fontWeight: isBest ? 600 : 400 }}>
                                {spec.key(phone)}
                              </span>
                            </div>
                          ) : (
                            <Minus className="w-4 h-4" style={{ color: border }} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {comparePhones.length === 0 && (
          <div className="text-center py-20">
            <GitCompare className="w-16 h-16 mx-auto mb-4" style={{ color: muted }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: text }}>No phones to compare</h2>
            <p className="mb-6" style={{ color: muted }}>Add up to 4 phones to compare their specs side by side</p>
            <Link to="/search" className="px-6 py-3 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
              Browse Phones
            </Link>
          </div>
        )}

        {comparePhones.length === 1 && (
          <div className="text-center py-10">
            <p style={{ color: muted }}>Add at least one more phone to start comparing</p>
          </div>
        )}
      </div>
    </div>
  );
}
