'use server';

import { nanoid } from 'nanoid';
import * as db from '@/app/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { pusherServer } from './pusher/server';

export async function createDirectConversation(userIds: number[]) {
  if (userIds.length > 2) return;
  let existingConvId: string;
  if (userIds.length === 1) {
    const conversations = await db.getSoloConversation.run(
      { userId: userIds[0] },
      db.pool
    );
    existingConvId = conversations[0]?.conversationId;
  } else {
    const conversations = await db.getDirectConversation.run(
      { userIds },
      db.pool
    );
    existingConvId = conversations[0]?.conversationId;
  }

  if (existingConvId) {
    return redirect(`/chat/${existingConvId}`);
  }

  const conversationId = nanoid();
  try {
    await db.createConversation.run(
      { conversationId, groupChat: false },
      db.pool
    );
    await Promise.all(
      userIds.map((id) =>
        db.addConversationMember.run({ conversationId, userId: id }, db.pool)
      )
    );
  } catch (err) {
    console.error("Couldn't create conversation", err);
  }
  userIds.forEach(userId => {
    pusherServer.trigger(`user-${userId}`,'conversation-mutation', {})
  })
  revalidatePath('/chat');
}

export async function createGroupConversation(userIds: number[], name: string) {
  const conversationId = nanoid();
  try {
    await db.createConversation.run(
      { conversationId, groupChat: true, name },
      db.pool
    );
    await Promise.all(
      userIds.map(async (userId) => {
        db.addConversationMember.run({ conversationId, userId }, db.pool);
      })
    );
  } catch (err) {
    console.error(err);
  }
  userIds.forEach(userId => {
    pusherServer.trigger(`user-${userId}`,'conversation-mutation', {})
  })
  revalidatePath('/chat')
}

interface MessageData {
  body: string;
  conversationId: string;
  userId: number;
}

export async function createMessage({
  body,
  conversationId,
  userId,
}: MessageData) {
  if (!body) return;
  const messageId = nanoid();
  try {
    await db.createMessage.run(
      {
        body,
        id: messageId,
        userId,
        conversationId: conversationId,
      },
      db.pool
    );
  } catch (err) {
    console.error('Could not create message', err);
  }
  pusherServer.trigger(`convo-${conversationId}`, 'new-message', {});
  return messageId;
}

export async function setMessageSeen(messageId: string, userId: number) {
  try {
    await db.setMessageSeen.run({ messageId, userId }, db.pool);
  } catch (err) {
    console.error('Cant set message as seen', err);
  }
  revalidatePath('/chat');
}

export async function revalidate() {
  revalidatePath('/chat');
}
