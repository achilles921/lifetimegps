
-- Create user_sessions table for session management
CREATE TABLE IF NOT EXISTS user_sessions (
  session_id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_sessions_email ON user_sessions(email);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
