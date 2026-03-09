# Technology Stack

## Build System
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript (v5.8.2)
- **React 18** - UI framework with hooks

## Key Libraries & Frameworks

### Core
- `@vapi-ai/web` (v2.5.2) - Vapi Web SDK for voice AI integration
- `react` & `react-dom` - UI rendering

### 3D Graphics & Visualization
- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for React Three Fiber

### UI & Utilities
- `recharts` - Data visualization/charts
- `react-markdown` - Markdown rendering
- `uuid` - Unique ID generation
- Tailwind CSS (via utility classes) - Styling

## Voice AI Configuration

### Vapi Integration
- **Provider**: Vapi Web SDK
- **Model**: Google Gemini 2.0 Flash Exp (gemini-2.0-flash-exp)
- **Voice Provider**: ElevenLabs
- **Transcriber**: Deepgram Nova-2 (en-GB)
- **Temperature**: 0.4
- **Max Tokens**: 250
- **Silence Timeout**: 30 seconds
- **Max Duration**: 600 seconds (10 minutes)

### Environment Variables
- `VITE_VAPI_PUBLIC_KEY` - Vapi public API key (set in `.env`)
- Voice ID and system prompts configured in `constants.ts`

### Audio Processing
- Real-time bidirectional audio streaming via Vapi
- Volume level monitoring for visual feedback
- Conversation state tracking (inactive, listening, thinking, talking)

## Powers & MCP

### Installed Powers
- **supabase-hosted** - Supabase integration for database, auth, storage, and realtime

### Installed Skills
- **Vapi Skills** - Located at `.kiro/skills/vapi-skills/`
  - create-assistant - Create Vapi assistants
  - create-call - Make Vapi calls
  - create-phone-number - Set up phone numbers
  - create-squad - Build agent squads
  - create-tool - Define custom tools
  - create-workflow - Configure workflows
  - setup-api-key - Configure API authentication
  - setup-webhook - Set up webhook endpoints

### MCP Servers
- **vapi-docs** - Live access to Vapi documentation via Model Context Protocol
  - Configured in `.kiro/settings/mcp.json`
  - Provides RAG-based access to full Vapi knowledge base
  - Complements skills with advanced configuration, troubleshooting, and SDK details
  - No API key required for documentation access

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Add Vapi Skills (recommended)
npx skills add VapiAI/skills
```

## Development Notes
- Dev server runs on `http://localhost:3000`
- Hot module replacement enabled
- TypeScript strict mode with experimental decorators
- Module resolution: bundler mode (ESNext)
- Vapi public key stored in environment variables
