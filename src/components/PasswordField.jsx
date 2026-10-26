import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { CopyButton } from './CopyButton';

export function PasswordField({
  password,
  label = 'Password',
  showCopy = true,
  className = '',
  valueClassName = '',
}) {
  const [revealed, setRevealed] = useState(false);

  if (!password) {
    return <span className="text-[#9FA1AC] text-xs italic">Not configured</span>;
  }

  const toggleReveal = (e) => {
    e.stopPropagation();
    setRevealed((prev) => !prev);
  };

  return (
    <div
      className={`flex items-center justify-between gap-1.5 bg-[#F7F6F1] px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#EAE7DF] text-xs ${className}`}
    >
      <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
        <span className={`font-mono text-xs sm:text-[13px] text-[#1E2024] font-medium truncate select-all ${valueClassName}`}>
          {revealed ? password : '••••••••••••'}
        </span>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <button
          type="button"
          onClick={toggleReveal}
          className="p-1 rounded-lg text-[#767882] hover:text-[#1E2024] hover:bg-black/[0.04] transition-colors cursor-pointer"
          title={revealed ? 'Hide password' : 'Show password'}
          aria-label={revealed ? 'Hide password' : 'Show password'}
        >
          {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>

        {showCopy && <CopyButton textToCopy={password} label={label} />}
      </div>
    </div>
  );
}
