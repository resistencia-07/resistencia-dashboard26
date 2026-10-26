import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#EEEEF3] border-t-[#686EFF] rounded-full animate-spin" />
          <span className="text-xs font-medium text-[#9A9BA6]">Loading Resistencia...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
