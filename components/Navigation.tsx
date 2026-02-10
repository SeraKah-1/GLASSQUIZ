import React from 'react';
import { Home, History, Settings } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const tabs = [
    { id: AppView.GENERATOR, icon: Home, label: 'Generator' },
    { id: AppView.HISTORY, icon: History, label: 'Riwayat' },
    { id: AppView.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-full shadow-2xl shadow-indigo-500/10 p-2 flex space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeView(tab.id)}
              className={`
                relative flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300
                ${currentView === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-slate-500 hover:bg-white/50 hover:text-indigo-600'}
              `}
            >
              <Icon size={20} />
              {currentView === tab.id && (
                <span className="text-sm font-medium">{tab.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};