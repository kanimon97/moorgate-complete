import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Phone, PhoneOff, Sun, Moon } from './Icons';
import { Orb, AgentState } from './Orb';
import { cn } from '../utils/cn';
import { base64ToUint8Array, decodeAudioData } from '../utils/audio';

// NOTE: Hardcoded model for demo purposes.
const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';

interface VoiceAgentProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({ isDarkMode, toggleTheme }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentState, setAgentState] = useState<AgentState>("listening");
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<Promise<any> | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);
  
  // Volume Refs (Passed to Orb)
  const inputVolumeRef = useRef<number>(0);
  const outputVolumeRef = useRef<number>(0);
  
  // Sync
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Audio Analysis Loop
  const analyzeAudioLevels = () => {
     if (inputAnalyserRef.current) {
       const bufferLength = inputAnalyserRef.current.frequencyBinCount;
       const dataArray = new Uint8Array(bufferLength);
       inputAnalyserRef.current.getByteFrequencyData(dataArray);
       
       const sum = dataArray.reduce((a, b) => a + b, 0);
       const average = sum / bufferLength;
       inputVolumeRef.current = Math.min(1, average / 64); // Increased sensitivity
     }

     if (outputAnalyserRef.current) {
        const bufferLength = outputAnalyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        outputAnalyserRef.current.getByteFrequencyData(dataArray);
        
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / bufferLength;
        outputVolumeRef.current = Math.min(1, average / 64);

        // Simple state heuristic
        if (outputVolumeRef.current > 0.01) {
             setAgentState("talking");
        } else {
             setAgentState("listening");
        }
     }
  };

  const stopSession = async () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    sessionRef.current = null;
    
    setIsConnected(false);
    setIsConnecting(false);
    setAgentState("listening");
    inputVolumeRef.current = 0;
    outputVolumeRef.current = 0;
  };

  const startSession = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });

      // 1. Audio Context - IMPORTANT: Create and Resume
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      await audioContext.resume(); // Ensure context is running
      audioContextRef.current = audioContext;

      // 2. Output Analyser
      const outputAnalyser = audioContext.createAnalyser();
      outputAnalyser.fftSize = 256;
      outputAnalyser.smoothingTimeConstant = 0.5;
      outputAnalyser.connect(audioContext.destination); 
      outputAnalyserRef.current = outputAnalyser;

      // 3. Input Setup
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      await inputCtx.resume();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = inputCtx.createMediaStreamSource(stream);
      const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
      const inputAnalyser = inputCtx.createAnalyser();
      inputAnalyser.fftSize = 256;
      inputAnalyser.smoothingTimeConstant = 0.5;
      
      source.connect(inputAnalyser);
      inputAnalyser.connect(scriptProcessor);
      scriptProcessor.connect(inputCtx.destination);
      inputAnalyserRef.current = inputAnalyser;

      // Start Analysis Loop
      analysisIntervalRef.current = window.setInterval(analyzeAudioLevels, 50);

      const sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are a helpful customer support agent.",
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
          },
          onmessage: async (message: LiveServerMessage) => {
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio) {
               try {
                 const ctx = audioContextRef.current;
                 if (!ctx) return;

                 nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                 const audioBuffer = await decodeAudioData(base64ToUint8Array(base64Audio), ctx, 24000);
                 
                 const sourceNode = ctx.createBufferSource();
                 sourceNode.buffer = audioBuffer;
                 sourceNode.connect(outputAnalyser);
                 sourceNode.start(nextStartTimeRef.current);
                 nextStartTimeRef.current += audioBuffer.duration;

                 sourcesRef.current.add(sourceNode);
                 sourceNode.onended = () => sourcesRef.current.delete(sourceNode);
               } catch (e) { console.error(e); }
             }

             if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(source => source.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = audioContextRef.current?.currentTime || 0;
             }
          },
          onclose: () => setIsConnected(false),
          onerror: (err) => {
            console.error(err);
            setError("Connection failed");
            stopSession();
          }
        }
      });

      sessionRef.current = sessionPromise;

      // Helper for PCM Blob
      const createPcmBlob = (data: Float32Array) => {
        const int16 = new Int16Array(data.length);
        for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
        const bytes = new Uint8Array(int16.buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' };
      };

      scriptProcessor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const media = createPcmBlob(inputData);
          sessionPromise.then(s => s.sendRealtimeInput({ media }));
      };

    } catch (err: any) {
      setError(err.message);
      setIsConnecting(false);
    }
  };

  const toggleConnection = () => (isConnected || isConnecting) ? stopSession() : startSession();

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0a] relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 z-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm transition-colors duration-300">
        <div className="flex items-center space-x-3">
             <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Voice Assistant</h2>
        </div>
        
        <div className="flex items-center space-x-4">
             {/* Theme Toggle */}
             <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
                 {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </button>

             {/* Status Badge */}
            <div className={cn("flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-300", 
                isConnected 
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" 
                  : "bg-zinc-200 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-500")}>
                <div className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-blue-500 dark:bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "bg-zinc-500")} />
                <span className="text-xs font-medium">{isConnected ? 'Live' : 'Offline'}</span>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-8">
        
        {error && (
            <div className="absolute top-8 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm z-50">
                {error}
            </div>
        )}

        {/* Ambient Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000",
                isConnected ? "bg-blue-500/10 opacity-100" : "bg-zinc-900/0 opacity-0"
            )} />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
            
            {/* Orb Container - 160px Size */}
            <div className="w-[160px] h-[160px] flex items-center justify-center mb-10 relative z-30">
                 <Orb 
                   agentState={isConnected ? agentState : null}
                   inputVolumeRef={inputVolumeRef}
                   outputVolumeRef={outputVolumeRef}
                   colors={isConnected ? ["#22d3ee", "#3b82f6"] : (isDarkMode ? ["#71717a", "#3f3f46"] : ["#d4d4d8", "#a1a1aa"])}
                 />
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-6">
                <button 
                    onClick={toggleConnection}
                    className={cn(
                        "flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 border backdrop-blur-sm",
                        isConnected 
                            ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30" 
                            : "bg-white dark:bg-white text-black border-transparent hover:scale-105 shadow-xl shadow-zinc-200/50 dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                    )}
                >
                    {isConnecting ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isConnected ? (
                        <PhoneOff className="w-6 h-6" />
                    ) : (
                        <Phone className="w-6 h-6 fill-current" />
                    )}
                </button>
                
                <p className={cn("text-xs font-medium tracking-widest uppercase transition-colors duration-300", 
                    isConnected ? "text-blue-500 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-600")}>
                    {isConnected ? (agentState === 'talking' ? "Speaking" : "Listening") : "Start Conversation"}
                </p>
            </div>
        </div>
      </main>
    </div>
  );
};
