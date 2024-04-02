'use client';

import { deleteUser } from '../lib/actions';

interface DeleteUserButtonProps {
  userId: number;
}

export default function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  return (
    <button
      onClick={() => deleteUser(userId)}
      className="hidden group-hover:block absolute left-[105%] z-30 w-max px-3 py-2 rounded font-semibold bg-red-600 text-white text-xs before:absolute before:-left-3 before:size-6 cursor-pointer"
    >
      Delete account
    </button>
  );
}
