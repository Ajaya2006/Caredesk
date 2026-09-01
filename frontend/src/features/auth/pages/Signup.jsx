// frontend/src/features/auth/pages/Signup.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Stethoscope,
  Users,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { register } from "../../../api/auth";
import { toast } from "sonner";
import { useUserStore } from "../../../store/userStore";

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export default function Signup() {
  const navigate = useNavigate();
  const { setUser, fetchUser, reset } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    reset();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const token = response.data?.access_token;
      
      if (token) {
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);
        
        const userData = await fetchUser();
        if (userData) {
          setUser(userData);
          toast.success(`Account created! Welcome, ${userData.full_name || formData.name}!`);
          setSuccess(true);
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1500);
        } else {
          setError("Failed to get user data");
        }
      } else {
        setError("Registration failed: No token received");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          className="text-center max-w-md p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-text dark:text-dark-text mb-2"
          >
            Account Created! 🎉
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted dark:text-dark-muted mb-6"
          >
            Welcome to CareDesk! Redirecting to dashboard...
          </motion.p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-[#234EC8] rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#234EC8]/20 to-secondary-500/20" />
        <div className="absolute inset-0 bg-[url('/illustrations/signup-hero.png')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CareDesk" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-display text-2xl font-semibold text-text dark:text-dark-text">CareDesk</p>
              <p className="text-xs text-muted dark:text-dark-muted">Clinic Appointment & Patient Desk</p>
            </div>
          </div>

          <div className="max-w-md">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold text-text dark:text-dark-text leading-tight mb-4"
            >
              Create Your
              <br />
              <span className="text-[#234EC8]">Clinic Account</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted dark:text-dark-muted text-lg mb-8"
            >
              Join thousands of clinics using CareDesk to manage their operations efficiently.
            </motion.p>

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
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#234EC8]/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#234EC8]" />
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
                transition={{ delay: 0.6 + idx * 0.1 }}
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
            <h2 className="text-3xl font-bold text-text dark:text-dark-text">Create Account</h2>
            <p className="text-muted dark:text-dark-muted mt-1">Start managing your clinic efficiently</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text dark:text-dark-text mb-1.5">
                Full Name <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-dark-muted" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dr. John Doe"
                  className="w-full rounded-xl border border-input bg-surface dark:bg-dark-surface px-3 py-2.5 pl-10 text-sm text-text dark:text-dark-text placeholder:text-muted dark:placeholder-dark-muted focus:border-[#234EC8] focus:outline-none focus:ring-2 focus:ring-[#234EC8]/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-dark-text mb-1.5">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-dark-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@caredesk.com"
                  className="w-full rounded-xl border border-input bg-surface dark:bg-dark-surface px-3 py-2.5 pl-10 text-sm text-text dark:text-dark-text placeholder:text-muted dark:placeholder-dark-muted focus:border-[#234EC8] focus:outline-none focus:ring-2 focus:ring-[#234EC8]/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-dark-text mb-1.5">
                Password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-dark-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-input bg-surface dark:bg-dark-surface px-3 py-2.5 pl-10 pr-10 text-sm text-text dark:text-dark-text placeholder:text-muted dark:placeholder-dark-muted focus:border-[#234EC8] focus:outline-none focus:ring-2 focus:ring-[#234EC8]/20 transition-all"
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

            <div>
              <label className="block text-sm font-medium text-text dark:text-dark-text mb-1.5">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-dark-muted" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-input bg-surface dark:bg-dark-surface px-3 py-2.5 pl-10 pr-10 text-sm text-text dark:text-dark-text placeholder:text-muted dark:placeholder-dark-muted focus:border-[#234EC8] focus:outline-none focus:ring-2 focus:ring-[#234EC8]/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted dark:text-dark-muted hover:text-text dark:hover:text-dark-text transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#234EC8] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a9e] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#234EC8]/25 hover:shadow-[#234EC8]/40"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted dark:text-dark-muted">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-[#234EC8] font-medium hover:underline">
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}