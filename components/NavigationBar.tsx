
import React from 'react';
import { AppTab } from '../types';

interface NavigationBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: AppTab; icon: string; label: string; special?: boolean }[] = [
    { id: 'home', icon: 'dashboard', label: 'HOME' },
    { id: 'journal', icon: 'auto_stories', label: 'FEED' },
    { id: 'live', icon: 'waves', label: 'ZEN', special: true },
    { id: 'stats', icon: 'analytics', label: 'STATS' },
    { id: 'profile', icon: 'person_outline', label: 'ME' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 px-6 py-4 pb-8 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all relative ${
            activeTab === tab.id ? 'text-primary scale-110' : 'text-slate-300 dark:text-slate-600'
          }`}
        >
          {tab.special && activeTab !== tab.id && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></span>
          )}
          <span className={`material-icons ${tab.special ? 'text-2xl font-bold' : ''}`}>{tab.icon}</span>
          <span className="text-[9px] font-black tracking-widest">{tab.label}</span>
          {activeTab === tab.id && (
            <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default NavigationBar;
