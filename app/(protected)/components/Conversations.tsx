import {
  getConversationMembers,
  getLastConversationMessages,
  getUserConversations,
  pool,
} from '@/app/lib/db';
import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosMailUnread } from 'react-icons/io';
import Input from './Input';
import ConversationSearch from './ConversationSearch';
import ConversationList from './ConversationList';

export default async function Conversations() {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id;
  const conversations = await getUserConversations.run({ userId }, pool);
  const lastConversationMessages = await getLastConversationMessages.run(
    { userId },
    pool
  );

  const mappedConversations = await Promise.all(
    conversations.map(async (conv) => {
      const members = await getConversationMembers.run(
        { conversationId: conv.conversationId },
        pool
      );
      const lastMessage = lastConversationMessages.find(
        (c) => c.conversationId === conv.conversationId
      );
      let name: string;
      let image: string;
      if (conv.groupChat && conv.name) {
        name = conv.name;
        image = session?.user.image!;
      } else {
        const otherParty = members.find((m) => m.userId !== userId);
        name = otherParty?.name! ?? `${user?.name} (You)`;
        image = otherParty?.image! ?? user?.image;
      }
      return {
        name,
        image,
        lastMessage: lastMessage?.body,
        seen: lastMessage?.seen as boolean | undefined,
        lastMessageDate: lastMessage?.createdat,
        conversationId: conv.conversationId,
      };
    })
  );

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-3 h-full items-start overflow-y-auto">
        <div className="p-2 w-full">
          <ConversationSearch />
        </div>
        <ConversationList conversations={mappedConversations} />
      </div>
    </div>
  );
}
