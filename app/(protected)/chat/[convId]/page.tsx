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

export default async function Page({
  params: { convId },
}: {
  params: { convId: string };
}) {
  const session = await auth();
  const userId = session?.user.id;
  const [{ groupChat: isGroupChat, name: convName }] =
    await getCovnersationData.run({ conversationId: convId }, pool);
  const convMembers = await getConversationMembers.run(
    { conversationId: convId },
    pool
  );

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
    <div className="w-full flex flex-col overflow-hidden">
      <div className="flex gap-2 h-10 px-4 py-8 items-center bg-white outline outline-gray-200 shadow-md z-10 select-none cursor-pointer hover:bg-gray-50">
        <Image
          width={36}
          height={36}
          src={image!}
          alt={`${name}'s chat picture`}
          className="rounded-full"
        />
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-semibold">{name}</p>
          {isGroupChat && (
            <p className="w-full text-xs text-gray-500 overflow-ellipsis overflow-hidden whitespace-nowrap">
              {convMembers.map((m) => m.name).join(', ')}
            </p>
          )}
        </div>
      </div>
      <MessageList
        messages={messages}
        isGroupChat={isGroupChat!}
        currentUserId={userId!}
      />
      <MessageField conversationId={convId} userId={userId!} />
    </div>
  );
}
