
import React, { useState, useEffect } from 'react';
import { AppTab, Memory, Habit, Mood } from './types';
import { INITIAL_MEMORIES, INITIAL_HABITS } from './constants';
import JournalTab from './components/JournalTab';
import HabitsTab from './components/HabitsTab';
import MemoriesGalleryTab from './components/MemoriesGalleryTab';
import StatsTab from './components/StatsTab';
import NewEntryView from './components/NewEntryView';
import NavigationBar from './components/NavigationBar';
import LiveCompanionTab from './components/LiveCompanionTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleSaveEntry = (newEntry: Partial<Memory>) => {
    const memory: Memory = {
      id: Date.now().toString(),
      title: newEntry.title || 'Untitled Moment',
      content: newEntry.content || '',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: newEntry.imageUrl || 'https://picsum.photos/400/300',
      type: 'event',
      mood: newEntry.mood || 'Happy',
    };
    setMemories([memory, ...memories]);
    setIsNewEntryOpen(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you! We'll send your weekly Bloom recap to ${email}.`);
    setEmail('');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HabitsTab habits={habits} setHabits={setHabits} />;
      case 'journal':
        return <JournalTab memories={memories} />;
      case 'live':
        return <LiveCompanionTab />;
      case 'stats':
        return <StatsTab memories={memories} habits={habits} />;
      case 'profile':
        return (
          <div className="p-8 animate-in fade-in duration-500">
            <div className="text-center mt-12 mb-8">
              <div className="w-28 h-28 mx-auto rounded-full bg-primary/10 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden mb-4 ring-2 ring-primary/20">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYP_zlU_89bowXgyHpMuiRQxyw4tNHC95tAUmSV8-dYOPhV9KHRVZznMwj5S8fgio75uQDeA_SuTUV-d7T6AecoQT_dFUqPB8OlEW5xw8_MvMnRcdgXs5WHZWrzUwSQoVHybefieFT3HVvWwOP070L8s0GpbiuoNVBts5Dx7qcm-MKWTlf7KAAzMGLQIxX1Pu74BE9_XbnpKC5IqMSRRkcIszUxKWs1do4bpP6MnLdriWSiJKssJEeXLYI2IhuXHofhz4rtvdHdfFm" 
                  alt="Profile" 
                  loading="lazy"
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sarah Jenkins</h2>
              <p className="text-slate-500 text-sm">Living my best life, one day at a time ✨</p>
            </div>

            <div className="space-y-4">
               <button 
                 onClick={() => alert("✨ Bloom Tip: Journaling for just 5 minutes can reduce anxiety by 30%.")}
                 className="w-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] py-4 px-6 rounded-2xl flex items-center justify-center gap-2 border border-primary/20 hover:bg-primary/20 transition-all active:scale-95"
               >
                 <span className="material-icons text-sm">tips_and_updates</span>
                 Get Daily Tip
               </button>

               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mt-8">
                 <h3 className="font-bold text-lg mb-2">Weekly Recap</h3>
                 <p className="text-sm text-slate-500 mb-4">Get a beautiful summary of your week's highlights.</p>
                 <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                   <input 
                    type="email" 
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-slate-200 dark:bg-slate-900 dark:border-slate-700 focus:ring-primary focus:border-primary transition-all text-sm"
                   />
                   <button 
                    type="submit"
                    className="w-full bg-primary text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                   >
                     Subscribe
                   </button>
                 </form>
               </div>
            </div>
          </div>
        );
      default:
        return <HabitsTab habits={habits} setHabits={setHabits} />;
    }
  };

  return (
    <div className="mx-auto min-h-screen relative overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="h-10 w-full flex items-center justify-between px-8 text-[11px] font-bold text-slate-400">
        <span>9:41</span>
        <div className="flex gap-1.5 items-center">
          <span className="material-icons text-[12px]">signal_cellular_alt</span>
          <span className="material-icons text-[12px]">wifi</span>
          <span className="material-icons text-[12px] rotate-90">battery_full</span>
        </div>
      </div>

      <div className="pb-32">
        {renderActiveTab()}
      </div>

      {activeTab !== 'live' && (
        <button
          onClick={() => setIsNewEntryOpen(true)}
          className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all"
          title="Add new entry"
        >
          <span className="material-icons text-3xl">add</span>
        </button>
      )}

      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />

      {isNewEntryOpen && (
        <NewEntryView 
          onClose={() => setIsNewEntryOpen(false)} 
          onSave={handleSaveEntry}
        />
      )}
    </div>
  );
};

export default App;
