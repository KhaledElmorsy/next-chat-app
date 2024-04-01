'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import GroupConvoSettings from './conversation-settings/GroupConvoSettings';
import DirectConvoSettings from './conversation-settings/DirectConvoSettings';
import { useConversation } from '../providers/ConversationProvider';

export default function Header() {
  const { name, image, members, isGroupChat, userId } = useConversation();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  useOnClickOutside(settingsRef, (e) => {
    setShowSettings(false);
  });

  const Editor = isGroupChat ? (
    <GroupConvoSettings />
  ) : (
    <DirectConvoSettings />
  );

  return (
    <div className="w-full h-16 relative">
      <button
        onClick={() => setShowSettings(true)}
        aria-label="Edit conversation settings"
        className="w-full h-full relative flex gap-2 px-4 py-8 items-center focus-visible:ring focus-visible:ring-green-700 bg-white outline outline-gray-200 shadow-md z-10 select-none cursor-pointer hover:bg-gray-50"
      >
        <Image
          width={36}
          height={36}
          src={image!}
          alt={`${name}'s chat picture`}
          className="rounded-full"
        />
        <div className="flex flex-col min-w-0 items-start">
          <p className="text-sm font-semibold">{name}</p>
          {isGroupChat && (
            <p className="w-full text-xs text-gray-500 overflow-ellipsis overflow-hidden whitespace-nowrap">
              {members.map((m) => m.name).join(', ')}
            </p>
          )}
        </div>
      </button>
      {showSettings && (
        <div
          className="select-auto cursor-[unsert] absolute w-11/12 max-w-96 h-[400px] left-[50%] translate-x-[-50%] top-[105%] min-h-40 bg-gray-50 rounded-md shadow-md animate-fly-top"
          ref={settingsRef}
        >
          {Editor}
        </div>
      )}
    </div>
  );
}
