import { useEffect, useState, useRef } from 'react';
import { pusherClient } from '@/app/(protected)/lib/pusher/client';

export function useReceiveTyping(conversationId: string, userId: number) {
  const [typingUsers, setTypingUsers] = useState<
    Array<{ userId: number; name: string }>
  >([]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`private-${conversationId}`);
    channel.bind(
      'client-typing-started',
      (typer: { userId: number; name: string }) => {
        setTypingUsers((prev) => {
          if (typer.userId === userId) return prev;
          return prev.find((u) => u.userId === typer.userId)
            ? prev
            : [...prev, typer];
        });
      }
    );

    channel.bind(
      'client-typing-stopped',
      (typer: { userId: number; name: string }) => {
        setTypingUsers((prev) => {
          if (typer.userId === userId) return prev;
          const typerIndex = prev.findIndex((u) => u.userId === typer.userId);
          if (typerIndex === -1) return prev;
          const newList = prev.slice();
          newList.splice(typerIndex, 1);
          return newList;
        });
      }
    );
    return () => {
      channel.unbind_all().unsubscribe();
    };
  }, []);

  return typingUsers;
}

export function useSendTyping({
  /** State to track. Normally an input field value. */
  input,
  conversationId,
  name,
  userId,
}: {
  input: string;
  conversationId: string;
  name: string;
  userId: number;
}) {
  const channel = useRef(pusherClient.subscribe(`private-${conversationId}`));
  const debouncingRef = useRef<number | null>(0);

  useEffect(() => {
    function refreshTimeout() {
      clearTimeout(debouncingRef.current!);
      debouncingRef.current = setTimeout(() => {
        channel.current.trigger('client-typing-stopped', {
          userId,
          name,
        });
        debouncingRef.current = null;
      }, 1000) as unknown as number;
    }

    if (debouncingRef.current || input === '') {
      refreshTimeout();
      return;
    }

    channel.current.trigger('client-typing-started', {
      userId,
      name,
    });

    refreshTimeout();
  }, [input]);

  useEffect(() => {
    return () => {
      channel.current.unbind_all().unsubscribe();
    };
  }, []);
}
