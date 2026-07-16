-- Drop existing tables and recreate
DROP TABLE IF EXISTS recent; DROP TABLE IF EXISTS trash; DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS memos; DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  token TEXT,
  createdat TIMESTAMP DEFAULT NOW()
);

CREATE TABLE memos (
  id BIGINT PRIMARY KEY,
  userid BIGINT REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT false,
  createdat TIMESTAMP DEFAULT NOW(),
  updatedat TIMESTAMP DEFAULT NOW()
);

CREATE TABLE todos (
  id BIGINT PRIMARY KEY,
  userid BIGINT REFERENCES users(id),
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  createdat TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trash (
  id BIGINT PRIMARY KEY,
  userid BIGINT REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  createdat TIMESTAMP DEFAULT NOW(),
  deletedat TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recent (
  id SERIAL PRIMARY KEY,
  userid BIGINT REFERENCES users(id),
  memoid BIGINT NOT NULL,
  title TEXT DEFAULT '',
  viewedat TIMESTAMP DEFAULT NOW()
);
