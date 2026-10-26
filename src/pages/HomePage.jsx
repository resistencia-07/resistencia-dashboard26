import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Search, Layers } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { getProjects } from '../lib/projectService';
import { useToast } from '../context/useToast';
import { ALL_CATEGORIES } from '../lib/constants';

function isNetworkFailure(error) {
  const message = error?.message || String(error || '');
  return !navigator.onLine || /failed to fetch|network error|network request failed|offline|connection/i.test(message);
}

export function HomePage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const toast = useToast();

  const loadProjects = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchErr } = await getProjects();
      if (fetchErr) {
        if (isNetworkFailure(fetchErr)) {
          setError(null);
          toast.offline();
        } else {
          setError(fetchErr.message || 'Database request failed.');
          toast.error('Failed to load projects from database.');
        }
      } else {
        setProjects(data || []);
      }
    } catch (err) {
      if (isNetworkFailure(err)) {
        setError(null);
        toast.offline();
      } else {
        setError(err?.message || 'Error fetching projects');
        toast.error('Could not connect to project database.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProjects(true);
  }, [loadProjects]);

  // Filter projects by search query and category
  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesCategory =
        selectedCategory === 'All' || proj.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        proj.project_name?.toLowerCase().includes(q) ||
        proj.project_url?.toLowerCase().includes(q) ||
        proj.username?.toLowerCase().includes(q) ||
        proj.category?.toLowerCase().includes(q) ||
        proj.admin_username?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);


  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Header — title left, Add Project button right */}
      <div className="pt-2">
        <div className="flex items-center justify-between gap-4 pb-5">
          <h1 className="font-heading font-normal ml-26 text-3xl sm:text-4xl lg:text-[44px] text-[#1E2024] tracking-tight leading-none">
            Welcome!
          </h1>

          {/* Add Project Button — replaces stats */}
          <Link
            to="/add-project"
            className="inline-flex items-center gap-2 h-9 sm:h-11 px-4 sm:px-6 rounded-full bg-[#232528] hover:bg-[#34373C] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-98 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Project</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </div>

      {/* Action Bar — search left, category pills right */}
      <div className="flex items-center gap-2 lg:gap-2.5">
        {/* Search */}
        <div className="relative w-1/2 min-w-0 shrink-0 lg:w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full min-w-0 h-9 sm:h-9 pl-8 pr-8 rounded-full bg-white/80 border border-[#1E2024] text-xs text-[#1E2024] placeholder-[#9FA1AC] focus:bg-white focus:outline-none transition-all shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-[#767882] absolute left-2.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#767882] hover:text-[#1E2024] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Minimal Category Pills */}
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-none pb-0.5 lg:pb-0">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-[#767882] hover:text-[#1E2024] bg-white/60 hover:bg-white border border-[#E5E3DC]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-full bg-[#232528] shadow-xs"
                    transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area: Grid of Cards (2 COLUMNS on Mobile as requested!) */}
      {isLoading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <div className="p-8 rounded-[28px] bg-white border border-rose-200 text-center shadow-xs">
          <p className="text-sm font-semibold text-rose-700">
            Failed to load projects: {error}
          </p>
          <button
            type="button"
            onClick={() => loadProjects(true)}
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
          >
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        searchQuery || selectedCategory !== 'All' ? (
          <div className="p-12 text-center rounded-[28px] bg-white border border-[#E8E6DF] shadow-2xs">
            <Layers className="w-10 h-10 text-[#9FA1AC] mx-auto mb-3" />
            <h4 className="font-heading font-bold text-base text-[#1E2024]">
              No matching projects
            </h4>
            <p className="text-xs text-[#767882] mt-1 mb-4">
              Try adjusting your search terms or category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-bold text-[#1E2024] underline hover:text-[#F5C443] cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <EmptyState />
        )
      ) : (
        /* Exact 2-column mobile layout! */
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                isExpanded={expandedProjectId === project.id}
                onToggleExpanded={() => {
                  setExpandedProjectId((currentId) =>
                    currentId === project.id ? null : project.id
                  );
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
