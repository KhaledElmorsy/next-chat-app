import Image from 'next/image';
import Input from '@/app/(protected)/components/Input';
import { LuPencil } from 'react-icons/lu';
import { useState, FormEvent } from 'react';
import {
  changeConversationName,
  deleteConversation,
  removeUserFromConvo,
} from '@/app/(protected)/lib/actions';
import { useRouter } from 'next/navigation';
import { useConversation } from '../../../providers/ConversationProvider';
import LightButton from '@/app/(protected)/components/LightButton';

export default function Overview() {
  const { image, name, conversationId, userId } = useConversation();
  const [editName, setEditName] = useState(false);
  const [editNameVal, setEditNameVal] = useState(name);

  const router = useRouter();

  async function handleChangeConvoName(e: FormEvent) {
    e.preventDefault();
    await changeConversationName(conversationId, editNameVal);
    setEditName(false);
  }

  async function handleRemoveUser() {
    await removeUserFromConvo(conversationId, userId);
    router.replace('/chat');
  }

  async function handleDeleteConversation() {
    router.replace('/chat');
    await deleteConversation(conversationId);
  }

  return (
    <div className="flex flex-col items-start gap-3 p-6 h-full">
      <Image
        src={image}
        width={60}
        height={60}
        alt={`${name}'s profile picture`}
        className="rounded-full"
      />
      {editName ? (
        <form className="flex flex-col gap-1" onSubmit={handleChangeConvoName}>
          <Input
            maxLength={100}
            value={editNameVal}
            onChange={(e) => setEditNameVal(e.target.value)}
            required
          />
          <button className="text-xs self-end w-1/2 bg-green-700 text-white px-4 py-1 rounded-md">
            {editNameVal.length}/100
          </button>
        </form>
      ) : (
        <div className="w-full flex justify-between">
          <p className="text-xl font-semibold">{name}</p>
          <button
            onClick={() => setEditName(true)}
            className="size-8 flex justify-center items-center hover:bg-gray-100 rounded-md"
          >
            <LuPencil className="opacity-70 text-xs" />
          </button>
        </div>
      )}
      <div className="mt-auto flex justify-evenly gap-2 text-xs w-full">
        <LightButton onClick={handleRemoveUser} className="w-1/2">
          Exit group
        </LightButton>
        <LightButton
          onClick={handleDeleteConversation}
          className="text-red-800 w-1/2"
        >
          Delete group
        </LightButton>
      </div>
    </div>
  );
}
