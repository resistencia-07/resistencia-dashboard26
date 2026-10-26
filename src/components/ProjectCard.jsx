import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, User, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { PasswordField } from './PasswordField';
import { CopyButton } from './CopyButton';
import { formatDisplayDomain, normalizeUrl } from '../lib/urlUtils';

export function ProjectCard({ project, index = 0, isExpanded, onToggleExpanded }) {
  const {
    project_name,
    project_url,
    category,
    username,
    password,
    admin_username,
    admin_password,
  } = project;

  const validUrl = normalizeUrl(project_url);
  const displayDomain = formatDisplayDomain(project_url);

  const handleCardClick = (e) => {
    // Prevent card navigation if clicking buttons, inputs, links, or form controls
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) {
      return;
    }
    if (validUrl) {
      window.open(validUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (validUrl) {
        window.open(validUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const hasUserCredentials = Boolean(username || password);
  const hasAdminCredentials = Boolean(admin_username || admin_password);
  const hasAnyCredentials = hasUserCredentials || hasAdminCredentials;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Project card for ${project_name}`}
      className={`group relative flex flex-col justify-between rounded-[22px] sm:rounded-[28px] bg-white border border-[#1E2024] p-3 sm:p-5 shadow-[0_4px_20px_-2px_rgba(35,37,40,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(35,37,40,0.10)] transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#232528] ${isExpanded ? 'col-span-2 lg:col-span-3' : ''}`}
    >
      {/* Top Header: Category, Title, 45-degree arrow action pill */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="min-w-0">
              <h3 className="font-heading font-extrabold text-xs sm:text-base lg:text-[17px] text-[#4B4D52] tracking-tight group-hover:text-[#232528] transition-colors leading-snug truncate">
                {project_name}
              </h3>
            </div>
          </div>

          {/* 45-degree arrow circular pill (Exact match to Progress & Time tracker cards in image) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (validUrl) {
                window.open(validUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#1E2024] text-white border border-[#1E2024] flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow group/arrow"
            title="Open project in new tab"
            aria-label={`Open ${project_name} in new tab`}
          >
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover/arrow:scale-110" />
          </button>
        </div>

      </div>

      {/* Expandable Passwords & Credentials Section */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden space-y-2.5 my-1.5"
          >
            {/* Gold divider stripe */}
            <div className="h-px w-full pt-2.5 bg-[#F5C443]" style={{height: '1px', marginBottom: '10px'}} />
            {/* User Account Credentials */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#767882]">
                <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-[#1E2024]">
                  <User className="w-3 h-3 text-[#F5C443]" />
                  <span>Account</span>
                </span>
              </div>

              {username ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between bg-[#F7F6F1] px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-[11px] sm:text-xs"
                >
                  <span className="font-mono text-[#1E2024] font-medium truncate select-all">
                    {username}
                  </span>
                  <CopyButton textToCopy={username} label="Copy" />
                </div>
              ) : (
                <span className="text-[10px] sm:text-xs text-[#9FA1AC] italic">No username</span>
              )}

              {password ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <PasswordField password={password} label="Password" />
                </div>
              ) : (
                <span className="text-[10px] sm:text-xs text-[#9FA1AC] italic">No password</span>
              )}
            </div>

            {/* Admin credentials use light fields to match account credentials. */}
            {hasAdminCredentials && (
              <div className="pt-2 mt-1.5 border-t border-[#F0EEE6]">
                <div className="bg-[#F7F6F1] text-[#1E2024] border border-[#EAE7DF] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#1E2024]">
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="w-2 h-2 text-[#767882]" />
                      <span>Admin Vault</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9FA1AC]" />
                  </div>

                  {admin_username && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-[#EAE7DF] text-[10px] sm:text-xs"
                    >
                      <span className="font-mono text-[#1E2024] truncate select-all">
                        {admin_username}
                      </span>
                      <CopyButton textToCopy={admin_username} label="Copy" />
                    </div>
                  )}

                  {admin_password && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <PasswordField
                        password={admin_password}
                        label="Admin Pass"
                        className="bg-white border-[#EAE7DF]"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Bottom Bar */}
      <div className="mt-1">
        {/* Gold divider stripe */}
        <div className="h-px mb-2.5 bg-[#F5C443]" />
        <div className="flex items-center justify-end">
          {/* Keys Action Pill */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded();
            }}
            className="inline-flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#F5C443] text-[#1E2024] border border-[#F5C443] text-[10px] sm:text-xs font-bold hover:bg-[#F0BC35] transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Hide keys' : 'View keys'}
          >
            <span>{isExpanded ? 'Hide' : 'Keys'}</span>
            <span className="flex w-4 h-4 items-center justify-center rounded-full bg-white">
              {isExpanded ? (
                <ChevronUp className="w-3 h-3 text-[#1E2024]" />
              ) : (
                <ChevronDown className="w-3 h-3 text-[#1E2024]" />
              )}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
