import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, Smartphone } from "lucide-react";
import { useApp } from "../context/AppContext";

export function LoginPage() {
  const { darkMode, login } = useApp();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const bg = darkMode ? "#070b14" : "#f8faff";
  const cardBg = darkMode ? "rgba(15,23,42,0.9)" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#64748b" : "#94a3b8";
  const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const inputBg = darkMode ? "rgba(255,255,255,0.05)" : "#f8fafc";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login();
    navigate("/profile");
  }

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6, #8b5cf6)" }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i}
              className="absolute rounded-full"
              style={{
                width: `${80 + i * 40}px`,
                height: `${80 + i * 40}px`,
                top: `${10 + i * 15}%`,
                left: `${-20 + i * 20}%`,
                background: "rgba(255,255,255,0.3)",
              }} />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MobileHub PK</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Pakistan's #1
            <span className="block">Mobile Price Comparison</span>
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Track prices, compare specs, and get the best deals from 50+ trusted stores.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "📱", label: "2,500+ Phones" },
              { icon: "🏪", label: "50+ Stores" },
              { icon: "🔔", label: "Price Alerts" },
              { icon: "🆓", label: "100% Free" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 p-4 rounded-xl bg-white/10">
                <span className="text-xl">{f.icon}</span>
                <span className="text-white font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="p-8 rounded-3xl border shadow-2xl" style={{ background: cardBg, borderColor: border }}>
            {/* Logo mobile */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold" style={{ color: text }}>MobileHub <span className="text-blue-500">PK</span></span>
            </div>

            <h2 className="text-2xl font-bold mb-1" style={{ color: text }}>
              {isSignup ? "Create account" : "Welcome back"}
            </h2>
            <p className="text-sm mb-6" style={{ color: muted }}>
              {isSignup ? "Join MobileHub to track prices and get alerts" : "Sign in to your MobileHub account"}
            </p>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Google", "Facebook"].map((provider) => (
                <button key={provider}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    login();
                    navigate("/profile");
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderColor: border, color: text, background: inputBg }}>
                  <span>{provider === "Google" ? "🇬" : "📘"}</span>
                  {provider}
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: border }} />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs" style={{ background: cardBg, color: muted }}>or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: text }}>Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all focus:border-blue-400"
                    style={{ background: inputBg, borderColor: border, color: text }}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: text }}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none text-sm"
                    style={{ background: inputBg, borderColor: border, color: text }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: text }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-sm"
                    style={{ background: inputBg, borderColor: border, color: text }}
                  />
                  <button type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-blue-500 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>
              {!isSignup && (
                <div className="text-right">
                  <a href="#" className="text-xs text-blue-500 hover:text-blue-600">Forgot password?</a>
                </div>
              )}
              <button type="submit"
                className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: muted }}>
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignup(!isSignup);
                }}
                className="text-blue-500 font-medium hover:text-blue-600 transition-colors">
                {isSignup ? "Sign in" : "Sign up free"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
