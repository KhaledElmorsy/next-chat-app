import {
  getConversationMembers,
  getConversationMessages,
  getCovnersationData,
  pool,
} from '@/app/lib/db';
import { auth } from '@/auth';
import MessageField from './components/MessageField';
import Image from 'next/image';
import MessageList from './components/MessageList';
import Header from './components/Header';
import ConversationProvider from './providers/ConversationProvider';
import { redirect } from 'next/navigation';

export default async function Page({
  params: { convId },
}: {
  params: { convId: string };
}) {
  const session = await auth();
  const userId = session?.user.id;
  const convData = await getCovnersationData.run(
    { conversationId: convId },
    pool
  );

  if (!convData.length) {
    redirect('/chat');
  }

  const [{ groupChat: isGroupChat, name: convName }] = convData;

  const convMembers = await getConversationMembers.run(
    { conversationId: convId },
    pool
  );

  if (!convMembers.find((m) => m.userId === userId)) {
    redirect('/chat');
  }

  const { name, image } = (() => {
    if (isGroupChat) return { name: convName, image: session?.user.image };
    if (convMembers.length === 1)
      return {
        name: `${session?.user.name} (You)`,
        image: session?.user.image,
      };
    const otherUser = convMembers.find((u) => u.userId !== userId);
    return { name: otherUser?.name, image: otherUser?.image };
  })();
  const messages = await getConversationMessages.run(
    {
      conversationId: convId,
      userId,
    },
    pool
  );

  return (
    <ConversationProvider
      {...{
        image: image!,
        members: convMembers,
        name: name!,
        userId: userId!,
        isGroupChat: isGroupChat!,
        conversationId: convId,
      }}
    >
      <div className="w-full flex flex-col overflow-hidden relative">
        <Header />
        <MessageList
          messages={messages}
          isGroupChat={isGroupChat!}
          currentUserId={userId!}
        />
        <MessageField conversationId={convId} userId={userId!} />
      </div>
    </ConversationProvider>
  );
}
