'use client';
import { useState, useEffect, useRef } from 'react';
import { LuPenSquare } from 'react-icons/lu';
import { RiGroupLine } from 'react-icons/ri';
import UserList from './UserList';
import { useOnClickOutside } from 'usehooks-ts';
import { ISearchUserResult } from '@/app/lib/db/';
import Input from './Input';
import NewGroup from './NewGroup';

export default function NewConvo() {
  const [showDialog, setShowDialog] = useState(false);
  const [users, setUsers] = useState<ISearchUserResult[]>([]);
  const [search, setSearch] = useState('');
  const [showGroupCreator, setShowGroupCreator] = useState(false);
  const dialogContainer = useRef(null);

  useEffect(() => {
    if (!showDialog) return;
    fetch(`/api/users?query=${search}`)
      .then((res) => res.json())
      .then((body) => setUsers(body))
      .catch(console.error);
  }, [search, showDialog]);

  useOnClickOutside(dialogContainer, () => {
    setShowDialog(false);
    setShowGroupCreator(false);
  });

  function groupCreated() {
    setShowDialog(false);
    setShowGroupCreator(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDialog(true)}
        className="grid place-items-center w-16 h-10 hover:bg-gray-100 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        <LuPenSquare title="Start conversation" />
      </button>
      {showDialog && (
        <div
          ref={dialogContainer}
          className="flex flex-col p-6 gap-3 absolute top-[100%] right-0 overflow-y-auto animate-fly-top w-64 h-96 bg-gray-50 backdrop:blur rounded-md shadow-md"
        >
          <h1 className="text-xl font-semibold">New Chat</h1>
          <Input
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowGroupCreator(true)}
            className="flex gap-3 items-center px-2 py-3 rounded-md hover:bg-gray-200 "
          >
            <div className="size-8 rounded-full shadow-md bg-white flex items-center justify-center">
              <RiGroupLine className="bg-white text-gray-700 rounded-full shadow-sm" />
            </div>
            New Group
          </button>
          <UserList users={users} onPick={() => setShowDialog(false)} />
          {showGroupCreator ? (
            <NewGroup
              onBack={() => setShowGroupCreator(false)}
              onGroupCreated={groupCreated}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
