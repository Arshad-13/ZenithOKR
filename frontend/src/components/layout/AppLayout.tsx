import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const AppLayout = () => {
  const { theme } = useAppStore();

  // Enforce dark mode class on the HTML body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-sans overflow-hidden transition-colors duration-300">
      {/* Static Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Topbar />

        {/* Scrollable Page Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* The current route's component will render exactly here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};