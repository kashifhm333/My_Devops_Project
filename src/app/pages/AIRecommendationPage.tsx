import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Bot, User, Sparkles, Star, GitCompare, RefreshCw, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { phones } from "../data/mockData";
import { useApp } from "../context/AppContext";
import type { Phone } from "../data/mockData";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  options?: string[];
  phones?: Phone[];
  summary?: string;
}

const QUESTIONS = [
  {
    id: "budget",
    text: "👋 Hi! I'm your AI Phone Finder. Let's find your perfect smartphone in Pakistan!\n\nFirst — what's your budget?",
    options: ["Under PKR 30K", "PKR 30K–60K", "PKR 60K–100K", "PKR 100K–200K", "Over PKR 200K"],
  },
  {
    id: "primary",
    text: "Great choice! 💪 Now, what will you use the phone for mostly?",
    options: ["Gaming & Entertainment", "Photography & Camera", "Business & Productivity", "Social Media & Streaming", "Student Use (Balanced)"],
  },
  {
    id: "feature",
    text: "Almost done! ⚡ What's the one feature you absolutely can't live without?",
    options: ["5G Connectivity", "Long Battery Life (2+ days)", "Best Camera Quality", "Fastest Performance", "Slim & Lightweight Design"],
  },
  {
    id: "brand",
    text: "Last one! 🏷️ Do you have a brand preference?",
    options: ["Samsung", "Apple (iPhone)", "Xiaomi / Redmi", "Any Brand – Best Value", "Local Brands (Tecno, Infinix)"],
  },
];

// Scoring weights per use-case
const USE_WEIGHTS: Record<string, Record<string, number>> = {
  "Gaming & Entertainment": { gaming: 3, performance: 2, display: 1, battery: 1 },
  "Photography & Camera": { camera: 3, display: 2, performance: 1 },
  "Business & Productivity": { performance: 2, battery: 2, display: 1, camera: 1 },
  "Social Media & Streaming": { display: 2, camera: 2, battery: 2, performance: 1 },
  "Student Use (Balanced)": { battery: 2, performance: 2, camera: 1, display: 1 },
};

// Feature boosts
const FEATURE_BOOSTS: Record<string, (p: Phone) => number> = {
  "5G Connectivity": (p) => (p.specs.has5G ? 20 : -10),
  "Long Battery Life (2+ days)": (p) => {
    const mah = parseInt(p.specs.battery.replace(/[^0-9]/g, ""));
    if (mah >= 6000) return 25;
    if (mah >= 5500) return 15;
    if (mah >= 5000) return 8;
    return 0;
  },
  "Best Camera Quality": (p) => {
    const mp = parseInt(p.specs.mainCamera.split("MP")[0]);
    return Math.min(mp / 10, 20) + (p.category.includes("camera") ? 10 : 0);
  },
  "Fastest Performance": (p) => {
    const proc = p.specs.processor.toLowerCase();
    if (proc.includes("8 elite") || proc.includes("a18")) return 25;
    if (proc.includes("8 gen 3") || proc.includes("8300 ultra")) return 22;
    if (proc.includes("8 gen 2") || proc.includes("8200")) return 18;
    if (proc.includes("7 gen 3") || proc.includes("7300")) return 12;
    if (proc.includes("snapdragon") || proc.includes("dimensity 8")) return 10;
    return 0;
  },
  "Slim & Lightweight Design": (p) => {
    const w = parseInt(p.specs.weight.replace(/[^0-9]/g, ""));
    if (w <= 180) return 25;
    if (w <= 190) return 18;
    if (w <= 200) return 10;
    return 0;
  },
};

// Budget filter
function budgetFilter(p: Phone, budget: string): boolean {
  if (budget === "Under PKR 30K") return p.lowestPrice < 30000;
  if (budget === "PKR 30K–60K") return p.lowestPrice >= 30000 && p.lowestPrice <= 60000;
  if (budget === "PKR 60K–100K") return p.lowestPrice > 60000 && p.lowestPrice <= 100000;
  if (budget === "PKR 100K–200K") return p.lowestPrice > 100000 && p.lowestPrice <= 200000;
  if (budget === "Over PKR 200K") return p.lowestPrice > 200000;
  return true;
}

// Brand preference filter
function brandMatch(p: Phone, brand: string): number {
  if (brand === "Any Brand – Best Value") return 0;
  if (brand === "Samsung" && p.brand === "Samsung") return 15;
  if (brand === "Apple (iPhone)" && p.brand === "Apple") return 15;
  if (brand === "Xiaomi / Redmi" && (p.brand === "Xiaomi")) return 15;
  if (brand === "Local Brands (Tecno, Infinix)" && (p.brand === "Tecno" || p.brand === "Infinix" || p.brand === "itel")) return 15;
  if (brand !== "Any Brand – Best Value") return -5; // slight penalty for non-preferred brands
  return 0;
}

function getRecommendations(answers: Record<string, string>): Phone[] {
  const budget = answers["budget"] || "";
  const primary = answers["primary"] || "";
  const feature = answers["feature"] || "";
  const brand = answers["brand"] || "";

  const weights = USE_WEIGHTS[primary] || { performance: 1, camera: 1, battery: 1, display: 1 };
  const featureBoost = FEATURE_BOOSTS[feature] || (() => 0);

  return phones
    .filter((p) => budgetFilter(p, budget))
    .map((p) => {
      // Base score from scores object weighted by use case
      let score = 0;
      score += (p.scores.performance || 0) * (weights.performance || 0);
      score += (p.scores.gaming || 0) * (weights.gaming || 0);
      score += (p.scores.camera || 0) * (weights.camera || 0);
      score += (p.scores.battery || 0) * (weights.battery || 0);
      score += (p.scores.display || 0) * (weights.display || 0);

      // Feature boost
      score += featureBoost(p) * 3;

      // Brand preference
      score += brandMatch(p, brand);

      // Rating boost
      score += p.rating * 5;

      // PTA approved bonus
      if (p.specs.ptaApproved) score += 8;

      // Review popularity
      score += Math.min(p.reviewCount / 200, 10);

      return { phone: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.phone);
}

function getSummaryText(answers: Record<string, string>): string {
  const budget = answers["budget"] || "your budget";
  const primary = answers["primary"] || "general use";
  const feature = answers["feature"] || "good performance";
  return `Based on your budget of **${budget}**, focus on **${primary}**, and priority for **${feature}**, here are my top picks for you! 🎯`;
}

export function AIRecommendationPage() {
  const { darkMode, toggleCompare, compareList } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: QUESTIONS[0].text,
      options: QUESTIONS[0].options,
    },
  ]);
  const [questionStep, setQuestionStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [done, setDone] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const bg = darkMode ? "#070b14" : "#f8faff";
  const cardBg = darkMode ? "rgba(15,23,42,0.8)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleOption(option: string) {
    const q = QUESTIONS[questionStep];
    const newAnswers = { ...answers, [q.id]: option };
    setAnswers(newAnswers);

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: option }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const nextStep = questionStep + 1;

      if (nextStep < QUESTIONS.length) {
        setQuestionStep(nextStep);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "bot",
            text: QUESTIONS[nextStep].text,
            options: QUESTIONS[nextStep].options,
          },
        ]);
      } else {
        const recs = getRecommendations(newAnswers);
        setDone(true);
        const summary = getSummaryText(newAnswers);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "bot",
            text: recs.length > 0
              ? summary
              : "Hmm, I couldn't find phones matching all your criteria exactly. Try adjusting your budget or preferences!",
            phones: recs,
          },
        ]);
      }
    }, 1000);
  }

  function handleReset() {
    setMessages([{ id: 0, role: "bot", text: QUESTIONS[0].text, options: QUESTIONS[0].options }]);
    setQuestionStep(0);
    setAnswers({});
    setDone(false);
  }

  // Render markdown-style bold
  function renderText(t: string) {
    const parts = t.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  }

  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: text }}>AI Phone Finder</h1>
          <p className="text-sm" style={{ color: muted }}>
            Answer 4 quick questions and get smart, personalized recommendations from {phones.length}+ phones
          </p>

          {/* Progress dots */}
          {!done && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {QUESTIONS.map((_, i) => (
                <div key={i} className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === questionStep ? 24 : 8,
                    background: i <= questionStep ? "#3b82f6" : (darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"),
                  }} />
              ))}
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="rounded-3xl border overflow-hidden" style={{ background: cardBg, borderColor: border }}>
          <div ref={chatRef} className="h-[520px] overflow-y-auto p-4 space-y-4 scroll-smooth">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "bot" ? "bg-gradient-to-br from-blue-500 to-purple-500" : "bg-gradient-to-br from-green-400 to-emerald-500"}`}>
                    {msg.role === "bot" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[85%] space-y-3 ${msg.role === "user" ? "items-end flex flex-col" : ""}`}>
                    <div className="px-4 py-3 rounded-2xl text-sm whitespace-pre-line"
                      style={{
                        background: msg.role === "bot"
                          ? darkMode ? "rgba(59,130,246,0.1)" : "#eff6ff"
                          : darkMode ? "rgba(34,197,94,0.1)" : "#f0fdf4",
                        borderColor: msg.role === "bot" ? "rgba(59,130,246,0.2)" : "rgba(34,197,94,0.2)",
                        border: "1px solid",
                        color: text,
                      }}>
                      {renderText(msg.text)}
                    </div>

                    {/* Quick-reply options */}
                    {msg.options && !done && questionStep === QUESTIONS.findIndex((q) => q.id === QUESTIONS[questionStep].id) && msg.id === messages.filter(m => m.role === "bot").slice(-1)[0]?.id && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.options.map((opt) => (
                          <button key={opt}
                            type="button"
                            onClick={() => handleOption(opt)}
                            className="px-3 py-2 rounded-xl text-xs font-medium border transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                            style={{
                              background: darkMode ? "rgba(255,255,255,0.05)" : "#fff",
                              borderColor: darkMode ? "rgba(255,255,255,0.15)" : "#e2e8f0",
                              color: text,
                            }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Phone recommendations */}
                    {msg.phones && msg.phones.length > 0 && (
                      <div className="space-y-3 w-full mt-1">
                        {msg.phones.map((phone, i) => (
                          <motion.div
                            key={phone.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="p-4 rounded-2xl border"
                            style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc", borderColor: border }}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <img src={phone.image} alt={phone.name} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] text-white ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : "bg-amber-600"}`}>
                                    {i === 0 ? "🥇 #1 Best Match" : i === 1 ? "🥈 #2 Pick" : i === 2 ? "🥉 #3 Pick" : `#${i + 1} Recommended`}
                                  </span>
                                  {phone.specs.has5G && <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-400">5G</span>}
                                </div>
                                <p className="font-semibold text-sm truncate" style={{ color: text }}>{phone.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs" style={{ color: muted }}>{phone.rating} ({phone.reviewCount.toLocaleString()} reviews)</span>
                                </div>
                              </div>
                              <p className="font-bold text-green-500 text-sm shrink-0">PKR {phone.lowestPrice.toLocaleString()}</p>
                            </div>

                            {/* Specs pills */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {[
                                phone.specs.processor.split(" ").slice(0, 3).join(" "),
                                phone.specs.ram + " RAM",
                                phone.specs.battery,
                                phone.specs.mainCamera.split("+")[0].trim(),
                              ].map((s) => (
                                <span key={s} className="px-2 py-1 rounded-lg text-[10px]"
                                  style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "#fff", color: muted, border: `1px solid ${border}` }}>
                                  {s}
                                </span>
                              ))}
                            </div>

                            {/* Score bars */}
                            <div className="mb-3 space-y-1.5">
                              {(Object.entries(phone.scores) as [string, number][]).slice(0, 3).map(([key, val]) => (
                                <div key={key} className="flex items-center gap-2">
                                  <span className="text-[9px] capitalize w-16 shrink-0" style={{ color: muted }}>{key}</span>
                                  <div className="flex-1 h-1 rounded-full" style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0" }}>
                                    <div className="h-1 rounded-full transition-all" style={{ width: `${val}%`, background: "linear-gradient(90deg, #3b82f6, #8b5cf6)" }} />
                                  </div>
                                  <span className="text-[9px] w-6 text-right" style={{ color: muted }}>{val}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <Link to={`/phone/${phone.id}`}
                                className="flex-1 py-2 rounded-xl text-xs text-white text-center font-medium"
                                style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                                View Details →
                              </Link>
                              <button
                                type="button"
                                onClick={() => toggleCompare(phone.id)}
                                className="flex-1 py-2 rounded-xl text-xs border transition-all hover:shadow-md font-medium flex items-center justify-center gap-1"
                                style={{
                                  borderColor: compareList.includes(phone.id) ? "#3b82f6" : border,
                                  background: compareList.includes(phone.id) ? "#3b82f6" : "transparent",
                                  color: compareList.includes(phone.id) ? "#fff" : text,
                                }}>
                                <GitCompare className="w-3 h-3" />
                                {compareList.includes(phone.id) ? "Added!" : "Compare"}
                              </button>
                            </div>
                          </motion.div>
                        ))}

                        {/* Feedback & reset */}
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 py-2.5 rounded-xl text-xs border transition-all hover:shadow-md flex items-center justify-center gap-1.5 font-medium"
                            style={{ borderColor: border, color: "#3b82f6" }}>
                            <RefreshCw className="w-3 h-3" /> Start Over
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMessages((prev) => [...prev, { id: Date.now(), role: "bot", text: "Glad I could help! 😊 Feel free to start over anytime to explore different options." }]);
                            }}
                            className="flex-1 py-2.5 rounded-xl text-xs border transition-all hover:shadow-md flex items-center justify-center gap-1.5 font-medium"
                            style={{ borderColor: border, color: "#22c55e" }}>
                            <ThumbsUp className="w-3 h-3" /> Helpful!
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl flex items-center gap-1"
                    style={{ background: darkMode ? "rgba(59,130,246,0.1)" : "#eff6ff" }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs mt-4" style={{ color: muted }}>
          Powered by AI scoring across {phones.length} phones • Recommendations update with market prices
        </p>
      </div>
    </div>
  );
}
