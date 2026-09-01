// frontend/src/features/auth/pages/Login.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Stethoscope,
  Users,
  ShieldCheck,
} from "lucide-react";
import { login, googleLogin as googleLoginApi } from "../../../api/auth";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { useUserStore } from "../../../store/userStore";

const formatError = (error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (Array.isArray(error)) {
    return error
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        if (item.msg) {
          const path = Array.isArray(item.loc) ? item.loc.join(".") : item.loc;
          return path ? `${item.msg} (${path})` : item.msg;
        }
        return JSON.stringify(item);
      })
      .filter(Boolean)
      .join("; ");
  }
  if (error?.response?.data?.detail) {
    return formatError(error.response.data.detail);
  }
  if (error?.message) return error.message;
  if (typeof error === "object") return JSON.stringify(error);
  return String(error);
};

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

function GoogleLoginButton({ onSuccess, onError, isLoading }) {
  const googleLogin = useGoogleLogin({
    flow: "implicit",
    scope: "openid profile email",
    onSuccess,
    onError,
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed mb-4 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-950">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      </span>
      Continue with Google
    </button>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { setUser, fetchUser, reset } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    reset();
  }, []);

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await googleLoginApi(tokenResponse.access_token);
      const token = response.data?.access_token;

      if (token) {
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);
        
        const userData = await fetchUser();
        if (userData) {
          setUser(userData);
          toast.success(`Welcome, ${userData.full_name || 'User'}!`);
          navigate("/dashboard", { replace: true });
        } else {
          setError("Failed to get user data");
        }
      } else {
        setError("Google login failed");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      const token = response.data?.access_token;
      
      if (token) {
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);
        
        const userData = await fetchUser();
        if (userData) {
          setUser(userData);
          toast.success(`Welcome, ${userData.full_name || 'User'}!`);
          navigate("/dashboard", { replace: true });
        } else {
          setError("Failed to get user data");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20" />
        <div className="absolute inset-0 bg-[url('/illustrations/login-hero.png')] bg-cover bg-center opacity-10" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CareDesk" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-display text-2xl font-semibold text-text dark:text-dark-text">CareDesk</p>
              <p className="text-xs text-muted dark:text-dark-muted">Clinic Appointment & Patient Desk</p>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-text dark:text-dark-text leading-tight mb-4">
              Smart Clinic
              <br />
              <span className="text-primary-500">Management</span>
            </h1>
            <p className="text-muted dark:text-dark-muted text-lg mb-8">
              Streamline your clinic operations with our comprehensive patient and appointment management system.
            </p>

            <div className="space-y-4">
              {[
                { icon: Users, text: "Manage patient records" },
                { icon: Stethoscope, text: "Book appointments" },
                { icon: ShieldCheck, text: "Secure & reliable" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="text-text dark:text-dark-text">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-8">
            {[
              { number: "500+", label: "Clinics Trust Us" },
              { number: "10K+", label: "Appointments Booked" },
              { number: "98%", label: "Satisfaction Rate" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <div className="text-3xl font-bold text-text dark:text-dark-text">{stat.number}</div>
                <div className="text-sm text-muted dark:text-dark-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="w-full max-w-[420px]"
        >
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <img src="/logo.png" alt="CareDesk" className="h-10 w-10 object-contain" />
            <div>
              <p className="text-display text-lg font-semibold text-text dark:text-dark-text">CareDesk</p>
              <p className="text-[10px] text-muted dark:text-dark-muted">Clinic Appointment & Patient Desk</p>
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-text dark:text-dark-text">Welcome Back</h2>
            <p className="text-muted dark:text-dark-muted mt-1">Sign in to continue to your clinic dashboard</p>
          </div>

          {clientId ? (
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              isLoading={isLoading}
            />
          ) : (
            <div className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 mb-4">
              Google sign-in is unavailable until VITE_GOOGLE_CLIENT_ID is configured.
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border dark:bg-dark-border" />
            <span className="text-xs text-muted dark:text-dark-muted">or</span>
            <div className="flex-1 h-px bg-border dark:bg-dark-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text dark:text-dark-text mb-1.5">Username or email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-dark-muted" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin or admin@caredesk.com"
                  className="w-full rounded-xl border border-input bg-surface dark:bg-dark-surface px-3 py-2.5 pl-10 text-sm text-text dark:text-dark-text placeholder:text-muted dark:placeholder-dark-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-text dark:text-dark-text">Password</label>
                <button type="button" className="text-xs text-primary-500 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-dark-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-input bg-surface dark:bg-dark-surface px-3 py-2.5 pl-10 pr-10 text-sm text-text dark:text-dark-text placeholder:text-muted dark:placeholder-dark-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted dark:text-dark-muted hover:text-text dark:hover:text-dark-text transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger"
              >
                {formatError(error)}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted dark:text-dark-muted">
            New to CareDesk?{" "}
            <button onClick={() => navigate("/signup")} className="text-primary-500 font-medium hover:underline">
              Create an account
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}