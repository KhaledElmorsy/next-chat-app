import {
  getConversationMembers,
  getLastConversationMessages,
  getUserConversations,
  pool,
} from '@/app/lib/db';
import type { Session } from 'next-auth';

export interface MappedConversationData {
  conversationId: string;
  name: string;
  image: string;
  lastMessage?: string;
  seen?: boolean;
  lastMessageDate?: Date;
}

export async function getMappedConversationData(
  user: Session['user']
): Promise<MappedConversationData[]> {
  const { id: userId } = user;
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
        image = user.image!;
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
  return mappedConversations;
}
