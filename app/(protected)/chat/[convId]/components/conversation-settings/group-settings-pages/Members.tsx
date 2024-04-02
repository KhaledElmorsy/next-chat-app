import { useConversation } from '../../../providers/ConversationProvider';
import { IoCloseOutline } from 'react-icons/io5';
import {
  removeUserFromConvo,
  addUsersToConversation,
} from '@/app/(protected)/lib/actions';
import Image from 'next/image';
import Input from '@/app/(protected)/components/Input';
import { useState } from 'react';
import MultiUserPicker, {
  MultiUserPickerProvider,
} from '@/app/(protected)/components/MultiUserPicker';
import LightButton from '@/app/(protected)/components/LightButton';
import clsx from 'clsx';

export default function Members() {
  const { members, conversationId, userId } = useConversation();

  const [showPicker, setShowPicker] = useState(false);
  const [pickedIds, setPickedIds] = useState<number[]>([]);
  const excludedIds = members.map((m) => m.userId);

  const [search, setSearch] = useState('');

  function cancelPicker() {
    setShowPicker(false);
    setPickedIds([]);
  }

  async function handleAddUsers() {
    await addUsersToConversation(conversationId, pickedIds);
    setShowPicker(false);
    setPickedIds([]);
  }

  return (
    <div className="flex flex-col p-6 gap-5 h-full">
      <h2 className="text-xl font-semibold">Members</h2>
      {showPicker ? (
        <MultiUserPickerProvider
          exclude={excludedIds}
          pickedIds={pickedIds}
          setPickedIds={setPickedIds}
        >
          <MultiUserPicker />
        </MultiUserPickerProvider>
      ) : (
        <>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search group members"
          />
          <div className="flex flex-col gap-3">
            {members
              .filter(
                (m) => m.name?.includes(search) || m.email?.includes(search)
              )
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
                    onClick={() =>
                      removeUserFromConvo(conversationId, m.userId)
                    }
                    className="hidden group-hover:block ml-auto text-red-500 cursor-pointer rounded"
                  />
                </div>
              ))}
          </div>
        </>
      )}
      <div className="-mb-2 w-full flex flex-col items-center gap-3 mt-auto">
        <hr className="w-full" />
        {!showPicker ? (
          <LightButton onClick={() => setShowPicker(true)}>
            Add members
          </LightButton>
        ) : (
          <div className="flex justify-evenly w-full">
            <LightButton
              onClick={handleAddUsers}
              className={clsx(
                'bg-green-700 text-white',
                !pickedIds.length && 'bg-gray-300'
              )}
              disabled={!pickedIds.length}
            >
              Add
            </LightButton>
            <LightButton onClick={cancelPicker}>Cancel</LightButton>
          </div>
        )}
      </div>
    </div>
  );
}
