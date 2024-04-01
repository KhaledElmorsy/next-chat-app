'use client';

import { useContext, createContext, PropsWithChildren } from 'react';
import type { IGetConversationMembersResult as ConversationMember } from '@/app/lib/db';

interface ConversaionContext {
  name: string;
  image: string;
  conversationId: string;
  isGroupChat: boolean;
  members: ConversationMember[];
  userId: number;
}

const ConversationContext = createContext<ConversaionContext | null>(null);

interface ConversationProviderProps extends ConversaionContext {
  children: React.ReactNode;
}

export default function ConversationProvider({
  children,
  ...context
}: ConversationProviderProps) {
  return (
    <ConversationContext.Provider value={{ ...context }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('Conversation context used outside provider');
  }
  return context;
}
