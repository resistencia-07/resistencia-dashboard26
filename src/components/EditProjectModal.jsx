import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Edit3 } from 'lucide-react';
import { ProjectForm } from './ProjectForm';

export function EditProjectModal({
  isOpen,
  project,
  onSave,
  onClose,
  isSaving = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSaving ? onClose : undefined}
            className="fixed inset-0 bg-[#1E2024]/40 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-dialog-title"
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8E6DF] p-6 sm:p-7 z-10 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E6DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#232528] text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="edit-dialog-title"
                    className="font-heading font-extrabold text-lg text-[#1E2024] tracking-tight"
                  >
                    Edit Project
                  </h3>
                  <p className="text-xs text-[#767882]">
                    Update project credentials and details
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="w-8 h-8 rounded-full bg-[#F7F6F1] text-[#767882] hover:text-[#1E2024] hover:bg-[#EFEFEA] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close edit dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ProjectForm
              initialData={project}
              onSubmit={onSave}
              onCancel={onClose}
              submitLabel="Save Changes"
              isLoading={isSaving}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
