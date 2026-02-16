// hooks/useVapi.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { VAPI_PUBLIC_KEY, DEFAULT_VOICE_ID, MOORGATE_SYSTEM_PROMPT, AGENT_NAME } from '../constants';

export type ConversationState = 'inactive' | 'thinking' | 'listening' | 'talking';
export type CallStatus = 'inactive' | 'loading' | 'active' | 'error';

export const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callStatus, setCallStatus] = useState<CallStatus>('inactive');
  const [conversationState, setConversationState] = useState<ConversationState>('inactive');
  
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      console.log('Call started');
      setCallStatus('active');
      setConversationState('listening');
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setCallStatus('inactive');
      setConversationState('inactive');
      setVolumeLevel(0);
    });

    vapi.on('speech-start', () => {
      console.log('User speech started');
      setConversationState('listening');
    });

    vapi.on('speech-end', () => {
      console.log('User speech ended');
      setConversationState('thinking');
    });

    vapi.on('volume-level', (level: number) => {
      setVolumeLevel(level);
    });

    vapi.on('message', (message: any) => {
      console.log('Vapi message:', message);
      
      if (message.type === 'status-update') {
        if (message.status === 'active') {
          setCallStatus('active');
          setConversationState('listening');
        } else if (message.status === 'ended') {
          setCallStatus('inactive');
          setConversationState('inactive');
        }
      }
      
      if (message.type === 'speech-update') {
        if (message.role === 'assistant' && message.status === 'started') {
          setConversationState('talking');
        } else if (message.role === 'assistant' && message.status === 'stopped') {
          setConversationState('listening');
        }
      }
    });

    vapi.on('error', (e: any) => {
      console.error('Vapi Error:', e);
      
      if (e.type === 'daily-error' && e.error?.message?.type === 'ejected') {
        return;
      }
      
      setCallStatus('error');
      setConversationState('inactive');
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const toggleCall = useCallback(async () => {
    if (callStatus === 'active' || callStatus === 'loading') {
      setCallStatus('inactive');
      setConversationState('inactive');
      vapiRef.current?.stop();
    } else {
      setCallStatus('loading');
      setConversationState('thinking');
      
      try {
        await vapiRef.current?.start({
          model: {
            provider: 'openai',
            model: 'gpt-4o-mini',
            temperature: 0.4,
            maxTokens: 250,
            messages: [
              {
                role: 'system',
                content: MOORGATE_SYSTEM_PROMPT
              }
            ]
          },
          voice: {
            provider: '11labs',
            voiceId: DEFAULT_VOICE_ID,
          },
          name: 'Moorgate Finance Assistant',
          firstMessage: `Hello! This is ${AGENT_NAME} from Moorgate Finance. How are we doing today?`,
          transcriber: {
            provider: 'deepgram',
            model: 'nova-2',
            language: 'en-GB',
          },
          silenceTimeoutSeconds: 30,
          maxDurationSeconds: 600,
        });
      } catch (err: any) {
        console.error("Failed to start call", err);
        setCallStatus('error');
        setConversationState('inactive');
      }
    }
  }, [callStatus]);

  return {
    volumeLevel,
    callStatus,
    conversationState,
    toggleCall,
  };
};