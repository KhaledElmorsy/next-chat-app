CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,

  PRIMARY KEY (id)
);

CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,

  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,

  PRIMARY KEY (id)
);

CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE conversations
(
  id TEXT PRIMARY KEY,
  name TEXT,
  group_chat BOOLEAN DEFAULT FALSE
);

CREATE TABLE memberships
(
  user_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
  conversation_id TEXT NOT NULL REFERENCES conversations ON DELETE CASCADE,
  PRIMARY KEY (user_id, conversation_id)
);

CREATE TABLE messages
(
  id TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  user_id INT REFERENCES users ON DELETE CASCADE,
  conversation_id TEXT REFERENCES conversations ON DELETE CASCADE,
  createdAt TIMESTAMPTZ  NOT NULL DEFAULT now()
);

create TABLE seen_messages (
  message_id TEXT REFERENCES messages ON DELETE CASCADE,
  user_id INT REFERENCES users ON DELETE CASCADE,
  PRIMARY KEY(message_id, user_id)
)
