
import React, { useState, useEffect, useRef } from 'react';
import { Habit, Modality } from '../types';
import { GoogleGenAI } from "@google/genai";

interface HabitsTabProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const HabitsTab: React.FC<HabitsTabProps> = ({ habits, setHabits }) => {
  const [affirmation, setAffirmation] = useState("Your journey is beautiful. Keep blooming.");
  const [loadingAffirmation, setLoadingAffirmation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const fetchAffirmation = async () => {
      setLoadingAffirmation(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Generate a unique, short, and inspiring 1-sentence daily affirmation for a wellness journal app. Theme: Coastal serenity and growth.",
        });
        setAffirmation(response.text?.trim() || affirmation);
      } catch (e) {
        console.error("Affirmation error", e);
      } finally {
        setLoadingAffirmation(false);
      }
    };
    fetchAffirmation();
  }, []);

  const speakAffirmation = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say serenely and calmly: ${affirmation}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error("TTS error", e);
      setIsSpeaking(false);
    }
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        return { ...h, current: h.current >= h.total ? 0 : h.current + 1 };
      }
      return h;
    }));
  };

  const weeklyProgress = 85;

  return (
    <div className="px-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end mb-6">
        <div>
          <p className="text-sm font-medium text-slate-500">Monday, Oct 23</p>
          <h1 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">Daily Habits</h1>
        </div>
        <div className="flex items-center bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full border border-primary/20">
          <span className="text-xs font-bold text-primary">🌊 5 DAY STREAK</span>
        </div>
      </header>

      {/* Daily Affirmation Section */}
      <section className="mb-8">
        <div className="bg-accent/20 dark:bg-slate-800/40 p-5 rounded-2xl border border-accent/30 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
             <span className="material-icons text-7xl text-primary">format_quote</span>
          </div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1">
              <span className="material-icons text-[12px]">auto_awesome</span>
              Daily Inspiration
            </p>
            <button 
              onClick={speakAffirmation}
              disabled={isSpeaking || loadingAffirmation}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isSpeaking ? 'bg-primary text-white' : 'bg-white dark:bg-slate-700 text-primary shadow-sm hover:scale-110'
              }`}
            >
              <span className={`material-icons text-sm ${isSpeaking ? 'animate-pulse' : ''}`}>
                {isSpeaking ? 'volume_up' : 'play_arrow'}
              </span>
            </button>
          </div>
          <p className={`text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic pr-8 ${loadingAffirmation ? 'animate-pulse' : ''}`}>
            {loadingAffirmation ? "Whispering inspiration to your soul..." : `"${affirmation}"`}
          </p>
        </div>
      </section>

      <section className="mb-10">
        <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm">Weekly Progress</h3>
            <span className="text-xs text-primary font-medium">{weeklyProgress}% Completed</span>
          </div>
          <div className="flex justify-between gap-2 overflow-x-auto hide-scrollbar">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, idx) => (
              <div key={day} className="flex flex-col items-center min-w-[40px]">
                <span className="text-[10px] font-bold text-slate-400 mb-2">{day}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  idx < 4 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 
                  idx === 4 ? 'border-2 border-primary text-primary bg-primary/5' :
                  'bg-muted/30 dark:bg-slate-700/50 text-slate-400'
                }`}>
                  {idx < 4 ? <span className="material-icons text-sm">check</span> : <span className="text-xs font-bold">{21+idx}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          Today's Habits
          <span className="ml-2 px-2 py-0.5 bg-accent/30 dark:bg-slate-800 rounded-full text-[10px] font-bold">
            {habits.filter(h => h.current < h.total).length} REMAINING
          </span>
        </h2>

        {habits.map((habit) => (
          <div 
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`cursor-pointer p-4 rounded-xl shadow-sm border flex items-center justify-between transition-all active:scale-95 ${
              habit.current >= habit.total 
              ? 'bg-primary/5 dark:bg-primary/10 border-primary/20' 
              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                habit.current >= habit.total ? 'bg-primary/20 text-primary' : 'bg-background-light dark:bg-slate-700 text-primary'
              }`}>
                <span className="material-icons">{habit.icon}</span>
              </div>
              <div className={habit.current >= habit.total ? 'opacity-60' : ''}>
                <h4 className={`font-semibold ${habit.current >= habit.total ? 'line-through' : ''}`}>{habit.title}</h4>
                <p className="text-xs text-slate-400">{habit.goal} • {habit.total - habit.current} left</p>
              </div>
            </div>
            
            <div className="relative w-12 h-12 flex items-center justify-center">
              {habit.current >= habit.total ? (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-icons">check_circle</span>
                </div>
              ) : (
                <>
                   <svg className="w-12 h-12 transform -rotate-90">
                    <circle className="text-slate-100 dark:text-slate-700" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
                    <circle className="text-primary transition-all duration-500" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4" 
                      strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * (habit.current / habit.total))}
                    ></circle>
                  </svg>
                  <span className="absolute text-[10px] font-bold">{habit.current}/{habit.total}</span>
                </>
              )}
            </div>
          </div>
        ))}

        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-center space-x-2 text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
          <span className="material-icons text-sm">add_circle_outline</span>
          <span className="text-sm font-semibold uppercase tracking-wider">Add New Habit</span>
        </div>
      </section>

      <section className="mt-10 mb-8">
        <div className="bg-muted/20 dark:bg-slate-800/30 p-5 rounded-2xl flex items-center justify-between border border-primary/5">
          <div className="flex items-center space-x-3">
            <div className="bg-white dark:bg-slate-700 p-2 rounded-lg text-xl shadow-sm">🌿</div>
            <div>
              <h5 className="text-sm font-bold">How are you feeling?</h5>
              <p className="text-[10px] text-slate-500">Track your mood with your habits</p>
            </div>
          </div>
          <button className="bg-white dark:bg-slate-700 px-4 py-2 rounded-full text-xs font-bold text-primary shadow-sm active:scale-95 transition-transform">
            Log Mood
          </button>
        </div>
      </section>
    </div>
  );
};

export default HabitsTab;
