import { PoolClient } from 'pg';
import pool from '../pool';
import * as db from '../queries.queries';
import testData from '../test-utils/testData';
import insertData from '../test-utils/insertData';
import {
  it,
  beforeAll,
  afterAll,
  describe,
  beforeEach,
  afterEach,
  expect,
} from 'vitest';

let client: PoolClient;

beforeAll(async () => {
  await insertData(pool);
});

beforeEach(async () => {
  client = await pool.connect();
  await client.query('BEGIN');
});

afterEach(async () => {
  await client.query('ROLLBACK;');
  client.release();
});

afterAll(async () => {
  await pool.end();
});

describe('getUser', () => {
  it('Returns the user with the passed ID', async () => {
    const user = testData.users[0];
    const { id: userId, ...expectedResult } = user;
    const [dbUser] = await db.getUser.run({ userId }, client);
    expect(dbUser).toMatchObject(expectedResult);
  });
});

describe('searchUser', () => {
  it('Finds users whose name or email contain the term', async () => {
    const term = 'e';
    const expectedUsers = testData.users.filter(
      ({ name, email }) => name.includes(term) || email.includes(term)
    );
    const dbUsers = await db.searchUser.run({ term }, client);
    expect(expectedUsers.length).toBeLessThan(testData.users.length);
    expect(dbUsers.length).toBe(expectedUsers.length);
    const dbMappedUsers = dbUsers.map(({ userId, ...rest }) => ({
      ...rest,
      id: userId,
    }));
    expect(dbMappedUsers).toMatchObject(expect.arrayContaining(expectedUsers));
  });
});

describe('getConversationMessages', () => {
  it('Returns all messages for a specific conversation and whether the user saw them', async () => {
    const conversation = testData.conversations[2];
    const { id: conversationId } = conversation;
    const dbMessages = await db.getConversationMessages.run(
      { conversationId, userId: 1 },
      client
    );
    expect(dbMessages).toMatchInlineSnapshot(`
      [
        {
          "body": "heyo",
          "createdAt": 2024-01-01T00:00:00.000Z,
          "id": "4",
          "image": "rand.com",
          "name": "Khaled",
          "seen": true,
          "userId": 1,
        },
        {
          "body": "hey there",
          "createdAt": 2024-03-01T00:00:00.000Z,
          "id": "5",
          "image": "rand.com",
          "name": "Steve",
          "seen": false,
          "userId": 2,
        },
      ]
    `);
  });
});

describe('getConversationData', () => {
  it('Returns the conversation name and group chat prop', async () => {
    const conversation = testData.conversations[2];
    const { id } = conversation;
    const [dbConversation] = await db.getCovnersationData.run(
      { conversationId: id },
      client
    );
    expect(dbConversation.name).toBe(conversation.name);
    expect(dbConversation.groupChat).toBe(conversation.group_chat);
  });
});

describe('getLastConversationMessages', () => {
  it('Returns the last message for each conversation the passed user is in and whether they saw it', async () => {
    const user = testData.users[0];
    const { id: userId } = user;
    const lastMessages = await db.getLastConversationMessages.run(
      { userId },
      client
    );
    expect(lastMessages).toMatchInlineSnapshot(`
      [
        {
          "body": "hi",
          "conversationId": "khaledSteve",
          "createdat": 2024-01-02T00:00:00.000Z,
          "image": "rand.com",
          "name": "Steve",
          "seen": true,
          "userId": 2,
        },
        {
          "body": "hello",
          "conversationId": "khaledFoo",
          "createdat": 2024-01-01T00:00:00.000Z,
          "image": "rand.com",
          "name": "Foo",
          "seen": false,
          "userId": 3,
        },
        {
          "body": "hey there",
          "conversationId": "groupChat",
          "createdat": 2024-03-01T00:00:00.000Z,
          "image": "rand.com",
          "name": "Steve",
          "seen": false,
          "userId": 2,
        },
      ]
    `);
  });
});

describe('getUserConversations', () => {
  it('Returns the conversations the user is a member of', async () => {
    const user = testData.users[1];
    const conversationIds = testData.memberships
      .filter((m) => m.user_id === user.id)
      .map((m) => m.conversation_id);
    const dbConversations = await db.getUserConversations.run(
      { userId: user.id },
      client
    );
    const dbConversationIds = dbConversations.map((c) => c.conversationId);
    expect(dbConversationIds).toEqual(conversationIds);
  });
});

describe('getDirectConversation', () => {
  it('Returns the direct conversation with the passed members', async () => {
    const memberIds = [1, 3];
    const conversationId = testData.conversations[1].id;
    const dbConversations = await db.getDirectConversation.run(
      { userIds: memberIds },
      client
    );
    expect(dbConversations.length).toBe(1);
    expect(dbConversations[0].conversationId).toBe(conversationId);
  });
});

describe('getSoloConversation', () => {
  it('Returns the users solo convo if it exists', async () => {
    const user = testData.users[0];
    const conversationId = testData.conversations[4].id;
    const dbConversations = await db.getSoloConversation.run(
      { userId: user.id },
      client
    );
    expect(dbConversations.length).toBe(1);
    expect(dbConversations[0].conversationId).toBe(conversationId);
  });
  it('Returns an empty array if the user doesnt have a solo convo', async () => {
    const user = testData.users[1];
    const dbConversations = await db.getSoloConversation.run(
      { userId: user.id },
      client
    );
    expect(dbConversations.length).toBe(0);
  });
});

describe('getConversationMembers', () => {
  it('Returns data about the members of a conversation', async () => {
    const conversation = testData.conversations[2];
    const { id: conversationId } = conversation;
    const memberIds = testData.memberships
      .filter((m) => m.conversation_id === conversationId)
      .map((m) => m.user_id);
    const dbMembers = await db.getConversationMembers.run(
      { conversationId },
      client
    );
    const dbMemberIds = dbMembers.map((m) => m.userId);
    expect(dbMemberIds).toEqual(memberIds);
  });
});

describe('createMessage', () => {
  it('Inserts message with the passed data', async () => {
    const message = {
      id: 'test',
      body: 'hi',
      conversationId: 'khaledSteve',
      userId: 1,
    };
    await db.createMessage.run(message, client);
    const dbNewMessage = await client.query(
      `SELECT id, body, user_id as "userId", conversation_id as "conversationId" 
      FROM messages WHERE id = $1`,
      [message.id]
    );
    expect(dbNewMessage.rows[0]).toMatchObject(message);
  });
});

describe('createConversation', () => {
  it('Creates a conversation with the passed ID', async () => {
    const conversationId = 'newConv';
    const name = 'testName';
    const groupChat = true;
    await db.createConversation.run(
      { conversationId, name, groupChat },
      client
    );
    const dbNewConv = await client.query(
      `SELECT * FROM conversations WHERE id = $1 AND name = $2 AND group_chat = $3;`,
      [conversationId, name, groupChat as unknown as string]
    );
    expect(dbNewConv.rowCount).toBe(1);
  });
});

describe('changeConversationName', () => {
  it('Changes the name of a conversation', async () => {
    const newName = 'testName';
    const conversation = testData.conversations[0];
    const conversationId = conversation.id;
    await db.changeConversationName.run(
      { conversationId, name: newName },
      client
    );
    const dbNewConv = await client.query(
      `SELECT * FROM conversations WHERE id = $1 AND name = $2`,
      [conversationId, newName]
    );
    expect(dbNewConv.rowCount).toBe(1);
  });
});

describe('deleteConversation', () => {
  it('Deletes the conversation with the passed ID', async () => {
    const conversation = testData.conversations[0];
    const conversationId = conversation.id;
    await db.deleteConversation.run({ conversationId }, client);
    const dbConversation = await client.query(
      `SELECT * FROM conversations WHERE id=$1`,
      [conversationId]
    );
    expect(dbConversation.rowCount).toBe(0);
  });
});

describe('addConversationMember', () => {
  it('Adds a membership with the passed data', async () => {
    const membership = { conversationId: 'khaledSteve', userId: 3 };
    await db.addConversationMember.run(membership, client);
    const dbMembership = await client.query(
      `SELECT * FROM memberships 
    WHERE conversation_id = $1 AND user_id = $2;`,
      [membership.conversationId, membership.userId as unknown as string]
    );
    expect(dbMembership.rowCount).toBe(1);
  });
});

describe('removeConversationMember', () => {
  it('Removes the passed conversation member', async () => {
    const membership = testData.memberships[0];
    await db.removeConversationMember.run(
      {
        conversationId: membership.conversation_id,
        userId: membership.user_id,
      },
      client
    );
    const dbMembership = await client.query(
      `SELECT * FROM memberships 
    WHERE user_id = $1 AND conversation_id = $2`,
      [membership.user_id as unknown as string, membership.conversation_id]
    );
    expect(dbMembership.rowCount).toBe(0);
  });
});

describe('setMessageSeen', () => {
  it('Inserts row into seen messages table', async () => {
    const seenMessage = {
      userId: 1,
      messageId: '3',
    };
    await db.setMessageSeen.run(seenMessage, client);
    const dbSeenMessage = await client.query(
      `SELECT * FROM seen_messages 
    WHERE user_id = $1 AND message_id = $2`,
      [seenMessage.userId as unknown as string, seenMessage.messageId]
    );
    expect(dbSeenMessage.rowCount).toBe(1);
  });
});
