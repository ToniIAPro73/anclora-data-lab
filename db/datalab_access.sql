CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS datalab_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  organization TEXT,
  email TEXT NOT NULL,
  profile_label TEXT,
  intended_use TEXT NOT NULL,
  requested_locale TEXT NOT NULL DEFAULT 'es',
  submission_source TEXT NOT NULL DEFAULT 'private-estates',
  status TEXT NOT NULL DEFAULT 'submitted',
  review_notes TEXT,
  decision_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  datalab_account_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS datalab_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_request_id UUID REFERENCES datalab_access_requests(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  organization TEXT,
  role TEXT NOT NULL DEFAULT 'partner-intelligence',
  account_status TEXT NOT NULL DEFAULT 'active',
  password_hash TEXT NOT NULL,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_datalab_access_requests_created_at
  ON datalab_access_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_datalab_access_requests_status
  ON datalab_access_requests (status);

CREATE INDEX IF NOT EXISTS idx_datalab_accounts_email
  ON datalab_accounts (email);
