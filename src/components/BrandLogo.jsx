import { Zap } from 'lucide-react';

export function BrandLogo({ className = 'h-5 w-5', markOnly = false }) {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full border border-[#232528]/20 bg-white/50 backdrop-blur-md hover:bg-white/70 transition-all duration-200 shadow-2xs select-none group">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <Zap className="w-full h-full fill-[#F5C443] text-[#F5C443]" aria-hidden="true" />
      </div>

      {!markOnly && (
        <span className="font-heading font-bold text-[16px] tracking-tight text-[#1E2024]">
          Resistencia
        </span>
      )}
    </div>
  );
}
