-- Cigars Baseball Database Schema
-- Run with: psql $DATABASE_URL -f schema.sql

-- Users (authentication)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Whitelist (who is allowed to register)
CREATE TABLE IF NOT EXISTS whitelist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(30),
  added_by INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('approved', 'pending')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players (profile data, linked to users)
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  date_of_birth DATE,
  uniform_number VARCHAR(5),
  positions TEXT[],
  shirt_size VARCHAR(10),
  cap_size VARCHAR(10),
  hometown VARCHAR(100),
  walk_up_song VARCHAR(200),
  bats VARCHAR(5),
  throws VARCHAR(5),
  photo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seasons
CREATE TABLE IF NOT EXISTS seasons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Season rosters (which players are on which season's roster)
CREATE TABLE IF NOT EXISTS season_rosters (
  id SERIAL PRIMARY KEY,
  season_id INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_id, player_id)
);

-- Games (DB-backed schedule)
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES seasons(id),
  game_date DATE NOT NULL,
  game_time TIME NOT NULL,
  opponent VARCHAR(100) NOT NULL,
  field VARCHAR(100) DEFAULT '',
  is_home BOOLEAN DEFAULT true,
  result VARCHAR(20) DEFAULT '',
  score VARCHAR(20) DEFAULT '',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game availability responses
CREATE TABLE IF NOT EXISTS game_availability (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  response VARCHAR(10) CHECK (response IN ('yes', 'no', 'maybe')),
  message TEXT,
  responded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, player_id)
);

-- Notification settings (single row, id=1)
CREATE TABLE IF NOT EXISTS notification_settings (
  id SERIAL PRIMARY KEY,
  days_before INTEGER DEFAULT 5,
  default_message TEXT DEFAULT 'Please respond with your availability for the upcoming game on {game_date} at {game_time}.',
  send_email BOOLEAN DEFAULT true,
  send_sms BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO notification_settings (id, days_before, default_message, send_email, send_sms)
VALUES (1, 5, 'Please respond with your availability for the upcoming game on {game_date} at {game_time}.', true, true)
ON CONFLICT (id) DO NOTHING;

-- Notification log
CREATE TABLE IF NOT EXISTS notification_log (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id),
  player_id INTEGER REFERENCES players(id),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  channel VARCHAR(10) CHECK (channel IN ('email', 'sms')),
  status VARCHAR(20),
  error_message TEXT
);
