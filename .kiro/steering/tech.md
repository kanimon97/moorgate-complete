# Technology Stack

## Build System
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript (v5.8.2)
- **React 18** - UI framework with hooks

## Key Libraries & Frameworks

### Core
- `@google/genai` - Google Gemini AI SDK for live audio streaming
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

## Configuration

### Path Aliases
- `@/*` maps to project root for clean imports

### Environment Variables
- `GEMINI_API_KEY` - Required for Google Gemini API access (set in `.env.local`)

### Audio Processing
- Input: 16kHz PCM audio from microphone
- Output: 24kHz PCM audio from Gemini
- Uses Web Audio API with ScriptProcessorNode for real-time processing

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
```

## Development Notes
- Dev server runs on `http://localhost:3000`
- Hot module replacement enabled
- TypeScript strict mode with experimental decorators
- Module resolution: bundler mode (ESNext)
