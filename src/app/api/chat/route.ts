import { env } from "@/lib/env";

const {
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_INSTANCE_NAME,
  ASSISTANT_ID,
  ML_ENDPOINT,
  ML_ENDPOINT_API_KEY,
} = env;

const API_VERSION = "2024-05-01-preview";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);
    
    // Handle different message formats
    const message = body.message || body.messages?.[0]?.content || body.content;
    const threadId = body.threadId;
    
    if (!message) {
      throw new Error('No message content provided');
    }
    
    console.log('Sending to ML endpoint:', ML_ENDPOINT);

    // Send request to ML endpoint
    const response = await fetch(ML_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ML_ENDPOINT_API_KEY}`,
      },
      body: JSON.stringify({
        chat_history: [],
        question: message,
        thread_id: threadId,
        assistant_id: ASSISTANT_ID
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ML endpoint error! status: ${response.status}, details: ${errorText}`);
    }

    // Create a TransformStream to handle the response
    const { readable, writable } = new TransformStream();
    
    // Pipe the response through the transform stream
    response.body?.pipeTo(writable);

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error: unknown) {
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