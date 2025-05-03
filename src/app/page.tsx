"use client";

import { useChat, Message } from "ai/react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, error, isLoading } = useChat({
    api: "/api/chat",
    streamProtocol: 'text',
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-3 text-red-700 dark:bg-red-900/50 dark:text-red-200">
          Error: {error.message}
        </div>
      )}
      <div className="flex flex-col space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <p className="font-semibold">{message.role === 'user' ? 'You' : 'Assistant'}</p>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
