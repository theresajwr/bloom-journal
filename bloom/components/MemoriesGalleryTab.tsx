
import React from 'react';
import { Memory } from '../types';

const MemoriesGalleryTab: React.FC<{ memories: Memory[] }> = ({ memories }) => {
  return (
    <div className="px-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 pb-4 pt-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Memories</h1>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 active:scale-90 transition-transform">
              <span className="material-icons text-xl">search</span>
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          <button className="px-6 py-2 rounded-full bg-primary text-white text-xs font-bold whitespace-nowrap shadow-lg shadow-primary/20">All Photos</button>
          <button className="px-6 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold whitespace-nowrap">Favorites</button>
          <button className="px-6 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold whitespace-nowrap">October '24</button>
        </div>
      </header>

      <div className="mb-8">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-2 mb-6">October 2024</h2>
        <div className="masonry-container">
          {memories.map((memory) => (
            <div key={memory.id} className="masonry-item group relative">
              <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-white dark:border-slate-800 transition-all hover:shadow-xl hover:-translate-y-1">
                <img 
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={memory.imageUrl} 
                  alt={memory.title} 
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider">{memory.date}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Mock fillers to make it look like a full gallery */}
          {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="masonry-item group relative">
                <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-white dark:border-slate-800 hover:shadow-lg transition-all">
                   <img 
                    src={`https://picsum.photos/400/${300 + (i * 50)}?random=${i}`} 
                    className="w-full h-auto" 
                    alt="placeholder" 
                    loading="lazy" 
                   />
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoriesGalleryTab;
