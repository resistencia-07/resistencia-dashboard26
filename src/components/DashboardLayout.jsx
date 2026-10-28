import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-600 bg-[#E2E4E5]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-5 pb-24 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
