'use client';

import { setMessageSeen } from '@/app/(protected)/lib/actions';
import { IGetConversationMessagesResult } from '@/app/lib/db';
import clsx from 'clsx';
import { useEffect } from 'react';

interface MessageProps extends IGetConversationMessagesResult {
  currentUserId: number;
  isGroupChat: boolean;
}

export default function Message(m: MessageProps) {
  const isAuthor = m.userId === m.currentUserId;
  useEffect(() => {
    if (!m.seen) {
      setMessageSeen(m.id, m.currentUserId);
    }
  }, []);
  
  return (
    <div
      className={clsx(
        'grid grid-cols-[max-content] grid-rows-2 gap-0 text-sm px-2 py-1 rounded-md max-w-96 w-fit',
        !isAuthor && 'self-start bg-gray-100 flex-row-reverse',
        isAuthor && 'self-end  bg-green-100'
      )}
    >
      <p className="col-span-1">{m.body}</p>
      <p className="col-start-2 col-span-1 w-fit row-span-2 text-[0.6rem] leading-tight text-gray-400 self-end">
        {m.createdAt.toLocaleString('en-us', {
          hour: 'numeric',
          minute: '2-digit',
        })}
      </p>
    </div>
  );
}
