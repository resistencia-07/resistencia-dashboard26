import { Link } from 'react-router-dom';
import { PlusCircle, FolderGit2 } from 'lucide-react';

export function EmptyState({ onAction, actionText = 'Add Project' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-dashed border-slate-200 bg-white max-w-xl mx-auto my-8 shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
        <FolderGit2 className="w-7 h-7" />
      </div>

      <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
        No projects yet
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6 max-w-sm">
        Add your first project to store and manage credentials securely in your vault.
      </p>

      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm active:scale-98 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      ) : (
        <Link
          to="/add-project"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm active:scale-98 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
}
