'use client';

import { useState, FormEvent } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import Input from './Input';
import { z } from 'zod';
import MultiUserPicker from './MultiUserPicker';
import { MultiUserPickerProvider } from './MultiUserPicker';
import { UserSearchSchema } from '@/app/lib/validation/user';
import { createGroupConversation, searchUsers } from '../lib/actions';
import { useSession } from 'next-auth/react';

type UserSearch = z.infer<typeof UserSearchSchema>;

interface NewGroupProps {
  onBack: () => void;
  onGroupCreated: () => void;
}

export default function NewGroup({ onBack, onGroupCreated }: NewGroupProps) {
  const [pickedIds, setPickedIds] = useState<number[]>([]);
  const [groupName, setGroupName] = useState('');
  const session = useSession();
  const userId = session.data?.user.id;

  async function handleCreateGroup(e: FormEvent) {
    e.preventDefault();
    await createGroupConversation([...pickedIds, userId!], groupName);
    onGroupCreated();
  }

  return (
    <div className="flex flex-col gap-2 p-4 w-full h-full absolute top-0 left-0 bg-gray-50">
      <div className="flex gap-2 items-center">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-200 rounded-md flex justify-center items-center"
        >
          <IoMdArrowBack title="back" />
        </button>
        <p className="text-xl font-semibold">New Group</p>
      </div>

      <MultiUserPickerProvider
        pickedIds={pickedIds}
        setPickedIds={setPickedIds}
        exclude={[userId!]}
      >
        <MultiUserPicker
          sandwichedElement={
            !pickedIds.length ? null : (
              <form
                className="flex flex-col gap-1"
                onSubmit={handleCreateGroup}
              >
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name"
                  required
                />
                <button
                  disabled={!groupName}
                  className="p-1 w-full rounded-md flex justify-center items-center bg-green-700 text-white text-xs disabled:bg-gray-300"
                >
                  Create group
                </button>
              </form>
            )
          }
        />
      </MultiUserPickerProvider>
    </div>
  );
}
