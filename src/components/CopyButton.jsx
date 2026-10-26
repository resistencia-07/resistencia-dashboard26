import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ textToCopy, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!textToCopy) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy to clipboard failed:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold transition-all duration-150 cursor-pointer ${
        copied
          ? 'bg-[#FEF6DC] text-[#8C6708] border border-[#FDECB0]'
          : 'text-[#767882] hover:text-[#1E2024] hover:bg-black/[0.04]'
      } ${className}`}
      title={copied ? 'Copied to clipboard!' : `Copy ${label}`}
      aria-label={copied ? 'Copied to clipboard' : `Copy ${label}`}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-[#8C6708]" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span className="hidden sm:inline">{label}</span>
        </>
      )}
    </button>
  );
}
