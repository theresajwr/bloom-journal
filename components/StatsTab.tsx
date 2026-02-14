
import React, { useState } from 'react';
import { Memory, Habit } from '../types';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const StatsTab: React.FC<{ memories: Memory[], habits: Habit[] }> = ({ memories, habits }) => {
  const [isReflecting, setIsReflecting] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ text: string; links: { title: string; uri: string }[] } | null>(null);

  const generateAIInsight = async () => {
    setIsReflecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const recentContext = memories.slice(0, 3).map(m => `${m.title}: ${m.content}`).join('\n');
      
      const prompt = `Based on these recent journal entries:
      "${recentContext}"
      
      Provide a 2-sentence empathetic reflection on my current emotional state. 
      Then, find 3 specific, up-to-date wellness tips or activities from the web that would help someone in this mood today.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "I'm having trouble reflecting right now, but keep blooming!";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = chunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || 'Wellness Source',
          uri: chunk.web?.uri || '#'
        }));

      setAiInsight({ text, links });
    } catch (error) {
      console.error("AI Insight Error:", error);
      setAiInsight({ text: "I couldn't reach the stars right now. Try again in a moment!", links: [] });
    } finally {
      setIsReflecting(false);
    }
  };

  const data = [
    { name: 'Mon', mood: 4 },
    { name: 'Tue', mood: 5 },
    { name: 'Wed', mood: 3 },
    { name: 'Thu', mood: 5 },
    { name: 'Fri', mood: 2 },
    { name: 'Sat', mood: 4 },
    { name: 'Sun', mood: 5 },
  ];

  return (
    <div className="px-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Insights</h1>
        <p className="text-slate-500 text-sm">Visualize your growth and well-being</p>
      </header>

      {/* AI Reflect Card */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-lg shadow-primary/20">
        <div className="bg-white dark:bg-slate-900 rounded-[calc(1rem-2px)] p-5">
          {!aiInsight && !isReflecting ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-primary">auto_awesome</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-1">AI Wellness Reflection</h3>
              <p className="text-xs text-slate-500 mb-4">Let Gemini analyze your journey and find custom wellness tips.</p>
              <button 
                onClick={generateAIInsight}
                className="bg-primary text-white text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Reflect with AI
              </button>
            </div>
          ) : isReflecting ? (
            <div className="py-8 text-center space-y-3">
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="relative bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="material-icons animate-pulse">psychology</span>
                </div>
              </div>
              <p className="text-xs font-bold text-primary animate-pulse uppercase tracking-widest">Listening to your heart...</p>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">AI Mindfulness Report</span>
                <button onClick={() => setAiInsight(null)} className="text-slate-300 hover:text-slate-500">
                  <span className="material-icons text-sm">close</span>
                </button>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 italic font-medium">
                "{aiInsight?.text}"
              </p>
              {aiInsight?.links && aiInsight.links.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sources & Reading</p>
                  <div className="flex flex-wrap gap-2">
                    {aiInsight.links.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1 rounded-full text-primary font-bold hover:bg-primary/10 transition-colors flex items-center gap-1"
                      >
                        <span className="material-icons text-[12px]">link</span>
                        {link.title.length > 20 ? link.title.substring(0, 20) + '...' : link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-slate-800/50 p-5 mb-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Mood Trend</h3>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Last 7 Days</span>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="mood" radius={[10, 10, 10, 10]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.mood > 3 ? '#3e88b0' : '#c0cfdb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-accent/30 dark:bg-slate-800/30 border border-primary/10">
          <p className="text-xs font-bold text-primary/80 uppercase mb-1">Total Entries</p>
          <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{memories.length}</h4>
        </div>
        <div className="p-4 rounded-xl bg-secondary/10 dark:bg-slate-800/30 border border-primary/10">
          <p className="text-xs font-bold text-primary/80 uppercase mb-1">Streak</p>
          <h4 className="text-2xl font-bold text-slate-800 dark:text-white">5 Days</h4>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-4 text-slate-600 dark:text-slate-300">Habit Completion</h3>
        <div className="space-y-3">
          {habits.map(habit => (
            <div key={habit.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium">{habit.title}</span>
                <span className="text-[10px] font-bold text-slate-400">80%</span>
              </div>
              <div className="w-full h-1.5 bg-background-light dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '80%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
