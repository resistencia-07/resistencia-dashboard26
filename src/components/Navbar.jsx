import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FolderGit2, PlusCircle, Settings2, LogOut } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';

export function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

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
      <header className="relative z-40 bg-transparent py-2 sm:py-3 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <NavLink to="/" className="flex items-center group transition-transform active:scale-98">
              <BrandLogo />
            </NavLink>

            <nav
              className="hidden md:flex items-center gap-1.5 rounded-full border border-white/40 bg-white/25 p-1.5 shadow-sm backdrop-blur-xl"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                        isActive
                          ? 'text-white'
                          : 'text-[#232528] hover:text-black hover:bg-black/[0.04]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
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
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2.5">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#232528]/15 backdrop-blur-sm shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-[#F5C443] text-[#1E2024] flex items-center justify-center text-[11px] font-extrabold uppercase shadow-2xs">
                  {usernameDisplay.charAt(0)}
                </div>
                <span className="text-xs font-bold text-[#1E2024]">{usernameDisplay}</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>

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

            <div className="flex md:hidden items-center gap-2">
              <div
                className="w-9 h-9 rounded-full bg-[#F5C443] text-[#1E2024] flex items-center justify-center text-xs font-extrabold uppercase shadow-2xs"
                aria-label={`Signed in as ${usernameDisplay}`}
                title={usernameDisplay}
              >
                {usernameDisplay.charAt(0)}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-9 h-9 rounded-full bg-white/80 border border-[#232528]/15 text-[#1E2024] hover:bg-white transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 md:hidden rounded-t-4xl border-t border-[#E8E6DF] bg-[#F7F6F1]/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(35,37,40,0.08)] backdrop-blur-xl"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}
        aria-label="Mobile navigation"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex min-w-0 w-26 flex-col items-center justify-center gap-1 rounded-3xl px-2 py-1.5 text-[10px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#232528] text-white'
                      : 'text-[#767882] hover:bg-white hover:text-[#1E2024]'
                  }`
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
