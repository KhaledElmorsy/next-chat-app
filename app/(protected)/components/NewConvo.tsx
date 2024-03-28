'use client';
import { useState, useEffect, useRef } from 'react';
import { LuPenSquare } from 'react-icons/lu';
import UserList from './UserList';
import { useOnClickOutside } from 'usehooks-ts';
import { ISearchUserResult } from '@/app/lib/db/';

export default function NewConvo() {
  const [showDialog, setShowDialogue] = useState(false);
  const [users, setUsers] = useState<ISearchUserResult[]>([]);
  const [search, setSearch] = useState('');
  const dialogContainer = useRef(null);

  useEffect(() => {
    if(!showDialog) return;
    fetch(`/api/users?query=${search}`)
      .then((res) => res.json())
      .then((body) => setUsers(body))
      .catch(console.error);
  }, [search, showDialog]);

  useOnClickOutside(dialogContainer, () => {
    setShowDialogue(false);
  });

  return (
    <div className="relative">
      <button
        onClick={() => setShowDialogue(true)}
        className="grid place-items-center w-16 h-10 hover:bg-gray-100 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        <LuPenSquare title="Start conversation" />
      </button>
      {showDialog && (
        <div
          ref={dialogContainer}
          className="flex flex-col p-6 gap-3 absolute top-[100%] right-0 overflow-y-auto animate-fly-top w-72 h-96 bg-gray-50 backdrop:blur rounded-md shadow-md"
        >
          <h1 className="text-xl font-semibold">New Chat</h1>
          <input
            placeholder="Search name or email"
            className="text-xs px-4 py-1.5 focus-visible:outline-none shadow-md focus-visible:border-b-2 focus-visible:border-green-700 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <UserList users={users} onPick={() => setShowDialogue(false)}/>
        </div>
      )}
    </div>
  );
}
