'use client';

import { useState, useEffect, FormEvent } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import Input from './Input';
import Image from 'next/image';
import { z } from 'zod';
import { UserSearchSchema } from '@/app/lib/validation/user';
import { createGroupConversation } from '../lib/actions';
import { useSession } from 'next-auth/react';

type UserSearch = z.infer<typeof UserSearchSchema>;

interface NewGroupProps {
  onBack: () => void;
  onGroupCreated: () => void;
}

export default function NewGroup({ onBack, onGroupCreated }: NewGroupProps) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserSearch[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserSearch[]>([]);
  const [groupName, setGroupName] = useState('');
  const session = useSession();
  const userId = session.data?.user.id;

  useEffect(() => {
    fetch(`/api/users?query=${search}`)
      .then((res) => res.json())
      .then((body) => setUsers(body))
      .catch(console.error);
  }, [search]);

  async function handleCreateGroup(e:FormEvent) {
    e.preventDefault();
    const selectedIds = selectedUsers.map((u) => u.userId);
    await createGroupConversation([...selectedIds, userId!], groupName);
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
      <Input
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      {!selectedUsers.length ? null : (
        <form className="flex flex-col gap-1" onSubmit={handleCreateGroup}>
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
      )}
      <div className="flex flex-col overflow-y-auto">
        {users
          .filter((u) => u.userId !== userId)
          .sort((a, b) => {
            const aSelected = selectedUsers.find(
              (su) => su.userId === a.userId
            );
            const bSelected = selectedUsers.find(
              (su) => su.userId === b.userId
            );
            if (aSelected) {
              return bSelected ? 0 : -1;
            } else {
              return bSelected ? 1 : 0;
            }
          })
          .map((u) => (
            <button
              className="w-full flex justify-between items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-md"
              key={u.userId}
              onClick={() =>
                setSelectedUsers((p) => {
                  const picked = p.find((su) => su.userId === u.userId);
                  return picked
                    ? p.filter((su) => su.userId !== u.userId)
                    : [...p, u];
                })
              }
            >
              <div className="flex items-center gap-2">
                <Image
                  alt={`${u.name}'s picture`}
                  src={u.image}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <p className="overflow-ellipsis">{u.name}</p>
              </div>
              <input
                type="checkbox"
                checked={!!selectedUsers.find((su) => su.userId === u.userId)}
              />
            </button>
          ))}
      </div>
    </div>
  );
}
