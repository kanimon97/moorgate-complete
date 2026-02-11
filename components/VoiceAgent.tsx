import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Blob as GenAI_Blob, LiveServerMessage } from '@google/genai';
import { Phone, PhoneOff, Sun, Moon } from './Icons';
import { Orb, AgentState } from './Orb';
import { cn } from '../utils/cn';
import { connectToGeminiLive } from '../services/gemini';
import { decode, decodeAudioData, encode } from '../utils/audio';

enum AgentStatusEnum {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR',
}

interface VoiceAgentProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({ isDarkMode, toggleTheme }) => {
  const [status, setStatus] = useState<AgentStatusEnum>(AgentStatusEnum.IDLE);
  
  const sessionPromiseRef = useRef<ReturnType<typeof connectToGeminiLive> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const nextStartTimeRef = useRef(0);
  const outputSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Refs for audio visualization
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  // Volume Refs for Orb
  const inputVolumeRef = useRef<number>(0);
  const outputVolumeRef = useRef<number>(0);

  // Map internal status to Orb's AgentState
  const getOrbState = (): AgentState => {
    switch(status) {
      case AgentStatusEnum.LISTENING:
        return 'listening';
      case AgentStatusEnum.SPEAKING:
        return 'talking';
      case AgentStatusEnum.CONNECTING:
        return 'thinking';
      default:
        return null;
    }
  };

  // Audio analysis for visualization
  const analyzeAudio = useCallback(() => {
    if (!analyserNodeRef.current || !dataArrayRef.current) return;
    
    analyserNodeRef.current.getByteFrequencyData(dataArrayRef.current);
    const average = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
    
    // Update volume for orb animation
    if (status === AgentStatusEnum.SPEAKING) {
      outputVolumeRef.current = Math.min(1, average / 128);
    } else if (status === AgentStatusEnum.LISTENING) {
      inputVolumeRef.current = Math.min(1, average / 128);
    }
  }, [status]);

  useEffect(() => {
    let interval: number | null = null;
    
    if (status === AgentStatusEnum.LISTENING || status === AgentStatusEnum.SPEAKING) {
      interval = window.setInterval(analyzeAudio, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, analyzeAudio]);

  const handleMessage = async (message: LiveServerMessage) => {
    if (message.serverContent) {
      if (message.serverContent.interrupted) {
        outputSourcesRef.current.forEach(source => source.stop());
        outputSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        setStatus(AgentStatusEnum.LISTENING);
      }
      
      const audioData = message.serverContent.modelTurn?.parts[0]?.inlineData.data;
      if (audioData && outputAudioContextRef.current && analyserNodeRef.current) {
        setStatus(AgentStatusEnum.SPEAKING);
        const audioBuffer = await decodeAudioData(
          decode(audioData), 
          outputAudioContextRef.current, 
          24000, 
          1
        );
        const source = outputAudioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyserNodeRef.current);

        source.addEventListener('ended', () => {
          outputSourcesRef.current.delete(source);
          if (outputSourcesRef.current.size === 0) {
            setStatus(AgentStatusEnum.LISTENING);
          }
        });
        
        const currentTime = outputAudioContextRef.current.currentTime;
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);

        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += audioBuffer.duration;
        outputSourcesRef.current.add(source);
      }
    }
  };

  const startSession = async () => {
    setStatus(AgentStatusEnum.CONNECTING);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      // Setup analyser for visualization
      analyserNodeRef.current = outputAudioContextRef.current.createAnalyser();
      analyserNodeRef.current.fftSize = 256;
      analyserNodeRef.current.connect(outputAudioContextRef.current.destination);
      dataArrayRef.current = new Uint8Array(analyserNodeRef.current.frequencyBinCount);

      sessionPromiseRef.current = connectToGeminiLive({
        onopen: () => setStatus(AgentStatusEnum.LISTENING),
        onmessage: handleMessage,
        onerror: (e) => {
          console.error('Session error:', e);
          setStatus(AgentStatusEnum.ERROR);
          stopSession();
        },
        onclose: () => {
          console.log('Session closed');
          setStatus(AgentStatusEnum.IDLE);
        },
      });
      
      const source = inputAudioContextRef.current.createMediaStreamSource(stream);
      mediaStreamSourceRef.current = source;

      const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = scriptProcessor;

      scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
        const pcmBlob: GenAI_Blob = {
          data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
          mimeType: 'audio/pcm;rate=16000',
        };
        sessionPromiseRef.current?.then((session) => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(inputAudioContextRef.current.destination);

    } catch (error) {
      console.error('Failed to start session:', error);
      setStatus(AgentStatusEnum.ERROR);
    }
  };

  const stopSession = useCallback(() => {
    sessionPromiseRef.current?.then((session) => {
      session.close();
    });
    
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    scriptProcessorRef.current?.disconnect();
    mediaStreamSourceRef.current?.disconnect();
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();

    sessionPromiseRef.current = null;
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    mediaStreamRef.current = null;
    scriptProcessorRef.current = null;
    mediaStreamSourceRef.current = null;
    analyserNodeRef.current = null;

    outputSourcesRef.current.forEach(source => source.stop());
    outputSourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    setStatus(AgentStatusEnum.IDLE);
  }, []);

  const toggleConnection = () => {
    if (status === AgentStatusEnum.IDLE || status === AgentStatusEnum.ERROR) {
      startSession();
    } else {
      stopSession();
    }
  };

  const isConnected = status === AgentStatusEnum.LISTENING || status === AgentStatusEnum.SPEAKING;
  const isConnecting = status === AgentStatusEnum.CONNECTING;

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
            <span className="text-xs font-medium">
              {status === AgentStatusEnum.IDLE ? 'Offline' : 
               status === AgentStatusEnum.CONNECTING ? 'Connecting' : 
               status === AgentStatusEnum.LISTENING ? 'Listening' : 
               status === AgentStatusEnum.SPEAKING ? 'Speaking' : 
               status === AgentStatusEnum.ERROR ? 'Error' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-8">
        
        {status === AgentStatusEnum.ERROR && (
          <div className="absolute top-8 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm z-50">
            Connection error. Please try again.
          </div>
        )}

        {/* Ambient Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000",
            isConnected ? "bg-blue-500/10 opacity-100" : "bg-zinc-900/0 opacity-0"
          )} />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
          
          {/* Orb Container */}
          <div className="w-[160px] h-[160px] flex items-center justify-center mb-10 relative z-30">
            <Orb 
              agentState={getOrbState()}
              inputVolumeRef={inputVolumeRef}
              outputVolumeRef={outputVolumeRef}
              colors={isConnected ? ["#22d3ee", "#3b82f6"] : (isDarkMode ? ["#71717a", "#3f3f46"] : ["#d4d4d8", "#a1a1aa"])}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-6">
            <button 
              onClick={toggleConnection}
              disabled={isConnecting}
              className={cn(
                "flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 border backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed",
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
              {isConnected ? (status === AgentStatusEnum.SPEAKING ? "Speaking" : "Listening") : "Start Conversation"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};