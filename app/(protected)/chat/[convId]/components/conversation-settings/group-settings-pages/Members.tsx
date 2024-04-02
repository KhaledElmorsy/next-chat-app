import { useConversation } from '../../../providers/ConversationProvider';
import { IoCloseOutline } from 'react-icons/io5';
import { removeUserFromConvo } from '@/app/(protected)/lib/actions';
import Image from 'next/image';
import Input from '@/app/(protected)/components/Input';
import { useState } from 'react';

export default function Members() {
  const { members, conversationId, userId } = useConversation();

  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col p-6 gap-5">
      <h2 className="text-xl font-semibold">Members</h2>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search group members"
      />
      <div className="flex flex-col gap-3">
        {members
          .filter((m) => m.name?.includes(search) || m.email?.includes(search))
          .map((m) => (
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
