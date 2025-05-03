import { env } from "@/lib/env";

const {
  DUNGEON_MASTER_ML_ENDPOINT,
  DUNGEON_MASTER_ML_ENDPOINT_API_KEY,
} = env;

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log('Starting POST request handling');
    const body = await req.json();
    console.log('Received request body:', body);
    
    // Handle different message formats
    const message = body.message || body.messages?.[0]?.content || body.content;
    const threadId = body.threadId;
    
    if (!message) {
      throw new Error('No message content provided');
    }
    
    console.log('Sending to ML endpoint:', DUNGEON_MASTER_ML_ENDPOINT);
    console.log('Request payload:', {
      chat_history: [],
      question: message,
      thread_id: threadId,
    });

    // Send request to ML endpoint
    console.log('Initiating fetch to ML endpoint...');
    const response = await fetch(DUNGEON_MASTER_ML_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DUNGEON_MASTER_ML_ENDPOINT_API_KEY}`,
      },
      body: JSON.stringify({
        chat_history: [],
        question: message,
        thread_id: threadId,
      })
    });
    console.log('Received response from ML endpoint, status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ML endpoint error response:', errorText);
      throw new Error(`ML endpoint error! status: ${response.status}, details: ${errorText}`);
    }

    // Get the JSON response
    console.log('Parsing JSON response...');
    const jsonResponse = await response.json();
    console.log('Parsed JSON response:', jsonResponse);
    
    // Validate response structure
    if (!jsonResponse || typeof jsonResponse.answer !== 'string') {
      throw new Error('Invalid response format from ML endpoint');
    }

    // Create a stream from the response text
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        // Send just the text content without any JSON formatting
        controller.enqueue(encoder.encode(jsonResponse.answer));
        controller.close();
      },
    });

    // Return a plain text response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
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