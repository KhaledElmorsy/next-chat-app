'use client';

import { useEffect } from 'react';
import { revalidate } from '../lib/actions';
import { pusherClient } from '../lib/pusher/client';

interface RevalidatorProps {
  conversationIds: string[];
  userId: number;
}

export default function Revalidator({ conversationIds, userId }: RevalidatorProps) {
  useEffect(() => {
    const channels = conversationIds.map((convId) => {
      const channel = pusherClient.subscribe(`convo-${convId}`);
      channel.bind('new-message', revalidate);
      return channel;
    });
    const userChannel = pusherClient.subscribe(`user-${userId}`);
    userChannel.bind('conversation-mutation', revalidate);
    return () => {
      channels.forEach(channel => {
        channel.unbind_all();
      })
      userChannel.unbind_all();
    }
  }, [conversationIds, userId]);
  return null;
}
