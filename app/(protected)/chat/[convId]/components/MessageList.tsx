'use client';

import { IGetConversationMessagesResult } from '@/app/lib/db';
import Message from './Message';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: IGetConversationMessagesResult[];
  currentUserId: number;
  isGroupChat: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  isGroupChat,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-2 w-full px-6 py-2 overflow-x-auto flex-grow"
    >
      {messages
        .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1))
        .map((m) => (
          <Message
            key={m.id}
            {...m}
            currentUserId={currentUserId}
            isGroupChat={isGroupChat}
          />
        ))}
    </div>
  );
}
