# Project Structure

## Root Files
- `App.tsx` - Main application component with tab routing and theme management
- `index.tsx` - React app entry point
- `types.ts` - Shared TypeScript type definitions
- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration with path aliases and env variable injection
- `tsconfig.json` - TypeScript compiler configuration

## Folder Organization

### `/components`
UI components following a feature-based organization:

- `VoiceAgent.tsx` - Main voice interaction component with real-time audio streaming
- `Orb.tsx` - 3D animated orb visualization using Three.js
- `Chat.tsx` - Text-based chat interface
- `Dashboard.tsx` - Analytics and overview
- `Sidebar.tsx` - Navigation sidebar
- `CallLogs.tsx`, `Claims.tsx`, `Payments.tsx`, `Policies.tsx`, `Settings.tsx` - Feature-specific views
- `Icons.tsx` - Reusable icon components
- `Conversation.tsx` - Conversation display component

### `/services`
External service integrations:

- `gemini.ts` - Google Gemini Live API connection and configuration
  - Contains system instructions and knowledge base
  - Configures voice model and audio settings

### `/utils`
Utility functions:

- `audio.ts` - Audio encoding/decoding, PCM conversion, base64 utilities
- `cn.ts` - Likely className utility for conditional styling

## Architecture Patterns

### Component Structure
- Functional components with React hooks
- Props interfaces defined inline or in types.ts
- Theme passed down via props (isDarkMode, toggleTheme)

### State Management
- Local component state with useState
- Refs for audio contexts and media streams
- No global state management library

### Styling Approach
- Tailwind utility classes
- Dark mode via `dark:` prefix
- Conditional styling with `cn()` utility
- Smooth transitions for theme changes

### Audio Architecture
- Separate input (16kHz) and output (24kHz) AudioContexts
- ScriptProcessorNode for capturing microphone input
- AudioBufferSourceNode for playing AI responses
- AnalyserNode for volume visualization
- Refs to manage audio lifecycle and prevent memory leaks
