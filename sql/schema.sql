-- Create tables for memo-app (camelCase columns)

CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  token TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE memos (
  id BIGINT PRIMARY KEY,
  "userId" BIGINT REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE todos (
  id BIGINT PRIMARY KEY,
  "userId" BIGINT REFERENCES users(id),
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trash (
  id BIGINT PRIMARY KEY,
  "userId" BIGINT REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "deletedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recent (
  id SERIAL PRIMARY KEY,
  "userId" BIGINT REFERENCES users(id),
  "memoId" BIGINT NOT NULL,
  title TEXT DEFAULT '',
  "viewedAt" TIMESTAMP DEFAULT NOW()
);
