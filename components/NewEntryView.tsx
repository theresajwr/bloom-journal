
import React, { useState } from 'react';
import { Mood, Memory } from '../types';
import { MOOD_EMOJIS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface NewEntryViewProps {
  onClose: () => void;
  onSave: (entry: Partial<Memory>) => void;
}

const NewEntryView: React.FC<NewEntryViewProps> = ({ onClose, onSave }) => {
  const [selectedMood, setSelectedMood] = useState<Mood>('Happy');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string>('https://lh3.googleusercontent.com/aida-public/AB6AXuCc29AJC5BvUzDXX-y2jPhh3lNx6wYTJpQyrDJ1FiBehkrRfD5ef2jxTOfKt1y-VB66xqiIEh9cg9r3iuVz7Q--SrtoeH-NyHCRhWQigubIl_Cyb0RLdAN8GtT9GfnjDydBDLQNh6xZpBwpNmt3IMeIsEUUNSJJLniEC2qiEKQrUfhmrpil1oTbTFnTkbOxoLC-kUIMcoBXT9fPeY2yPp5FVB3bMccsqKwWpXUQJhIOYPrS0w2w3HiPtjn_sqhtUB1IISHWQ_bUxz1S');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const moods: Mood[] = ['Happy', 'Excited', 'Calm', 'Party', 'Loved', 'Neutral', 'Sad', 'Awful'];

  const generateDreamscape = async () => {
    if (!content) {
      alert("Please write a little about your day first so I can visualize it! ✨");
      return;
    }
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Create a beautiful, abstract, serene digital art piece in the "Bloom Journal" aesthetic (coastal blues, beige, soft lighting) that visually represents this journal entry: "${content}". Focus on themes of ${selectedMood} energy and nature.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setImage(`data:image/png;base64,${base64Data}`);
          break;
        }
      }
    } catch (e) {
      console.error("Image generation error", e);
      alert("The stars are currently cloudy. Try visualizing again in a moment.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      {/* Nav Bar */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl z-10 border-b border-slate-100 dark:border-slate-800">
        <button onClick={onClose} className="text-slate-400 font-bold text-xs uppercase tracking-widest px-2 py-1">Close</button>
        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">Bloom Entry</h1>
        <button 
          onClick={() => onSave({ title, content, mood: selectedMood, imageUrl: image })}
          className="bg-primary text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          Save
        </button>
      </nav>

      <main className="px-6 pt-8 pb-32 max-w-md mx-auto">
        <div className="mb-10">
          <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-1">Entry for today</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Monday, Oct 24</h2>
        </div>

        <div className="mb-10">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">How are you feeling?</label>
          <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4">
            {moods.map(m => (
              <button 
                key={m}
                onClick={() => setSelectedMood(m)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all ${selectedMood === m ? 'scale-110' : 'opacity-40 grayscale'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all ${
                  selectedMood === m ? 'bg-primary/10 ring-2 ring-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800'
                }`}>
                  {MOOD_EMOJIS[m]}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${selectedMood === m ? 'text-primary' : 'text-slate-400'}`}>
                  {m}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 space-y-4">
          <input 
            type="text"
            placeholder="Name your moment..."
            className="w-full bg-transparent border-none focus:ring-0 text-2xl font-black p-0 mb-2 placeholder:text-slate-200 dark:placeholder:text-slate-700 text-slate-900 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea 
            className="w-full bg-transparent border-none focus:ring-0 text-lg leading-relaxed placeholder:text-slate-200 dark:placeholder:text-slate-700 resize-none min-h-[200px] p-0 text-slate-700 dark:text-slate-300" 
            placeholder="Tell your story here... what made you smile today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visuals</label>
            <button 
              onClick={generateDreamscape}
              disabled={isGeneratingImage}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary/20 transition-all ${
                isGeneratingImage ? 'bg-primary/10 text-primary animate-pulse' : 'text-primary hover:bg-primary/5'
              }`}
            >
              <span className="material-icons text-sm">{isGeneratingImage ? 'auto_fix_high' : 'magic_wand'}</span>
              {isGeneratingImage ? 'Visualizing...' : 'Visualize Moment'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 dark:border-slate-800 shadow-xl">
              <img src={image} className="w-full h-full object-cover" alt="Memory preview" loading="lazy" />
              {isGeneratingImage && (
                <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center">
                   <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white/90 text-slate-900 rounded-full p-2 shadow-lg active:scale-90 transition-transform">
                  <span className="material-icons text-xl">edit</span>
                </button>
              </div>
            </div>
            <button className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 group hover:border-primary/50 transition-all active:scale-95">
              <div className="w-12 h-12 rounded-full bg-background-light dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                <span className="material-icons">add_a_photo</span>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attach Photo</span>
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-background-light dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-all"><span className="material-icons text-sm">text_fields</span></button>
            <button className="w-10 h-10 rounded-xl bg-background-light dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-all"><span className="material-icons text-sm">location_on</span></button>
          </div>
          <div className="w-1/3 h-1.5 bg-background-light dark:bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-primary/20 w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEntryView;
