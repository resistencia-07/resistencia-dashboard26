import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FolderGit2, PlusCircle, Settings2, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer whenever location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Signed out successfully.');
      navigate('/login');
    } catch {
      toast.error('Failed to sign out.');
    }
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: FolderGit2 },
    { to: '/add-project', label: 'Add Project', icon: PlusCircle },
    { to: '/edit-project', label: 'Edit Projects', icon: Settings2 },
  ];

  const usernameDisplay = user?.user_metadata?.username || user?.username || 'Admin';

  return (
    <>
      <header className="relative z-40 bg-transparent py-3 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo in Crextio Pill Style */}
            <NavLink to="/" className="flex items-center group transition-transform active:scale-98">
              <BrandLogo />
            </NavLink>

            {/* Center: Desktop Navigation Pills (Exact match to Dribbble Nixtio shot) */}
            <nav
              className="hidden md:flex items-center gap-1.5 rounded-full border border-white/40 bg-white/25 p-1.5 shadow-sm backdrop-blur-xl"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'text-white'
                        : 'text-[#232528] hover:text-black hover:bg-black/[0.04]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full bg-[#232528] shadow-sm"
                        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{link.label}</span>
                    </span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Right: User Capsule & Logout (Circular & Pill Outline Buttons matching image) */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* User profile capsule */}
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#232528]/15 backdrop-blur-sm shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-[#F5C443] text-[#1E2024] flex items-center justify-center text-[11px] font-extrabold uppercase shadow-2xs">
                  {usernameDisplay.charAt(0)}
                </div>
                <span className="text-xs font-bold text-[#1E2024]">
                  {usernameDisplay}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-9 h-9 rounded-full bg-white/70 border border-[#232528]/15 text-[#767882] hover:text-[#1E2024] hover:bg-white transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                title="Sign out of vault"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 rounded-full bg-white/80 border border-[#232528]/15 flex items-center justify-center text-[#1E2024] shadow-2xs active:scale-95 transition-all cursor-pointer"
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (Matching Nixtio aesthetic) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#1E2024]/40 backdrop-blur-xs"
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-[#F7F6F1] border-l border-[#E8E6DF] p-6 shadow-2xl flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#E8E6DF]">
                  <BrandLogo markOnly={false} />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-white border border-[#E8E6DF] text-[#1E2024] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status card */}
                <div className="my-5 p-3.5 rounded-2xl bg-white border border-[#E8E6DF] flex items-center shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5C443] text-[#1E2024] flex items-center justify-center font-bold text-xs">
                      {usernameDisplay.charAt(0)}
                    </div>
                    <div className="text-xs font-bold text-[#1E2024]">{usernameDisplay}</div>
                  </div>
                </div>

                {/* Mobile Links */}
                <nav className="space-y-1.5" aria-label="Mobile Navigation">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between min-h-[46px] px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                            isActive
                              ? 'bg-[#232528] text-white shadow-sm'
                              : 'bg-white/70 text-[#1E2024] hover:bg-white border border-[#E8E6DF]'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-40" />
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              {/* Logout button */}
              <div className="pt-4 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full min-h-[46px] rounded-2xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
