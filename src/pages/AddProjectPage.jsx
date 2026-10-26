import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ProjectForm } from '../components/ProjectForm';
import { createProject } from '../lib/projectService';
import { useToast } from '../context/useToast';

export function AddProjectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      const { error } = await createProject(formData);

      if (error) {
        toast.error(`Failed to save project: ${error.message || 'Database error'}`);
        return;
      }

      toast.success(`Project "${formData.project_name}" created successfully!`);
      navigate('/');
    } catch (err) {
      toast.error('An unexpected error occurred while saving the project.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </button>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Add Project
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Save your project details and credentials in your admin vault.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Admin-only access</span>
        </div>
      </div>

      {/* Main Form Card with Deep Rounded Corners */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)]">
        <ProjectForm
          onSubmit={handleSave}
          onCancel={() => navigate('/')}
          submitLabel="Save Project"
          isLoading={isSubmitting}
        />
      </div>
    </motion.div>
  );
}
