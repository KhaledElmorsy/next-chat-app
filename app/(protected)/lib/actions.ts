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
  userIds.forEach((userId) => {
    pusherServer.trigger(`user-${userId}`, 'conversation-mutation', {});
  });
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
  userIds.forEach((userId) => {
    pusherServer.trigger(`user-${userId}`, 'conversation-mutation', {});
  });
  revalidatePath('/chat');
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

export async function changeConversationName(id: string, name: string) {
  try {
    await db.changeConversationName.run({ conversationId: id, name }, db.pool);
  } catch (err) {
    console.error("Couldn't change conversationName", err);
  }
  pusherServer.trigger(`convo-${id}`, 'new-message', {});
  revalidatePath('/chat');
}

export async function searchUsers(term: string) {
  let users;
  try {
    users = await db.searchUser.run({ term }, db.pool);
  } catch (err) {
    console.error("Couldn't search for users", err);
  }
  return users ?? [];
}

export async function setMessageSeen(messageId: string, userId: number) {
  try {
    await db.setMessageSeen.run({ messageId, userId }, db.pool);
  } catch (err) {
    console.error('Cant set message as seen', err);
  }
  revalidatePath('/chat');
}

export async function removeUserFromConvo(
  conversationId: string,
  userId: number
) {
  try {
    const members = await db.getConversationMembers.run(
      { conversationId },
      db.pool
    );
    await db.removeConversationMember.run({ conversationId, userId }, db.pool);
    members.forEach((m) =>
      pusherServer.trigger(`user-${m.userId}`, 'conversation-mutation', {})
    );
    if (members.length === 1) {
      db.deleteConversation.run({ conversationId }, db.pool);
    }
  } catch (err) {
    console.error("Couldn't remove conversation member", err);
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    const members = await db.getConversationMembers.run(
      { conversationId },
      db.pool
    );
    await db.deleteConversation.run({ conversationId }, db.pool);
    members.forEach((m) =>
      pusherServer.trigger(`user-${m.userId}`, 'conversation-mutation', {})
    );
  } catch (err) {
    console.error("Couldn't delete the conversation", err);
  }
}

export async function addUsersToConversation(
  conversationId: string,
  userIds: number[]
) {
  const [{ groupChat: isGroupChat }] = await db.getCovnersationData.run(
    { conversationId },
    db.pool
  );
  if (!isGroupChat) {
    console.error(
      'Attempting to add member to a direct conversation',
      `ConvoId: ${conversationId}`
    );
  }
  const members = await db.getConversationMembers.run(
    { conversationId },
    db.pool
  );
  try {
    await Promise.all(
      userIds.map((userId) =>
        db.addConversationMember.run({ conversationId, userId }, db.pool)
      )
    );
  } catch (err) {
    console.log("Couldn't add users to conversation", err);
  }
  const originalMemberIds = members.map((m) => m.userId);
  await Promise.all(
    [...originalMemberIds, userIds].map((id) =>
      pusherServer.trigger(`user-${id}`, 'conversation-mutation', {})
    )
  );
}

export async function deleteUser(userId: number) {
  const conversations = await db.getUserConversations.run({ userId }, db.pool);
  const directConversations = conversations.filter((c) => !c.groupChat);

  try {
    await db.deleteUser.run({ userId }, db.pool);
    await Promise.all(
      directConversations.map((c) =>
        db.deleteConversation.run({ conversationId: c.conversationId }, db.pool)
      )
    );
  } catch (err) {
    console.log("Couldn't delete user", err);
  }
  await Promise.all(
    conversations.map((c) =>
      pusherServer.trigger(`convo-${c.conversationId}`, 'new-message', {})
    )
  );
}

export async function revalidate() {
  revalidatePath('/chat');
}
