import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

// Define types for better type safety
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
    delta?: {
      content?: string;
    };
  }>;
}

/**
 * Chat with OpenAI GPT model
 * @param messages - Array of chat messages
 * @param model - Model to use (default: 'gpt-3.5-turbo-1106')
 * @param temperature - Temperature for response randomness (default: 0)
 * @param stream - Whether to stream the response (default: false)
 * @returns Promise<ChatResponse> - The chat completion response
 */
async function chatOpenAI(
  messages: ChatMessage[],
  model: string = 'gpt-3.5-turbo-1106',
  temperature: number = 0,
  stream: boolean = false
): Promise<ChatResponse | AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      stream: stream,
    });
    
    return response as ChatResponse | AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
  }
}

/**
 * Main function to demonstrate usage
 */
async function main(): Promise<void> {
  try {
    console.log('Starting ChatGPT conversation demo...\n');

    // Example 1: Simple question
    console.log('=== Example 1: Simple Question ===');
    const mensagens: ChatMessage[] = [
      { role: 'user', content: 'O que é uma maçã em até 5 palavras?' }
    ];
    
    const resposta = await chatOpenAI(mensagens) as ChatResponse;
    console.log('Response:', resposta.choices[0]?.message.content);
    console.log('\n' + '='.repeat(50) + '\n');

    // Example 2: Conversation with context
    console.log('=== Example 2: Conversation with Context ===');
    
    // Add assistant's response to conversation
    mensagens.push({
      role: 'assistant',
      content: resposta.choices[0]?.message.content || ''
    });
    
    // Add follow-up question
    mensagens.push({
      role: 'user',
      content: 'E qual a sua cor?'
    });
    
    console.log('Current conversation:', mensagens);
    
    const resposta2 = await chatOpenAI(mensagens) as ChatResponse;
    console.log('Follow-up response:', resposta2.choices[0]?.message.content);
    console.log('\n' + '='.repeat(50) + '\n');

    // Example 3: Streaming response
    console.log('=== Example 3: Streaming Response ===');
    const mensagensStream: ChatMessage[] = [
      { role: 'user', content: 'O que é uma maçã em até 5 palavras?' }
    ];
    
    const respostas = await chatOpenAI(mensagensStream, 'gpt-3.5-turbo-1106', 0, true) as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
    
    console.log('Streaming response:');
    for await (const resposta of respostas) {
      const content = resposta.choices[0]?.delta?.content;
      if (content) {
        process.stdout.write(content);
      }
    }
    console.log('\n');

  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

// Export the function for use in other modules
export { chatOpenAI, ChatMessage, ChatResponse };

// Run main function if this file is executed directly
if (require.main === module) {
  main();
} 