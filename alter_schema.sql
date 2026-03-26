-- Migration: make email optional, add phone to users table
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE players ALTER COLUMN email DROP NOT NULL;
