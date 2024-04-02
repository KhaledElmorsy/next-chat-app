'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IoIosMailUnread } from 'react-icons/io';
import clsx from 'clsx';
import { MappedConversationData } from '../lib/util';

function isToday(date: Date) {
  return date.toLocaleDateString() === new Date().toLocaleDateString();
}

interface ConversationListProps {
  conversations: MappedConversationData[];
}

export default function ConversationList({
  conversations,
}: ConversationListProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const pathname = usePathname();

  const conversationElements = conversations
    .filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => +b?.lastMessageDate! - +a?.lastMessageDate!)
    .map(
      ({ conversationId, name, image, lastMessage, seen, lastMessageDate }) => (
        <Link
          key={conversationId}
          href={`/chat/${conversationId}`}
          className={clsx(
            'flex gap-2 hover:bg-gray-100 w-full px-4 py-4 items-center rounded-md',
            pathname.endsWith(conversationId) && 'bg-gray-100'
          )}
        >
          <Image
            width={32}
            height={32}
            src={image}
            alt={name}
            className="rounded-full"
          />
          <div className="flex flex-col w-full overflow-hidden">
            <div className="flex justify-between items-center">
              <p className="text-sm overflow-ellipsis line-clamp-1 w-3/5">
                {name}
              </p>
              {lastMessage && (
                <p className="text-xs text-gray-400">
                  {isToday(lastMessageDate!)
                    ? lastMessageDate?.toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })
                    : lastMessageDate?.toLocaleDateString('en-gb')}
                </p>
              )}
            </div>
            {lastMessage && (
              <div className="flex justify-start items-center gap-1">
                {!seen && (
                  <p className="text-green-700">
                    <IoIosMailUnread />
                  </p>
                )}
                <p className="overflow-ellipsis text-gray-400 text-xs whitespace-nowrap overflow-hidden">
                  {lastMessage}{' '}
                </p>
              </div>
            )}
          </div>
        </Link>
      )
    );

  return (
    <div className="flex flex-col overflow-y-auto w-full h-full p-3">
      {conversationElements}
    </div>
  );
}
