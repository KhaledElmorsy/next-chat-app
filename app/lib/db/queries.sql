/* @name getUser */
SELECT name as "name!",
  email as "email!",
  image as "image!",
  id as "userId"
FROM users
WHERE id = :userId;
/* @name searchUser */
SELECT name as "name!",
  email as "email!",
  image as "image!",
  id as "userId"
FROM users
WHERE name ILIKE '%' || :term || '%'
  OR email ILIKE '%' || :term || '%';
/* @name getConversationMessages */
SELECT m.id,
  body,
  createdAt as "createdAt",
  u.name,
  u.image,
  u.id as "userId",
  (
    SELECT count(*)
    FROM seen_messages s
    WHERE s.message_id = m.id
      AND s.user_id = :userId
  ) = 1 as "seen"
FROM messages m
  JOIN users u ON m.user_id = u.id
WHERE conversation_id = :conversationId;
/* @name getLastConversationMessages */
SELECT DISTINCT ON (conversation_id) conversation_id as "conversationId",
  body,
  createdAt,
  u.name,
  u.image,
  u.id as "userId",
  (
    SELECT count(*)
    FROM seen_messages s
    WHERE s.message_id = m.id
      AND s.user_id = :userId
  ) = 1 as "seen"
FROM messages m
  JOIN users u ON m.user_id = u.id
WHERE conversation_id = ANY(
    SELECT conversation_id as "conversationId"
    FROM memberships
    WHERE user_id = :userId
  )
ORDER BY conversation_id DESC,
  createdAt DESC;
/* @name getUserConversations */
SELECT conversation_id as "conversationId",
  name,
  group_chat as "groupChat"
FROM memberships m
  JOIN conversations c ON c.id = m.conversation_id
WHERE user_id = :userId;
/* @name getConversationMembers */
SELECT name,
  email,
  image,
  u.id as "userId"
FROM memberships m
  JOIN users u ON m.user_id = u.id
WHERE conversation_id = :conversationId;
/* @name getDirectConversation */
SELECT id as "conversationId"
FROM conversations c
WHERE 2 = (
    SELECT count(*)
    FROM memberships m
    WHERE user_id = ANY(:userIds)
      AND m.conversation_id = c.id
  )
  AND group_chat = false;
/* @name getSoloConversation */
WITH user_convos AS (
  SELECT conversation_id
  FROM memberships
  WHERE user_id = :userId
)
SELECT id as "conversationId"
FROM conversations c
WHERE 1 = (
    SELECT count(*)
    FROM memberships m
    WHERE m.conversation_id = c.id
      AND m.conversation_id = ANY (
        SELECT conversation_id
        FROM user_convos
      )
  )
  AND group_chat = false;
/* @name createMessage */
INSERT INTO messages (id, body, user_id, conversation_id)
VALUES (:id, :body, :userId, :conversationId);
/* @name createConversation */
INSERT INTO conversations (id, name, group_chat)
VALUES (:conversationId, :name, :groupChat);
/* @name changeConversationName */
UPDATE conversations
SET name = :name
WHERE id = :conversationId;
/* @name deleteConversation */
DELETE FROM conversations
WHERE id = :conversationId;
/* @name addConversationMember */
INSERT INTO memberships (conversation_id, user_id)
VALUES (:conversationId, :userId);
/* @name removeConversationMember */
DELETE FROM memberships
WHERE conversation_id = :conversationId
  AND user_id = :userId;
/* @name setMessageSeen */
INSERT INTO seen_messages (message_id, user_id)
VALUES (:messageId, :userId);
