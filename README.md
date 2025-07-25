# AI Meeting Transcription Tool

AI-powered meeting transcription tool using OpenAI Whisper and GPT for intelligent conversation analysis.

## Features

- 🎤 **Audio Transcription**: Convert audio files to text using OpenAI Whisper
- 💬 **ChatGPT Integration**: Interactive conversations with GPT models
- 🔄 **Streaming Support**: Real-time streaming responses
- 📝 **Multiple Formats**: Support for text and SRT output formats
- 🛡️ **TypeScript**: Full type safety and modern development experience

## Prerequisites

- Node.js (v16 or higher)
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Natanaelvich/ai-meet-transciption-gpt.git
cd ai-meet-transciption-gpt
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

### Audio Transcription (Aula 03)

Transcribe audio files using OpenAI Whisper:

```bash
npm run aula-03
```

### ChatGPT Conversations (Aula 04)

Start interactive conversations with GPT:

```bash
npm run aula-04
```

## Project Structure

```
├── src/
│   ├── 03_transcrevendo_audio.ts    # Audio transcription functionality
│   └── 04_conversando_com_chatgpt.ts # ChatGPT conversation examples
├── package.json
├── tsconfig.json
└── README.md
```

## API Examples

### Audio Transcription

```typescript
import { transcreveAudio } from './src/03_transcrevendo_audio';

// Transcribe with text format
const text = await transcreveAudio('audio.mp3', 'pt', 'text');

// Transcribe with SRT format
const srt = await transcreveAudio('audio.mp3', 'pt', 'srt');
```

### ChatGPT Conversations

```typescript
import { chatOpenAI, ChatMessage } from './src/04_conversando_com_chatgpt';

const messages: ChatMessage[] = [
  { role: 'user', content: 'Hello, how are you?' }
];

const response = await chatOpenAI(messages);
```

## Development

Build the project:
```bash
npm run build
```

Run in development mode:
```bash
npm run dev
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 