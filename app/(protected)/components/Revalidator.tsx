'use client';

import { useEffect } from 'react';
import { revalidate } from '../lib/actions';
import { pusherClient } from '../lib/pusher/client';

interface RevalidatorProps {
  conversationIds: string[];
}

export default function Revalidator({ conversationIds }: RevalidatorProps) {
  useEffect(() => {
    const channels = conversationIds.map((convId) => {
      const channel = pusherClient.subscribe(convId);
      channel.bind('new-message', revalidate);
      return channel;
    });
    return () => {
      channels.forEach(channel => {
        channel.unbind_all();
      })
    }
  }, [conversationIds]);
  return null;
}
