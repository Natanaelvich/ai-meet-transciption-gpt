import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

/**
 * Transcribes an audio file using OpenAI Whisper
 * @param audioPath - Path to the audio file
 * @param language - Language code (default: 'pt' for Portuguese)
 * @param responseFormat - Response format ('text' or 'srt')
 * @returns Promise<string> - The transcription text
 */
async function transcreveAudio(
  audioPath: string, 
  language: string = 'pt', 
  responseFormat: 'text' | 'srt' = 'text'
): Promise<string> {
  try {
    // Check if file exists
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    // Read the audio file
    const audioFile = fs.createReadStream(audioPath);
    
    // Create transcription
    const transcription = await client.audio.transcriptions.create({
      model: 'whisper-1',
      language: language,
      response_format: responseFormat,
      file: audioFile,
    });

    return transcription as string;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

/**
 * Main function to demonstrate usage
 */
async function main(): Promise<void> {
  try {
    console.log('Starting audio transcription...\n');

    // Example usage with text format
    console.log('Transcribing with text format:');
    const textTranscription = await transcreveAudio('./src/audio.mp3', 'pt', 'text');
    console.log('Text transcription:', textTranscription);
    console.log('\n' + '='.repeat(50) + '\n');

    // Example usage with SRT format
    console.log('Transcribing with SRT format:');
    const srtTranscription = await transcreveAudio('./src/audio.mp3', 'pt', 'srt');
    console.log('SRT transcription:', srtTranscription);

  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

// Export the function for use in other modules
export { transcreveAudio };

// Run main function if this file is executed directly
if (require.main === module) {
  main();
} 