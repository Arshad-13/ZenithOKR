import { useAppStore } from '../../store/useAppStore';

export const Topbar = () => {
  const { theme, toggleTheme, user } = useAppStore();

  // Get user initials for the avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 transition-colors duration-300">
      {/* Page Context (Can hook into router location later for dynamic titles) */}
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Workspace
        </h2>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-6">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.name || 'Guest User'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || 'Not logged in'}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-sm border border-primary-200 dark:border-primary-800">
            {user ? getInitials(user.name) : '??'}
          </div>
        </div>

      </div>
    </header>
  );
};