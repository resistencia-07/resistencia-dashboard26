import { createContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const wasOffline = useRef(false);
  const offlineToastId = useRef(null);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reportOffline = useCallback(() => {
    if (wasOffline.current) return;
    wasOffline.current = true;
    setToasts((prev) => prev.filter((toast) => toast.type !== 'error'));
    offlineToastId.current = addToast(
      "You're offline. Please check your internet connection.",
      'error',
      0
    );
  }, [addToast]);

  useEffect(() => {
    const handleOnline = () => {
      if (!wasOffline.current) return;
      wasOffline.current = false;
      if (offlineToastId.current) {
        removeToast(offlineToastId.current);
        offlineToastId.current = null;
      }
      addToast("You're back online.", 'success', 4000);
    };

    window.addEventListener('offline', reportOffline);
    window.addEventListener('online', handleOnline);
    if (!navigator.onLine) reportOffline();
    return () => {
      window.removeEventListener('offline', reportOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [addToast, removeToast, reportOffline]);

  const toast = useMemo(() => ({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => {
      if (navigator.onLine && !wasOffline.current) addToast(msg, 'error');
    },
    info: (msg) => addToast(msg, 'info'),
    offline: reportOffline,
  }), [addToast, reportOffline]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center justify-between p-3.5 rounded-xl bg-white shadow-lg border border-[#EEEEF3] text-sm text-[#101143]"
            >
              <div className="flex items-center gap-3">
                {item.type === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-[#70CF98] shrink-0" />
                )}
                {item.type === 'error' && (
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
                {item.type === 'info' && (
                  <Info className="w-5 h-5 text-[#686EFF] shrink-0" />
                )}
                <span className="font-medium text-xs sm:text-sm leading-snug">
                  {item.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="ml-3 text-[#9A9BA6] hover:text-[#0E123E] transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
