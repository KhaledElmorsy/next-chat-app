/** Types generated for queries found in "app/lib/db/queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type numberArray = (number)[];

/** 'GetUser' parameters type */
export interface IGetUserParams {
  userId?: number | null | void;
}

/** 'GetUser' return type */
export interface IGetUserResult {
  email: string;
  image: string;
  name: string;
  userId: number;
}

/** 'GetUser' query type */
export interface IGetUserQuery {
  params: IGetUserParams;
  result: IGetUserResult;
}

const getUserIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":105,"b":111}]}],"statement":"SELECT name as \"name!\",\n  email as \"email!\",\n  image as \"image!\",\n  id as \"userId\"\nFROM users\nWHERE id = :userId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT name as "name!",
 *   email as "email!",
 *   image as "image!",
 *   id as "userId"
 * FROM users
 * WHERE id = :userId
 * ```
 */
export const getUser = new PreparedQuery<IGetUserParams,IGetUserResult>(getUserIR);


/** 'SearchUser' parameters type */
export interface ISearchUserParams {
  term?: string | null | void;
}

/** 'SearchUser' return type */
export interface ISearchUserResult {
  email: string;
  image: string;
  name: string;
  userId: number;
}

/** 'SearchUser' query type */
export interface ISearchUserQuery {
  params: ISearchUserParams;
  result: ISearchUserResult;
}

const searchUserIR: any = {"usedParamSet":{"term":true},"params":[{"name":"term","required":false,"transform":{"type":"scalar"},"locs":[{"a":118,"b":122},{"a":155,"b":159}]}],"statement":"SELECT name as \"name!\",\n  email as \"email!\",\n  image as \"image!\",\n  id as \"userId\"\nFROM users\nWHERE name ILIKE '%' || :term || '%'\n  OR email ILIKE '%' || :term || '%'"};

/**
 * Query generated from SQL:
 * ```
 * SELECT name as "name!",
 *   email as "email!",
 *   image as "image!",
 *   id as "userId"
 * FROM users
 * WHERE name ILIKE '%' || :term || '%'
 *   OR email ILIKE '%' || :term || '%'
 * ```
 */
export const searchUser = new PreparedQuery<ISearchUserParams,ISearchUserResult>(searchUserIR);


/** 'GetConversationMessages' parameters type */
export interface IGetConversationMessagesParams {
  conversationId?: string | null | void;
  userId?: number | null | void;
}

/** 'GetConversationMessages' return type */
export interface IGetConversationMessagesResult {
  body: string;
  createdAt: Date;
  id: string;
  image: string | null;
  name: string | null;
  seen: boolean | null;
  userId: number;
}

/** 'GetConversationMessages' query type */
export interface IGetConversationMessagesQuery {
  params: IGetConversationMessagesParams;
  result: IGetConversationMessagesResult;
}

const getConversationMessagesIR: any = {"usedParamSet":{"userId":true,"conversationId":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":191,"b":197}]},{"name":"conversationId","required":false,"transform":{"type":"scalar"},"locs":[{"a":292,"b":306}]}],"statement":"SELECT m.id,\n  body,\n  createdAt as \"createdAt\",\n  u.name,\n  u.image,\n  u.id as \"userId\",\n  (\n    SELECT count(*)\n    FROM seen_messages s\n    WHERE s.message_id = m.id\n      AND s.user_id = :userId\n  ) = 1 as \"seen\"\nFROM messages m\n  JOIN users u ON m.user_id = u.id\nWHERE conversation_id = :conversationId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT m.id,
 *   body,
 *   createdAt as "createdAt",
 *   u.name,
 *   u.image,
 *   u.id as "userId",
 *   (
 *     SELECT count(*)
 *     FROM seen_messages s
 *     WHERE s.message_id = m.id
 *       AND s.user_id = :userId
 *   ) = 1 as "seen"
 * FROM messages m
 *   JOIN users u ON m.user_id = u.id
 * WHERE conversation_id = :conversationId
 * ```
 */
export const getConversationMessages = new PreparedQuery<IGetConversationMessagesParams,IGetConversationMessagesResult>(getConversationMessagesIR);


/** 'GetCovnersationData' parameters type */
export interface IGetCovnersationDataParams {
  conversationId?: string | null | void;
}

/** 'GetCovnersationData' return type */
export interface IGetCovnersationDataResult {
  groupChat: boolean | null;
  name: string | null;
}

/** 'GetCovnersationData' query type */
export interface IGetCovnersationDataQuery {
  params: IGetCovnersationDataParams;
  result: IGetCovnersationDataResult;
}

const getCovnersationDataIR: any = {"usedParamSet":{"conversationId":true},"params":[{"name":"conversationId","required":false,"transform":{"type":"scalar"},"locs":[{"a":71,"b":85}]}],"statement":"SELECT name,\n  group_chat as \"groupChat\"\nFROM conversations\nWHERE id = :conversationId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT name,
 *   group_chat as "groupChat"
 * FROM conversations
 * WHERE id = :conversationId
 * ```
 */
export const getCovnersationData = new PreparedQuery<IGetCovnersationDataParams,IGetCovnersationDataResult>(getCovnersationDataIR);


/** 'GetLastConversationMessages' parameters type */
export interface IGetLastConversationMessagesParams {
  userId?: number | null | void;
}

/** 'GetLastConversationMessages' return type */
export interface IGetLastConversationMessagesResult {
  body: string;
  conversationId: string | null;
  createdat: Date;
  image: string | null;
  name: string | null;
  seen: boolean | null;
  userId: number;
}

/** 'GetLastConversationMessages' query type */
export interface IGetLastConversationMessagesQuery {
  params: IGetLastConversationMessagesParams;
  result: IGetLastConversationMessagesResult;
}

const getLastConversationMessagesIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":237,"b":243},{"a":431,"b":437}]}],"statement":"SELECT DISTINCT ON (conversation_id) conversation_id as \"conversationId\",\n  body,\n  createdAt,\n  u.name,\n  u.image,\n  u.id as \"userId\",\n  (\n    SELECT count(*)\n    FROM seen_messages s\n    WHERE s.message_id = m.id\n      AND s.user_id = :userId\n  ) = 1 as \"seen\"\nFROM messages m\n  JOIN users u ON m.user_id = u.id\nWHERE conversation_id = ANY(\n    SELECT conversation_id as \"conversationId\"\n    FROM memberships\n    WHERE user_id = :userId\n  )\nORDER BY conversation_id DESC,\n  createdAt DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT DISTINCT ON (conversation_id) conversation_id as "conversationId",
 *   body,
 *   createdAt,
 *   u.name,
 *   u.image,
 *   u.id as "userId",
 *   (
 *     SELECT count(*)
 *     FROM seen_messages s
 *     WHERE s.message_id = m.id
 *       AND s.user_id = :userId
 *   ) = 1 as "seen"
 * FROM messages m
 *   JOIN users u ON m.user_id = u.id
 * WHERE conversation_id = ANY(
 *     SELECT conversation_id as "conversationId"
 *     FROM memberships
 *     WHERE user_id = :userId
 *   )
 * ORDER BY conversation_id DESC,
 *   createdAt DESC
 * ```
 */
export const getLastConversationMessages = new PreparedQuery<IGetLastConversationMessagesParams,IGetLastConversationMessagesResult>(getLastConversationMessagesIR);


/** 'GetUserConversations' parameters type */
export interface IGetUserConversationsParams {
  userId?: number | null | void;
}

/** 'GetUserConversations' return type */
export interface IGetUserConversationsResult {
  conversationId: string;
  groupChat: boolean | null;
  name: string | null;
}

/** 'GetUserConversations' query type */
export interface IGetUserConversationsQuery {
  params: IGetUserConversationsParams;
  result: IGetUserConversationsResult;
}

const getUserConversationsIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":166,"b":172}]}],"statement":"SELECT conversation_id as \"conversationId\",\n  name,\n  group_chat as \"groupChat\"\nFROM memberships m\n  JOIN conversations c ON c.id = m.conversation_id\nWHERE user_id = :userId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT conversation_id as "conversationId",
 *   name,
 *   group_chat as "groupChat"
 * FROM memberships m
 *   JOIN conversations c ON c.id = m.conversation_id
 * WHERE user_id = :userId
 * ```
 */
export const getUserConversations = new PreparedQuery<IGetUserConversationsParams,IGetUserConversationsResult>(getUserConversationsIR);


/** 'GetConversationMembers' parameters type */
export interface IGetConversationMembersParams {
  conversationId?: string | null | void;
}

/** 'GetConversationMembers' return type */
export interface IGetConversationMembersResult {
  email: string | null;
  image: string | null;
  name: string | null;
  userId: number;
}

/** 'GetConversationMembers' query type */
export interface IGetConversationMembersQuery {
  params: IGetConversationMembersParams;
  result: IGetConversationMembersResult;
}

const getConversationMembersIR: any = {"usedParamSet":{"conversationId":true},"params":[{"name":"conversationId","required":false,"transform":{"type":"scalar"},"locs":[{"a":128,"b":142}]}],"statement":"SELECT name,\n  email,\n  image,\n  u.id as \"userId\"\nFROM memberships m\n  JOIN users u ON m.user_id = u.id\nWHERE conversation_id = :conversationId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT name,
 *   email,
 *   image,
 *   u.id as "userId"
 * FROM memberships m
 *   JOIN users u ON m.user_id = u.id
 * WHERE conversation_id = :conversationId
 * ```
 */
export const getConversationMembers = new PreparedQuery<IGetConversationMembersParams,IGetConversationMembersResult>(getConversationMembersIR);


/** 'GetDirectConversation' parameters type */
export interface IGetDirectConversationParams {
  userIds?: numberArray | null | void;
}

/** 'GetDirectConversation' return type */
export interface IGetDirectConversationResult {
  conversationId: string;
}

/** 'GetDirectConversation' query type */
export interface IGetDirectConversationQuery {
  params: IGetDirectConversationParams;
  result: IGetDirectConversationResult;
}

const getDirectConversationIR: any = {"usedParamSet":{"userIds":true},"params":[{"name":"userIds","required":false,"transform":{"type":"scalar"},"locs":[{"a":130,"b":137}]}],"statement":"SELECT id as \"conversationId\"\nFROM conversations c\nWHERE 2 = (\n    SELECT count(*)\n    FROM memberships m\n    WHERE user_id = ANY(:userIds)\n      AND m.conversation_id = c.id\n  )\n  AND group_chat = false"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id as "conversationId"
 * FROM conversations c
 * WHERE 2 = (
 *     SELECT count(*)
 *     FROM memberships m
 *     WHERE user_id = ANY(:userIds)
 *       AND m.conversation_id = c.id
 *   )
 *   AND group_chat = false
 * ```
 */
export const getDirectConversation = new PreparedQuery<IGetDirectConversationParams,IGetDirectConversationResult>(getDirectConversationIR);


/** 'GetSoloConversation' parameters type */
export interface IGetSoloConversationParams {
  userId?: number | null | void;
}

/** 'GetSoloConversation' return type */
export interface IGetSoloConversationResult {
  conversationId: string;
}

/** 'GetSoloConversation' query type */
export interface IGetSoloConversationQuery {
  params: IGetSoloConversationParams;
  result: IGetSoloConversationResult;
}

const getSoloConversationIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":84,"b":90}]}],"statement":"WITH user_convos AS (\n  SELECT conversation_id\n  FROM memberships\n  WHERE user_id = :userId\n)\nSELECT id as \"conversationId\"\nFROM conversations c\nWHERE 1 = (\n    SELECT count(*)\n    FROM memberships m\n    WHERE m.conversation_id = c.id\n      AND m.conversation_id = ANY (\n        SELECT conversation_id\n        FROM user_convos\n      )\n  )\n  AND group_chat = false"};

/**
 * Query generated from SQL:
 * ```
 * WITH user_convos AS (
 *   SELECT conversation_id
 *   FROM memberships
 *   WHERE user_id = :userId
 * )
 * SELECT id as "conversationId"
 * FROM conversations c
 * WHERE 1 = (
 *     SELECT count(*)
 *     FROM memberships m
 *     WHERE m.conversation_id = c.id
 *       AND m.conversation_id = ANY (
 *         SELECT conversation_id
 *         FROM user_convos
 *       )
 *   )
 *   AND group_chat = false
 * ```
 */
export const getSoloConversation = new PreparedQuery<IGetSoloConversationParams,IGetSoloConversationResult>(getSoloConversationIR);


/** 'CreateMessage' parameters type */
export interface ICreateMessageParams {
  body?: string | null | void;
  conversationId?: string | null | void;
  id?: string | null | void;
  userId?: number | null | void;
}

/** 'CreateMessage' return type */
export type ICreateMessageResult = void;

/** 'CreateMessage' query type */
export interface ICreateMessageQuery {
  params: ICreateMessageParams;
  result: ICreateMessageResult;
}

const createMessageIR: any = {"usedParamSet":{"id":true,"body":true,"userId":true,"conversationId":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":66,"b":68}]},{"name":"body","required":false,"transform":{"type":"scalar"},"locs":[{"a":71,"b":75}]},{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":78,"b":84}]},{"name":"conversationId","required":false,"transform":{"type":"scalar"},"locs":[{"a":87,"b":101}]}],"statement":"INSERT INTO messages (id, body, user_id, conversation_id)\nVALUES (:id, :body, :userId, :conversationId)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO messages (id, body, user_id, conversation_id)
 * VALUES (:id, :body, :userId, :conversationId)
 * ```
 */
export const createMessage = new PreparedQuery<ICreateMessageParams,ICreateMessageResult>(createMessageIR);


/** 'CreateConversation' parameters type */
export interface ICreateConversationParams {
  conversationId?: string | null | void;
  groupChat?: boolean | null | void;
  name?: string | null | void;
}

/** 'CreateConversation' return type */
export type ICreateConversationResult = void;

/** 'CreateConversation' query type */
export interface ICreateConversationQuery {
  params: ICreateConversationParams;
  result: ICreateConversationResult;
}

const createConversationIR: any = {"usedParamSet":{"conversationId":true,"name":true,"groupChat":true},"params":[{"name":"conversationId","required":false,"transform":{"type":"scalar"},"locs":[{"a":57,"b":71}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":74,"b":78}]},{"name":"groupChat","required":false,"transform":{"type":"scalar"},"locs":[{"a":81,"b":90}]}],"statement":"INSERT INTO conversations (id, name, group_chat)\nVALUES (:conversationId, :name, :groupChat)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO conversations (id, name, group_chat)
 * VALUES (:conversationId, :name, :groupChat)
 * ```
 */
export const createConversation = new PreparedQuery<ICreateConversationParams,ICreateConversationResult>(createConversationIR);


/** 'ChangeConversationName' parameters type */
export interface IChangeConversationNameParams {
  conversationId?: string | null | void;
  name?: string | null | void;
}

/** 'ChangeConversationName' return type */
export type IChangeConversationNameResult = void;

/** 'ChangeConversationName' query type */
export interface IChangeConversationNameQuery {
  params: IChangeConversationNameParams;
  result: IChangeConversationNameResult;
}

const changeConversationNameIR: any = {"usedParamSet":{"name":true,"conversationId":true},"params":[{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":32,"b":36}]},{"name":"conversationId","required":false,"transform":{"type":"scalar"},"locs":[{"a":49,"b":63}]}],"statement":"UPDATE conversations\nSET name = :name\nWHERE id = :conversationId"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE conversations
 * SET name = :name
 * WHERE id = :conversationId
 * ```
 */
export const changeConversationName = new PreparedQuery<IChangeConversationNameParams,IChangeConversationNameResult>(changeConversationNameIR);


/** 'DeleteConversation' parameters type */
export interface IDeleteConversationParams {
  conversationId?: string | null | void;
}

/** 'DeleteConversation' return type */
export type IDeleteConversationResult = void;

/** 'DeleteConversation' query type */
export interface IDeleteConversationQuery {
  params: IDeleteConversationParams;
  result: IDeleteConversationResult;
}

const deleteConversationIR: any = {"usedParamSet":{"conversationId":true},"params":[{"name":"conversationId","required":false,"transform":{"type":"scalar"},"locs":[{"a":37,"b":51}]}],"statement":"DELETE FROM conversations\nWHERE id = :conversationId"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM conversations
 * WHERE id = :conversationId
 * ```
 */
export const deleteConversation = new PreparedQuery<IDeleteConversationParams,IDeleteConversationResult>(deleteConversationIR);


/** 'AddConversationMember' parameters type */
export interface IAddConversationMemberParams {
  conversationId?: string | null | void;
  userId?: number | null | void;
}

/** 'AddConversationMember' return type */
export type IAddConversationMemberResult = void;

/** 'AddConversationMember' query type */
export interface IAddConversationMemberQuery {
  params: IAddConversationMemberParams;
  result: IAddConversationMemberResult;
}

const addConversationMemberIR: any = {"usedParamSet":{"conversationId":true,"userId":true},"params":[{"name":"conversationId","required":false,"transform":{"type":"scalar"},"locs":[{"a":59,"b":73}]},{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":76,"b":82}]}],"statement":"INSERT INTO memberships (conversation_id, user_id)\nVALUES (:conversationId, :userId)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO memberships (conversation_id, user_id)
 * VALUES (:conversationId, :userId)
 * ```
 */
export const addConversationMember = new PreparedQuery<IAddConversationMemberParams,IAddConversationMemberResult>(addConversationMemberIR);


/** 'RemoveConversationMember' parameters type */
export interface IRemoveConversationMemberParams {
  conversationId?: string | null | void;
  userId?: number | null | void;
}

/** 'RemoveConversationMember' return type */
export type IRemoveConversationMemberResult = void;

/** 'RemoveConversationMember' query type */
export interface IRemoveConversationMemberQuery {
  params: IRemoveConversationMemberParams;
  result: IRemoveConversationMemberResult;
}

const removeConversationMemberIR: any = {"usedParamSet":{"conversationId":true,"userId":true},"params":[{"name":"conversationId","required":false,"transform":{"type":"scalar"},"locs":[{"a":48,"b":62}]},{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":80,"b":86}]}],"statement":"DELETE FROM memberships\nWHERE conversation_id = :conversationId\n  AND user_id = :userId"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM memberships
 * WHERE conversation_id = :conversationId
 *   AND user_id = :userId
 * ```
 */
export const removeConversationMember = new PreparedQuery<IRemoveConversationMemberParams,IRemoveConversationMemberResult>(removeConversationMemberIR);


/** 'SetMessageSeen' parameters type */
export interface ISetMessageSeenParams {
  messageId?: string | null | void;
  userId?: number | null | void;
}

/** 'SetMessageSeen' return type */
export type ISetMessageSeenResult = void;

/** 'SetMessageSeen' query type */
export interface ISetMessageSeenQuery {
  params: ISetMessageSeenParams;
  result: ISetMessageSeenResult;
}

const setMessageSeenIR: any = {"usedParamSet":{"messageId":true,"userId":true},"params":[{"name":"messageId","required":false,"transform":{"type":"scalar"},"locs":[{"a":56,"b":65}]},{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":68,"b":74}]}],"statement":"INSERT INTO seen_messages (message_id, user_id)\nVALUES (:messageId, :userId)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO seen_messages (message_id, user_id)
 * VALUES (:messageId, :userId)
 * ```
 */
export const setMessageSeen = new PreparedQuery<ISetMessageSeenParams,ISetMessageSeenResult>(setMessageSeenIR);


