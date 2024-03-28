import { UserSearchSchema } from '@/app/lib/validation/user';
import Image from 'next/image';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { createDirectConversation } from '../lib/actions';

interface UserListProps {
  users: z.infer<typeof UserSearchSchema>[];
  onPick?: (userId?: number) => void;
}

export default function UserList({ users, onPick }: UserListProps) {
  const session = useSession();
  function handleCreate(userId: number) {
    return async function () {
      if (session.status !== 'authenticated') return;
      const currentUserId = session.data.user.id;
      const userIds =
        currentUserId === userId ? [userId] : [userId, currentUserId];
      await createDirectConversation(userIds);
      onPick && onPick(userId);
    };
  }

  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <button
          onClick={handleCreate(user.userId)}
          key={user.userId}
          className="flex gap-3 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer"
        >
          <Image
            className="rounded-full"
            width={30}
            height={30}
            src={user.image}
            alt={`${user.name}'s picture`}
          />
          <p className="text-sm">
            {user.name}
            {session.data?.user.id === user.userId && (
              <span className="font-semibold"> (me)</span>
            )}
          </p>
        </button>
      ))}
    </div>
  );
}
