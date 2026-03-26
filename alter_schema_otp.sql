-- Migration: passwordless OTP auth
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

CREATE TABLE IF NOT EXISTS auth_codes (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  code_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS auth_codes_identifier_idx ON auth_codes (identifier);
