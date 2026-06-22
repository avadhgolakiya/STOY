"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "../../context/AppContext";

type AuthState = 'LOGIN' | 'REGISTER' | 'REGISTER_VERIFY_OTP' | 'FORGOT_PASSWORD' | 'VERIFY_OTP' | 'RESET_PASSWORD';

import { Suspense } from "react";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { showToast, login } = useAppContext();
  
  const [authState, setAuthState] = useState<AuthState>('LOGIN');
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data);
        showToast("Welcome back to Adult store", "success");
        router.push(redirectUrl);
      } else {
        if (data.message === 'Please verify your email first') {
          showToast(data.message, "error");
          setAuthState('REGISTER_VERIFY_OTP');
        } else {
          showToast(data.message || "Login failed", "error");
        }
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.warning) {
          const warningMessage = data.otp 
            ? `${data.warning} For testing, your verification code is: ${data.otp}`
            : data.warning;
          showToast(warningMessage, "info");
        } else {
          showToast("OTP sent to your email", "success");
        }
        setAuthState('REGISTER_VERIFY_OTP');
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    }
    setLoading(false);
  };

  const handleVerifyRegistrationOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-registration-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data);
        showToast("Registration successful! Welcome.", "success");
        router.push(redirectUrl);
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.warning) {
          const warningMessage = data.otp 
            ? `${data.warning} For testing, your verification code is: ${data.otp}`
            : data.warning;
          showToast(warningMessage, "info");
        } else {
          showToast("OTP sent to your email", "success");
        }
        setAuthState("VERIFY_OTP");
      } else {
        showToast(data.message || "Failed to send OTP", "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("OTP verified!", "success");
        setAuthState("RESET_PASSWORD");
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Password updated successfully. Please login.", "success");
        setAuthState("LOGIN");
        setPassword("");
        setConfirmPassword("");
        setOtp("");
      } else {
        showToast(data.message || "Failed to reset password", "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-velvet-400 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-luxePink-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full bg-velvet-400/60 backdrop-blur-xl p-10 rounded-xl shadow-2xl border border-luxePink-500/20 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-cinzel text-white uppercase tracking-[0.2em] font-light">
            {authState === 'LOGIN' && 'Sign In'}
            {authState === 'REGISTER' && 'Create Account'}
            {authState === 'REGISTER_VERIFY_OTP' && 'Verify Email'}
            {authState === 'FORGOT_PASSWORD' && 'Forgot Password'}
            {authState === 'VERIFY_OTP' && 'Verify OTP'}
            {authState === 'RESET_PASSWORD' && 'Reset Password'}
          </h2>
          <div className="h-[1px] w-12 bg-luxePink-500 mx-auto mt-4 opacity-60"></div>
        </div>

        {authState === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-7">
            <div className="relative group">
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 text-white focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="absolute left-2 top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                Email Address
              </label>
            </div>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 pr-10 text-white focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="absolute left-2 top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-gray-400 hover:text-luxePink-500 transition-colors"
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => setAuthState('FORGOT_PASSWORD')}
                className="text-[11px] text-luxePink-500/80 hover:text-luxePink-400 tracking-widest uppercase transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-medium py-3.5 px-4 rounded-md uppercase tracking-widest shadow-lg shadow-luxePink-500/20 transition-all duration-300 disabled:opacity-50 text-sm mt-2 cursor-pointer"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-6 tracking-wide">
              New to Adult store?{" "}
              <button type="button" onClick={() => setAuthState('REGISTER')} className="text-luxePink-500 hover:text-luxePink-400 font-semibold uppercase ml-1 cursor-pointer">
                Register
              </button>
            </p>
          </form>
        )}

        {authState === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-7">
            <div className="relative group">
              <input
                type="text"
                required
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 text-white focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="absolute left-2 top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                Full Name
              </label>
            </div>
            <div className="relative group">
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 text-white focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="absolute left-2 top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                Email Address
              </label>
            </div>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 pr-10 text-white focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="absolute left-2 top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-gray-400 hover:text-luxePink-500 transition-colors"
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-medium py-3.5 px-4 rounded-md uppercase tracking-widest shadow-lg shadow-luxePink-500/20 transition-all duration-300 disabled:opacity-50 text-sm mt-4 cursor-pointer"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-6 tracking-wide">
              Already a patron?{" "}
              <button type="button" onClick={() => setAuthState('LOGIN')} className="text-luxePink-500 hover:text-luxePink-400 font-semibold uppercase ml-1 cursor-pointer">
                Sign In
              </button>
            </p>
          </form>
        )}

        {authState === 'REGISTER_VERIFY_OTP' && (
          <form onSubmit={handleVerifyRegistrationOTP} className="space-y-7">
            <p className="text-xs text-gray-300 text-center mb-4 leading-relaxed font-light">
              We have sent a 6-digit OTP to <br/><span className="text-luxePink-400 font-medium">{email}</span><br/>Please enter it below to verify your account.
            </p>
            <p className="text-[11px] text-gray-400 text-center -mt-4 mb-6 leading-normal font-light">
              If it doesn't arrive in a minute, please check your <span className="text-luxePink-300 font-normal">Spam/Junk folder</span> or look at the server console logs.
            </p>
            <div className="relative group">
              <input
                type="text"
                required
                maxLength={6}
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 text-white text-center text-xl tracking-[1em] focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <label className="absolute left-0 right-0 text-center top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-4 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                Enter 6-Digit Code
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-medium py-3.5 px-4 rounded-md uppercase tracking-widest shadow-lg shadow-luxePink-500/20 transition-all duration-300 disabled:opacity-50 text-sm mt-4 cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <p className="text-center text-xs mt-4">
               <button type="button" onClick={() => setAuthState('LOGIN')} className="text-gray-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer">
                Back to Sign In
              </button>
            </p>
          </form>
        )}

        {authState === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleForgotPassword} className="space-y-7">
            <p className="text-xs text-gray-300 text-center mb-6 leading-relaxed font-light">
              Enter your email address and we will send you a 6-digit OTP to securely reset your password.
            </p>
            <div className="relative group">
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 text-white focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="absolute left-2 top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                Email Address
              </label>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setAuthState('LOGIN')}
                className="flex-1 bg-transparent border border-gray-500/50 hover:border-white/50 hover:bg-white/5 text-gray-300 hover:text-white font-medium py-3.5 px-4 rounded-md uppercase tracking-widest transition-all duration-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-medium py-3.5 px-4 rounded-md uppercase tracking-widest shadow-lg shadow-luxePink-500/20 transition-all duration-300 disabled:opacity-50 text-xs cursor-pointer"
              >
                {loading ? 'Sending...' : 'Confirm'}
              </button>
            </div>
          </form>
        )}

        {authState === 'VERIFY_OTP' && (
          <form onSubmit={handleVerifyOTP} className="space-y-7">
            <p className="text-xs text-gray-300 text-center mb-4 leading-relaxed font-light">
              We have sent a 6-digit reset code to <br/><span className="text-luxePink-400 font-medium">{email}</span>
            </p>
            <p className="text-[11px] text-gray-400 text-center -mt-4 mb-6 leading-normal font-light">
              If it doesn't arrive in a minute, please check your <span className="text-luxePink-300 font-normal">Spam/Junk folder</span> or look at the server console logs.
            </p>
            <div className="relative group">
              <input
                type="text"
                required
                maxLength={6}
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 text-white text-center text-xl tracking-[1em] focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <label className="absolute left-0 right-0 text-center top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-4 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                Enter 6-Digit Code
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-medium py-3.5 px-4 rounded-md uppercase tracking-widest shadow-lg shadow-luxePink-500/20 transition-all duration-300 disabled:opacity-50 text-sm mt-4 cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {authState === 'RESET_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-7">
             <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 pr-10 text-white focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="absolute left-2 top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-gray-400 hover:text-luxePink-500 transition-colors"
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full bg-transparent border-b border-luxePink-500/30 px-2 py-3 pr-10 text-white focus:outline-none focus:border-luxePink-500 transition-all peer"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label className="absolute left-2 top-3 text-sm text-gray-400 tracking-widest uppercase transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-luxePink-500 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-luxePink-500 pointer-events-none">
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-3 text-gray-400 hover:text-luxePink-500 transition-colors"
              >
                <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-medium py-3.5 px-4 rounded-md uppercase tracking-widest shadow-lg shadow-luxePink-500/20 transition-all duration-300 disabled:opacity-50 text-sm mt-4 cursor-pointer"
            >
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-velvet-400 flex items-center justify-center"><div className="w-8 h-8 border-2 border-luxePink-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AuthContent />
    </Suspense>
  );
}
