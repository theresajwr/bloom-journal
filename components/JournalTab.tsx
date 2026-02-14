
import React from 'react';
import { Memory } from '../types';

const JournalTab: React.FC<{ memories: Memory[] }> = ({ memories }) => {
  return (
    <div className="px-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="pt-6">
        <p className="text-sm font-medium text-primary/70 dark:text-primary/80">Monday, Oct 24</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Memories</h1>
      </header>
      
      <div className="space-y-6">
        {memories.map((memory) => (
          <div 
            key={memory.id}
            className={`rounded-2xl overflow-hidden shadow-sm border border-primary/5 transition-all hover:shadow-md ${
              memory.type === 'event' ? 'bg-muted/20 dark:bg-slate-800/50' :
              memory.type === 'location' ? 'bg-accent/30 dark:bg-slate-800/50' :
              'bg-secondary/10 dark:bg-slate-800/50'
            }`}
          >
            <div className="p-4 flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-icons text-primary text-sm">
                    {memory.type === 'event' ? 'event' : memory.type === 'location' ? 'location_on' : 'restaurant'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {memory.date}{memory.time ? `, ${memory.time}` : ''}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 leading-tight text-slate-800 dark:text-slate-100">{memory.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {memory.content}
                </p>
              </div>
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-white/50 dark:border-slate-700/50">
                <img 
                  src={memory.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt={memory.title} 
                  loading="lazy" 
                />
              </div>
            </div>
            <div className="px-4 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary/40 text-lg">favorite</span>
                {memory.mood && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">MOOD: {memory.mood}</span>}
              </div>
              <button className="text-[11px] font-bold text-primary px-4 py-1.5 bg-white/80 dark:bg-slate-700 rounded-full shadow-sm hover:bg-primary hover:text-white transition-all active:scale-95 uppercase tracking-wider">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalTab;
