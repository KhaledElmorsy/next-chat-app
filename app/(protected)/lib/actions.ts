'use server';

import { nanoid } from 'nanoid';
import * as db from '@/app/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createDirectConversation(
  userIds: number[],
) {
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
    return redirect(`chat/${existingConvId}`);
  }

  const conversationId = nanoid();
  try {
    await db.createConversation.run({ conversationId, groupChat: false }, db.pool);
    await Promise.all(
      userIds.map((id) =>
        db.addConversationMember.run({ conversationId, userId: id }, db.pool)
      )
    );
  } catch (err) {
    console.error("Couldn't create conversation", err);
  }
  revalidatePath('/chat')
}
