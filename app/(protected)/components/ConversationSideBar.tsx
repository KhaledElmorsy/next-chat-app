'use client';

import ConversationList from './ConversationList';
import ConversationSearch from './ConversationSearch';
import NewConvo from './NewConvo';
import { useMediaQuery } from 'usehooks-ts';
import { usePathname } from 'next/navigation';
import type { MappedConversationData } from '../lib/util';

interface ConversationSideBarProps {
  conversations: MappedConversationData[];
}

export default function ConversationSideBar({
  conversations,
}: ConversationSideBarProps) {
  const path = usePathname();
  const isSmallScreen = useMediaQuery('(max-width: 639px)');
  return path !== '/chat' && isSmallScreen ? null : (
    <div className="flex flex-col w-full h-full bg-white ring-1 ring-gray-200 rounded-md sm:w-80 sm:flex-shrink-0 z-20">
      <div className="px-4 py-4 flex justify-between items-center ">
        <h1 className="text-2xl font-semibold">Chats</h1>
        <NewConvo />
      </div>
      <div className="flex flex-col gap-1 overflow-y-auto">
        <div className="flex flex-col gap-1 h-full items-start ">
          <div className="p-4 w-full">
            <ConversationSearch />
          </div>
          <ConversationList conversations={conversations} />
        </div>
      </div>
    </div>
  );
}
