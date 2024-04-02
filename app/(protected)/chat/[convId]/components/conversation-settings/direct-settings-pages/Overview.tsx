import Image from 'next/image';
import { useConversation } from '../../../providers/ConversationProvider';
import LightButton from '@/app/(protected)/components/LightButton';
import { deleteConversation } from '@/app/(protected)/lib/actions';

export default function Overview() {
  const { name, conversationId, image, members, userId } = useConversation();

  const email =
    members.length === 2
      ? members.find((m) => m.userId !== userId)?.email
      : members.find((m) => m.userId === userId)?.email;

  return (
    <div className="flex flex-col p-6 gap-3 h-full">
      <Image
        src={image}
        alt={`${name}'s image`}
        width={60}
        height={60}
        className="rounded-full"
      />
      <div className="flex flex-col gap-1">
        <p className="text-xl font-semibold">{name}</p>
        <p className="text-gray-400 text-xs whitespace-nowrap text-ellipsis overflow-hidden">
          {email}
        </p>
      </div>
      <div className="mt-auto -mb-6 h-16 flex flex-col justify-evenly items-center">
        <hr className="w-full" />
        <LightButton
          className="text-red-700 w-5/6"
          onClick={() => deleteConversation(conversationId)}
        >
          Delete Conversation
        </LightButton>
      </div>
    </div>
  );
}
