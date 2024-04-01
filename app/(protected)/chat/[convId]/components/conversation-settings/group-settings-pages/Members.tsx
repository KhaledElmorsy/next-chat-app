import { useConversation } from '../../../providers/ConversationProvider';
import { IoCloseOutline } from 'react-icons/io5';
import { removeUserFromConvo } from '@/app/(protected)/lib/actions';
import Image from 'next/image';

export default function Members() {
  const { members, conversationId, userId } = useConversation();

  return (
    <div className="flex flex-col p-6 gap-3">
      <h2 className="text-xl font-semibold">Members</h2>
      <div className="flex flex-col gap-3">
        {members.map((m) => (
          <div key={m.userId} className="flex items-center gap-1 group">
            <Image
              src={m.image!}
              alt={`${m.name}'s picture`}
              width={30}
              height={30}
              className="rounded-full"
            />
            <p>{m.name}</p>
            <IoCloseOutline
              onClick={() => removeUserFromConvo(conversationId, m.userId)}
              className="hidden group-hover:block ml-auto text-red-500 cursor-pointer rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
