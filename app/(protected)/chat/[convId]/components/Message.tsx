'use client';

import { setMessageSeen } from '@/app/(protected)/lib/actions';
import { IGetConversationMessagesResult } from '@/app/lib/db';
import clsx from 'clsx';
import Image from 'next/image';
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

  const isGroupMember = m.isGroupChat && !isAuthor;

  return (
    <div className={clsx('flex gap-2 items-center', isAuthor && 'self-end')}>
      {isGroupMember ? (
        <Image
          src={m.image!}
          alt={`${m.name}'s picture`}
          width={28}
          height={28}
          className="rounded-full"
        />
      ) : null}
      <div
        className={clsx(
          'flex flex-col gap-0 text-sm px-2 py-1 rounded-md max-w-96 w-fit',
          !isAuthor && 'bg-gray-100 flex-row-reverse',
          isAuthor && 'bg-green-100'
        )}
      >
        {m.isGroupChat && !isAuthor ? (
          <p className="text-xs font-bold">{m.name}</p>
        ) : null}
        <p className="col-span-1">{m.body}</p>
        <p className="ml-[50%] w-max min-w-16 whitespace-nowrap text-[0.6rem] text-right leading-tight text-gray-400 self-end">
          {m.createdAt.toLocaleString('en-us', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
