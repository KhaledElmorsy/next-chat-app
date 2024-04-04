'use client';

import { createMessage, setMessageSeen } from '@/app/(protected)/lib/actions';
import clsx from 'clsx';
import { FormEvent, useState, useEffect, useRef } from 'react';
import { VscSend } from 'react-icons/vsc';
import { pusherClient } from '@/app/(protected)/lib/pusher/client';
import { useSendTyping } from '../hooks/typingIndicator';

interface MessageFieldProps {
  conversationId: string;
  userId: number;
  username: string;
}

export default function MessageField({
  username,
  conversationId,
  userId,
}: MessageFieldProps) {
  const [input, setInput] = useState('');
  useSendTyping({ input, name: username, conversationId, userId });

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const messageId = await createMessage({
      body: input,
      conversationId: conversationId,
      userId,
    });
    if (messageId) {
      await setMessageSeen(messageId, userId);
    }
    setInput('');
  }

  return (
    <form
      onSubmit={sendMessage}
      className="w-full flex gap-2 justify-center items-center h-full max-h-12 bg-white py-2 px-4 shadow-md ring-1 ring-gray-200"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        required
        placeholder="Type a message"
        className="p-3 h-5 text-sm bg-transparent focus-visible:outline-none w-8/12"
      />
      <button
        className={clsx(
          'duration-200 text-sm px-5 py-2 hover:bg-gray-100',
          !input && 'opacity-10 cursor-default'
        )}
      >
        <VscSend className="text-xl text-gray-600 " />
      </button>
    </form>
  );
}
