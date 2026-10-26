export function CategoryIcon({ category, className = 'w-9 h-9' }) {
  switch (category) {
    case 'ndurance.si':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-[#232528] text-[#F5C443] shadow-2xs shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      );

    case 'AVD':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-white border border-[#E5E3DC] text-[#232528] shadow-2xs shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
      );

    case 'Nexlume':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-[#FEF6DC] border border-[#FDECB0] text-[#8C6708] shadow-2xs shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </div>
      );

    case 'Alchemist':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-[#F7F6F1] border border-[#E8E6DF] text-[#232528] shadow-2xs shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2">
            <path d="M10 2v7.31L4.69 17.5a2 2 0 0 0 1.62 3.01h11.38a2 2 0 0 0 1.62-3.01L14 9.31V2" />
            <line x1="8.5" y1="2" x2="15.5" y2="2" />
            <path d="M7 16h10" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-white border border-[#E8E6DF] text-[#1E2024] shadow-2xs shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
      );
  }
}
