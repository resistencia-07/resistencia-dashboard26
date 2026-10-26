import { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, Globe, Folder, Lock, User, AlertCircle } from 'lucide-react';
import { isValidUrl, normalizeUrl } from '../lib/urlUtils';
import { CATEGORIES } from '../lib/constants';

export function ProjectForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save Project',
  isLoading = false,
}) {
  const [projectName, setProjectName] = useState(initialData.project_name || '');
  const [projectUrl, setProjectUrl] = useState(initialData.project_url || '');
  const [category, setCategory] = useState(initialData.category || 'ndurance.si');
  const [username, setUsername] = useState(initialData.username || '');
  const [password, setPassword] = useState(initialData.password || '');
  const [adminUsername, setAdminUsername] = useState(initialData.admin_username || '');
  const [adminPassword, setAdminPassword] = useState(initialData.admin_password || '');

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Field errors
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!projectUrl.trim()) {
      newErrors.projectUrl = 'Project URL is required';
    } else if (!isValidUrl(projectUrl)) {
      newErrors.projectUrl = 'Please enter a valid URL (e.g. https://example.com)';
    }

    if (!CATEGORIES.includes(category)) {
      newErrors.category = 'Please select a valid category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      project_name: projectName.trim(),
      project_url: normalizeUrl(projectUrl),
      category,
      username: username.trim(),
      password,
      admin_username: adminUsername.trim(),
      admin_password: adminPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Project Info */}
      <div className="space-y-4">
        {/* Project Name */}
        <div>
          <label
            htmlFor="projectName"
            className="block text-xs font-bold uppercase tracking-wider text-[#1E2024] mb-1.5"
          >
            Project Name <span className="text-[#8C6708]">*</span>
          </label>
          <div className="relative">
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (errors.projectName) setErrors((prev) => ({ ...prev, projectName: null }));
              }}
              placeholder="e.g. Ndurance Cloud Portal"
              disabled={isLoading}
              className={`w-full h-11 px-4 pl-10 rounded-xl bg-[#F7F6F1] border text-sm text-[#1E2024] placeholder-[#9FA1AC] transition-all focus:bg-white focus:border-[#232528] focus:ring-2 focus:ring-[#232528]/10 focus:outline-none ${
                errors.projectName ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E6DF]'
              }`}
            />
            <Folder className="w-4 h-4 text-[#767882] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.projectName && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.projectName}</span>
            </p>
          )}
        </div>

        {/* Project URL */}
        <div>
          <label
            htmlFor="projectUrl"
            className="block text-xs font-bold uppercase tracking-wider text-[#1E2024] mb-1.5"
          >
            Project URL <span className="text-[#8C6708]">*</span>
          </label>
          <div className="relative">
            <input
              id="projectUrl"
              type="text"
              value={projectUrl}
              onChange={(e) => {
                setProjectUrl(e.target.value);
                if (errors.projectUrl) setErrors((prev) => ({ ...prev, projectUrl: null }));
              }}
              placeholder="e.g. https://ndurance.si"
              disabled={isLoading}
              className={`w-full h-11 px-4 pl-10 rounded-xl bg-[#F7F6F1] border text-sm text-[#1E2024] placeholder-[#9FA1AC] transition-all focus:bg-white focus:border-[#232528] focus:ring-2 focus:ring-[#232528]/10 focus:outline-none ${
                errors.projectUrl ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E6DF]'
              }`}
            />
            <Globe className="w-4 h-4 text-[#767882] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {errors.projectUrl && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.projectUrl}</span>
            </p>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label
            htmlFor="category"
            className="block text-xs font-bold uppercase tracking-wider text-[#1E2024] mb-1.5"
          >
            Category <span className="text-[#8C6708]">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
            className="w-full h-11 px-4 rounded-xl bg-[#F7F6F1] border border-[#E8E6DF] text-sm font-medium text-[#1E2024] focus:bg-white focus:border-[#232528] focus:ring-2 focus:ring-[#232528]/10 focus:outline-none transition-all cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Credentials Section */}
      <div className="pt-3 border-t border-[#E8E6DF] space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#767882]">
          Project Credentials
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-[#1E2024] mb-1.5"
            >
              Username / Account
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. operator@ndurance.si"
                disabled={isLoading}
                className="w-full h-11 px-4 pl-10 rounded-xl bg-[#F7F6F1] border border-[#E8E6DF] text-sm text-[#1E2024] placeholder-[#9FA1AC] focus:bg-white focus:border-[#232528] focus:ring-2 focus:ring-[#232528]/10 focus:outline-none transition-all"
              />
              <User className="w-4 h-4 text-[#767882] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[#1E2024] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full h-11 px-4 pl-10 pr-10 rounded-xl bg-[#F7F6F1] border border-[#E8E6DF] text-sm text-[#1E2024] placeholder-[#9FA1AC] focus:bg-white focus:border-[#232528] focus:ring-2 focus:ring-[#232528]/10 focus:outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-[#767882] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767882] hover:text-[#1E2024] p-1 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Credentials */}
      <div className="pt-3 border-t border-[#E8E6DF] space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#8C6708]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#767882]">
            Admin Credentials
            <span className="ml-1.5 text-[#9FA1AC] font-normal normal-case tracking-normal">(Optional)</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Admin Username */}
          <div>
            <label
              htmlFor="adminUsername"
              className="block text-xs font-medium text-[#1E2024] mb-1.5"
            >
              Admin Username / Name
            </label>
            <div className="relative">
              <input
                id="adminUsername"
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="e.g. sysadmin"
                disabled={isLoading}
                className="w-full h-11 px-4 pl-10 rounded-xl bg-[#F7F6F1] border border-[#E8E6DF] text-sm text-[#1E2024] placeholder-[#9FA1AC] focus:bg-white focus:border-[#232528] focus:ring-2 focus:ring-[#232528]/10 focus:outline-none transition-all"
              />
              <User className="w-4 h-4 text-[#767882] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Admin Password */}
          <div>
            <label
              htmlFor="adminPassword"
              className="block text-xs font-medium text-[#1E2024] mb-1.5"
            >
              Admin Password
            </label>
            <div className="relative">
              <input
                id="adminPassword"
                type={showAdminPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full h-11 px-4 pl-10 pr-10 rounded-xl bg-[#F7F6F1] border border-[#E8E6DF] text-sm text-[#1E2024] placeholder-[#9FA1AC] focus:bg-white focus:border-[#232528] focus:ring-2 focus:ring-[#232528]/10 focus:outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-[#767882] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767882] hover:text-[#1E2024] p-1 cursor-pointer transition-colors"
                aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
              >
                {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E6DF]">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="h-10.5 px-5 rounded-full border border-[#E8E6DF] bg-white text-sm font-semibold text-[#1E2024] hover:bg-[#F7F6F1] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="h-10.5 px-6 rounded-full bg-[#232528] hover:bg-[#34373C] text-white text-sm font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-98"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  );
}
