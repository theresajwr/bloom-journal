
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const encode = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

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

const LiveCompanionTab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to breathe?');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setIsActive(true);
    setStatus('Connecting...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('I am listening...');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Session ended.');
          },
          onerror: (e) => {
            console.error('Live session error:', e);
            setStatus('Connection error.');
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: 'You are Bloom Zen, a gentle mindfulness companion. Speak very calmly. Help the user with a 1-minute breathing exercise or provide soft emotional support based on their mood. Keep responses brief and meditative.',
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Failed to start.');
      setIsActive(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setStatus('Ready to breathe?');
  };

  return (
    <div className="px-8 pt-12 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-700">
      <div className="relative mb-12">
        <div className={`absolute inset-0 bg-primary/20 rounded-full blur-3xl transition-all duration-1000 ${isActive ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`}></div>
        <div className={`w-48 h-48 rounded-full bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center relative border-8 border-accent transition-all duration-700 ${isActive ? 'scale-110' : ''}`}>
           {isActive ? (
             <div className="flex items-center gap-1.5">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="w-1.5 bg-primary rounded-full animate-bounce" style={{ height: `${Math.random() * 40 + 20}px`, animationDelay: `${i * 0.1}s` }}></div>
               ))}
             </div>
           ) : (
             <span className="material-icons text-6xl text-primary/30">spa</span>
           )}
        </div>
      </div>

      <div className="text-center space-y-4 max-w-xs mx-auto mb-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Zen Companion</h1>
        <p className="text-sm font-medium text-slate-400 leading-relaxed">
          {isActive ? status : 'Connect with your inner self. Your Zen companion is here to listen and guide you through a moment of peace.'}
        </p>
      </div>

      <button
        onClick={isActive ? stopSession : startSession}
        className={`w-full max-w-[200px] py-4 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 ${
          isActive 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' 
            : 'bg-primary text-white shadow-primary/30'
        }`}
      >
        {isActive ? 'End Session' : 'Start Zen Mode'}
      </button>

      {!isActive && (
        <div className="mt-8 flex gap-3">
          <div className="px-4 py-1.5 rounded-full bg-accent/30 text-[9px] font-black text-primary uppercase tracking-widest">Breathing</div>
          <div className="px-4 py-1.5 rounded-full bg-accent/30 text-[9px] font-black text-primary uppercase tracking-widest">Meditation</div>
          <div className="px-4 py-1.5 rounded-full bg-accent/30 text-[9px] font-black text-primary uppercase tracking-widest">Support</div>
        </div>
      )}
    </div>
  );
};

export default LiveCompanionTab;
