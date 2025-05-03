import { createAzure } from '@ai-sdk/azure';
import { convertToCoreMessages, streamText } from "ai";
import { env } from "@/lib/env";

const {
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_INSTANCE_NAME,
  AZURE_OPENAI_DEPLOYMENT_NAME,
} = env;

// Log configuration (remove in production)
console.log('Azure Configuration:', {
  instanceName: AZURE_OPENAI_API_INSTANCE_NAME,
  deploymentName: AZURE_OPENAI_DEPLOYMENT_NAME,
  hasApiKey: !!AZURE_OPENAI_API_KEY,
});

// Initialize Azure OpenAI Service Provider Instance
const azure = createAzure({
  resourceName: AZURE_OPENAI_API_INSTANCE_NAME,
  apiKey: AZURE_OPENAI_API_KEY,
  apiVersion: "2024-04-01-preview" 
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    console.log('Received messages:', messages);
    
    const result = await streamText({
      model: azure(AZURE_OPENAI_DEPLOYMENT_NAME),
      messages: convertToCoreMessages(messages),
      system: `You are a duck, you can only quack at the user`,
      temperature: 0.7,
      maxTokens: 500,
    });

    console.log('Stream created successfully');

    const response = result.toDataStreamResponse();
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Ensure proper CORS headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error: unknown) {
    // Enhanced error logging
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred. Please try again later.",
        details: error instanceof Error ? error.message : String(error)
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}