-- Create tables for memo-app

CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  token TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE memos (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE todos (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trash (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recent (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  memo_id BIGINT NOT NULL,
  title TEXT DEFAULT '',
  viewed_at TIMESTAMP DEFAULT NOW()
);
