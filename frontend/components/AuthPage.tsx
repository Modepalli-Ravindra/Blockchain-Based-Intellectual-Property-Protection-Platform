import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { registerUser, loginUser } from '../services/blockchainService';
import type { User } from '../types';

const ShieldOutlineIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-8 w-8"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

interface AuthPageProps {
  onNavigateBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onNavigateBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (error: any) {
      addToast(error.message || 'An error occurred', 'error');
      setLoading(false);
    }
  };
  
  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      addToast('Login successful. Welcome back!', 'success');
      login(user); // We'll keep this as is since the token is already stored in localStorage
    } catch (error: any) {
      addToast(error.message || 'Invalid email or password.', 'error');
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isLogin && password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      setLoading(false);
      return;
    }
    if (!isLogin && password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      setLoading(false);
      return;
    }
    
    try {
      const user = await registerUser(name, email, password);
      addToast('Account created successfully!', 'success');
      login(user); // We'll keep this as is since the token is already stored in localStorage
    } catch (error: any) {
      addToast(error.message || 'Failed to create account.', 'error');
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-teal-900 text-white px-4">
      <button 
        onClick={onNavigateBack} 
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        aria-label="Back to landing page"
      >
        <ArrowLeftIcon />
        <span>Back to Home</span>
      </button>

      <div className="w-full max-w-md mx-auto py-16">
        <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-2xl p-8">
          {/* Header with icon, title, subtitle */}
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-sky-500 to-fuchsia-600 grid place-items-center ring-1 ring-white/20">
              <ShieldOutlineIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">IP Protection Platform</h1>
            <p className="mt-1 text-slate-400">Secure your intellectual property with blockchain technology</p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`${isLogin ? 'bg-slate-900 text-white' : 'text-slate-300 hover:text-white'} flex-1 rounded-md py-2 font-medium`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`${!isLogin ? 'bg-slate-900 text-white' : 'text-slate-300 hover:text-white'} flex-1 rounded-md py-2 font-medium`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <label className="sr-only" htmlFor="name">Full Name</label>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" />
                    <path d="M4 21a8 8 0 0116 0" />
                  </svg>
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            )}

            <div className="relative">
              <label className="sr-only" htmlFor="email">Email</label>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 6l8 6 8-6" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div className="relative">
              <label className="sr-only" htmlFor="password">Password</label>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 10h12v10H6z" />
                  <path d="M8 10V7a4 4 0 118 0v3" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <label className="sr-only" htmlFor="confirm-password">Confirm Password</label>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 10h12v10H6z" />
                    <path d="M8 10V7a4 4 0 118 0v3" />
                  </svg>
                </span>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            )}

            <button
              className="w-full flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-fuchsia-600 py-3 font-semibold shadow hover:from-sky-600 hover:to-fuchsia-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading && <div className="w-5 h-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin mr-2"></div>}
              {loading ? 'Processing...' : (isLogin ? 'Sign In Securely' : 'Create Account')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-slate-400 hover:text-white text-sm">Forgot your password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;