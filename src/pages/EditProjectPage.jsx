import { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, ExternalLink, PlusCircle, Search, RefreshCw, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from '../components/CategoryIcon';
import { PasswordField } from '../components/PasswordField';
import { EditProjectModal } from '../components/EditProjectModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { getProjects, updateProject, deleteProject } from '../lib/projectService';
import { formatDisplayDomain, normalizeUrl } from '../lib/urlUtils';
import { useToast } from '../context/useToast';

export function EditProjectPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getProjects();
      if (error) {
        toast.error(`Could not load projects: ${error.message || 'Database error'}`);
      } else if (data) {
        setProjects(data);
      }
    } catch {
      toast.error('Could not load projects.');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filtered = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.project_name?.toLowerCase().includes(q) ||
      p.project_url?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.username?.toLowerCase().includes(q) ||
      p.admin_username?.toLowerCase().includes(q)
    );
  });

  const handleSaveEdit = async (updatedFields) => {
    if (!editingProject) return;
    setIsSavingEdit(true);
    try {
      const { data, error } = await updateProject(editingProject.id, updatedFields);
      if (error) {
        toast.error(`Failed to update project: ${error.message || 'Database error'}`);
        return;
      }
      setProjects((prev) =>
        prev.map((item) => (item.id === editingProject.id ? { ...item, ...data } : item))
      );
      toast.success(`Project "${updatedFields.project_name}" updated successfully!`);
      setEditingProject(null);
    } catch {
      toast.error('Unexpected error while updating project.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    try {
      const { error } = await deleteProject(deletingProject.id);
      if (error) {
        toast.error(`Failed to delete project: ${error.message || 'Database error'}`);
        return;
      }
      setProjects((prev) => prev.filter((item) => item.id !== deletingProject.id));
      toast.success(`Project "${deletingProject.project_name}" deleted.`);
      setDeletingProject(null);
    } catch {
      toast.error('Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'ndurance.si':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'AVD':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Nexlume':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Alchemist':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Manage Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update your project information and manage credentials in your vault.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadProjects}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            title="Refresh projects"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <Link
            to="/add-project"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Search Bar in Pill Style */}
      <div className="relative w-full max-w-none lg:max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter projects by name, URL, category..."
          className="w-full h-11 px-4 pl-10 rounded-full bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none transition-all shadow-2xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-800 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : filtered.length === 0 ? (
        projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <p className="text-sm text-slate-500">No projects matched your search criteria.</p>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {/* Desktop Table with Deep Rounded Corners */}
          <div className="hidden lg:block bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Project</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">URL</th>
                  <th className="py-4 px-4">Credentials</th>
                  <th className="py-4 px-4">Admin</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <CategoryIcon category={item.category} className="w-9 h-9 shrink-0" />
                        <div>
                          <div className="font-heading font-extrabold text-slate-900">{item.project_name}</div>
                          <span className="text-[11px] text-slate-400 font-mono">ID: {item.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getCategoryBadge(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={normalizeUrl(item.project_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-indigo-600 font-mono bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200"
                      >
                        <span className="max-w-[130px] truncate">{formatDisplayDomain(item.project_url)}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>
                    <td className="py-4 px-4 min-w-[200px]">
                      <div className="space-y-1">
                        {item.username && <div className="text-xs font-mono text-slate-900 truncate">{item.username}</div>}
                        {item.password
                          ? <PasswordField password={item.password} label="Password" className="w-full max-w-[180px]" />
                          : <span className="text-xs text-slate-400 italic">None</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4 min-w-[180px]">
                      {item.admin_username || item.admin_password ? (
                        <div className="space-y-1">
                          {item.admin_username && (
                            <div className="text-xs font-mono text-slate-900 font-semibold truncate flex items-center gap-1">
                              <Shield className="w-3 h-3 text-amber-500" />
                              <span>{item.admin_username}</span>
                            </div>
                          )}
                          {item.admin_password && <PasswordField password={item.admin_password} label="Admin Password" className="w-full max-w-[180px]" />}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingProject(item)}
                          className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label={`Edit ${item.project_name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProject(item)}
                          className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label={`Delete ${item.project_name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards with Touch-Friendly Responsive Sizing */}
          <div className="lg:hidden space-y-3.5">
            {filtered.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon category={item.category} className="w-9 h-9 shrink-0" />
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadge(item.category)}`}>
                        {item.category}
                      </span>
                      <h3 className="font-heading font-extrabold text-sm text-slate-900 mt-1">{item.project_name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingProject(item)}
                      className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingProject(item)}
                      className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  <a
                    href={normalizeUrl(item.project_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-indigo-600"
                  >
                    <span>{formatDisplayDomain(item.project_url)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {item.username && (
                    <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="text-slate-500">Username:</span>
                      <span className="font-mono text-slate-900 font-medium">{item.username}</span>
                    </div>
                  )}
                  {item.password && <PasswordField password={item.password} label="Password" />}
                  {item.admin_password && (
                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block mb-1">Admin Password</span>
                      <PasswordField password={item.admin_password} label="Admin Password" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <EditProjectModal
        isOpen={Boolean(editingProject)}
        project={editingProject}
        onSave={handleSaveEdit}
        onClose={() => setEditingProject(null)}
        isSaving={isSavingEdit}
      />
      <DeleteConfirmModal
        isOpen={Boolean(deletingProject)}
        projectName={deletingProject?.project_name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProject(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
