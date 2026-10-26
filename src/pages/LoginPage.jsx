import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, user, loading: isCheckingSession } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E2E4E5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#E8E6DF] border-t-[#232528] rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#767882]">Checking secure session...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim() || !password) {
      setFormError('Please enter both your username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        toast.success(`Welcome back, ${username}!`);
        navigate(from, { replace: true });
      } else {
        setFormError(result.error || 'Invalid username or password.');
      }
    } catch {
      setFormError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative bg-[#E2E4E5]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-[420px] z-10"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <BrandLogo className="w-6 h-6" markOnly={false} />
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1E2024] mt-6 tracking-tight">
            Hello Admin !
          </h1>
        </div>

        {/* Error message alert */}
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{formError}</span>
          </motion.div>
        )}

        {/* Clean Nixtio Login Card */}
        <div className="bg-white border border-[#E8E6DF] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(35,37,40,0.06)]">
          <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4 sm:space-y-5">
            {/* Username Input */}
            <div>
              <label
                htmlFor="login-username"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2024] mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (formError) setFormError('');
                  }}
                  disabled={isLoading}
                  placeholder="Enter username"
                  className="w-full h-11 px-4 pl-10 rounded-xl bg-[#F7F6F1] border border-[#E8E6DF] text-sm font-medium text-[#1E2024] placeholder-[#9FA1AC] transition-all focus:bg-white focus:border-[#232528] focus:ring-2 focus:ring-[#232528]/10 focus:outline-none disabled:opacity-60"
                />
                <User className="w-4 h-4 text-[#767882] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#1E2024] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError('');
                  }}
                  disabled={isLoading}
                  placeholder="Enter password"
                  className="w-full h-11 px-4 pl-10 pr-10 rounded-xl bg-[#F7F6F1] border border-[#E8E6DF] text-sm font-medium text-[#1E2024] placeholder-[#9FA1AC] transition-all focus:bg-white focus:border-[#232528] focus:ring-2 focus:ring-[#232528]/10 focus:outline-none disabled:opacity-60"
                />
                <Lock className="w-4 h-4 text-[#767882] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767882] hover:text-[#1E2024] p-1 cursor-pointer transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11.5 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm bg-[#232528] hover:bg-[#34373C] active:scale-98 cursor-pointer disabled:opacity-60 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
