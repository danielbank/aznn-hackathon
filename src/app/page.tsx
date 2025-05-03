"use client";

import { useChat } from "ai/react";
import { ChatSection } from '@llamaindex/chat-ui'

export default function Chat() {
  const handler = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onResponse: (response) => {
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    },
  });

  return (
    <div className="container mx-auto p-4">
      {handler.error && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-3 text-red-700 dark:bg-red-900/50 dark:text-red-200">
          Error: {handler.error.message}
        </div>
      )}
      <ChatSection handler={handler} />
    </div>
  );
}
