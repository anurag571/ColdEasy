import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggleFloatingButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed bottom-6 left-5 sm:bottom-8 sm:left-8 z-40 flex items-center gap-2.5 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-12 h-12 min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all duration-300 cursor-pointer border backdrop-blur-md relative overflow-hidden group ${
          isDark
            ? 'bg-[#1E1A14]/95 text-amber-300 hover:text-amber-200 border-white/20 hover:border-amber-400/50 hover:shadow-amber-500/10'
            : 'bg-white/95 text-ink hover:text-leaf border-ink/10 hover:border-leaf/40 hover:shadow-leaf/10'
        }`}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Subtle radial sheen on hover */}
        <span
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full ${
            isDark
              ? 'bg-gradient-to-tr from-amber-400/10 to-transparent'
              : 'bg-gradient-to-tr from-leaf/10 to-transparent'
          }`}
          aria-hidden="true"
        />

        {/* Sun Icon (shown in dark mode to switch to light, or vice versa) */}
        <Sun
          className={`w-5 h-5 transition-all duration-300 transform absolute ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-amber-300'
              : 'rotate-90 scale-0 opacity-0 text-amber-500'
          }`}
          aria-hidden="true"
        />

        {/* Moon Icon (shown in light mode to switch to dark) */}
        <Moon
          className={`w-5 h-5 transition-all duration-300 transform absolute ${
            isDark
              ? '-rotate-90 scale-0 opacity-0 text-ink-60'
              : 'rotate-0 scale-100 opacity-100 text-ink group-hover:text-leaf'
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Accessible Hover Tooltip for Desktop */}
      <div
        className={`hidden sm:flex items-center px-3 py-1.5 rounded-xl shadow-md border text-xs font-heading font-medium tracking-wide transition-all duration-200 pointer-events-none whitespace-nowrap ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
        } ${
          isDark
            ? 'bg-[#1E1A14]/95 text-[#EDE8DE] border-white/10'
            : 'bg-white/95 text-ink border-ink/10'
        }`}
        aria-hidden="true"
      >
        <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
      </div>
    </div>
  );
};
