import { sql } from '@/lib/neon'
import { generateTemporaryPassword, hashSecret } from '@/lib/passwords'
import type { DataLabRole } from '@/lib/datalab-content'

export type DataLabAccessRequestStatus = 'submitted' | 'under_review' | 'accepted' | 'rejected'

export type DataLabAccessRequestRecord = {
  id: string
  full_name: string
  organization: string | null
  email: string
  profile_label: string | null
  intended_use: string
  requested_locale: string
  submission_source: string
  status: DataLabAccessRequestStatus
  review_notes: string | null
  decision_reason: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  datalab_account_id: string | null
  created_at: string
  updated_at: string
}

export type DataLabAccountRecord = {
  id: string
  access_request_id: string | null
  email: string
  full_name: string
  organization: string | null
  role: DataLabRole
  account_status: 'active' | 'paused'
  last_login_at: string | null
  created_at: string
  updated_at: string
}

declare global {
  var __ancloraDataLabSchemaReady: Promise<void> | undefined
}

export async function ensureDataLabSchema() {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`

  await sql`
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
  `

  await sql`
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
  `

  await sql`
    CREATE INDEX IF NOT EXISTS idx_datalab_access_requests_created_at
      ON datalab_access_requests (created_at DESC);
  `

  await sql`
    CREATE INDEX IF NOT EXISTS idx_datalab_access_requests_status
      ON datalab_access_requests (status);
  `

  await sql`
    CREATE INDEX IF NOT EXISTS idx_datalab_accounts_email
      ON datalab_accounts (email);
  `
}

async function ensureSchemaReady() {
  globalThis.__ancloraDataLabSchemaReady ??= ensureDataLabSchema()
  await globalThis.__ancloraDataLabSchemaReady
}

export async function createDataLabAccessRequest(input: {
  fullName: string
  organization?: string
  email: string
  profileLabel?: string
  intendedUse: string
  requestedLocale: string
  submissionSource: string
}) {
  await ensureSchemaReady()

  const rows = await sql<DataLabAccessRequestRecord>`
    INSERT INTO datalab_access_requests (
      full_name,
      organization,
      email,
      profile_label,
      intended_use,
      requested_locale,
      submission_source
    )
    VALUES (
      ${input.fullName},
      ${input.organization?.trim() || null},
      ${input.email},
      ${input.profileLabel?.trim() || null},
      ${input.intendedUse},
      ${input.requestedLocale},
      ${input.submissionSource}
    )
    RETURNING
      id,
      full_name,
      organization,
      email,
      profile_label,
      intended_use,
      requested_locale,
      submission_source,
      status,
      review_notes,
      decision_reason,
      reviewed_at,
      reviewed_by,
      datalab_account_id,
      created_at,
      updated_at;
  `

  return rows[0] ?? null
}

export async function listDataLabAccessRequests(input?: {
  status?: DataLabAccessRequestStatus
  query?: string
  limit?: number
}) {
  await ensureSchemaReady()
  const query = input?.query?.trim() || ''
  const queryLike = query ? `%${query}%` : null
  const limit = Math.max(1, Math.min(input?.limit || 80, 200))

  const rows = input?.status
    ? await sql<DataLabAccessRequestRecord>`
        SELECT
          id,
          full_name,
          organization,
          email,
          profile_label,
          intended_use,
          requested_locale,
          submission_source,
          status,
          review_notes,
          decision_reason,
          reviewed_at,
          reviewed_by,
          datalab_account_id,
          created_at,
          updated_at
        FROM datalab_access_requests
        WHERE status = ${input.status}
          AND (
            ${queryLike}::text IS NULL
            OR lower(full_name) LIKE lower(${queryLike})
            OR lower(email) LIKE lower(${queryLike})
            OR lower(COALESCE(organization, '')) LIKE lower(${queryLike})
            OR lower(COALESCE(profile_label, '')) LIKE lower(${queryLike})
            OR lower(intended_use) LIKE lower(${queryLike})
          )
        ORDER BY created_at DESC
        LIMIT ${limit};
      `
    : await sql<DataLabAccessRequestRecord>`
        SELECT
          id,
          full_name,
          organization,
          email,
          profile_label,
          intended_use,
          requested_locale,
          submission_source,
          status,
          review_notes,
          decision_reason,
          reviewed_at,
          reviewed_by,
          datalab_account_id,
          created_at,
          updated_at
        FROM datalab_access_requests
        WHERE (
          ${queryLike}::text IS NULL
          OR lower(full_name) LIKE lower(${queryLike})
          OR lower(email) LIKE lower(${queryLike})
          OR lower(COALESCE(organization, '')) LIKE lower(${queryLike})
          OR lower(COALESCE(profile_label, '')) LIKE lower(${queryLike})
          OR lower(intended_use) LIKE lower(${queryLike})
        )
        ORDER BY created_at DESC
        LIMIT ${limit};
      `

  return rows
}

export async function getDataLabAccountByEmail(email: string) {
  await ensureSchemaReady()
  const rows = await sql<(DataLabAccountRecord & { password_hash: string })>`
    SELECT
      id,
      access_request_id,
      email,
      full_name,
      organization,
      role,
      account_status,
      password_hash,
      last_login_at,
      created_at,
      updated_at
    FROM datalab_accounts
    WHERE email = ${email}
    LIMIT 1;
  `

  return rows[0] ?? null
}

export async function markDataLabLogin(accountId: string) {
  await ensureSchemaReady()
  await sql`
    UPDATE datalab_accounts
    SET last_login_at = NOW(), updated_at = NOW()
    WHERE id = ${accountId};
  `
}

export async function approveDataLabAccessRequest(input: {
  id: string
  role: DataLabRole
  reviewNotes?: string
  decisionReason?: string
  reviewedBy?: string
}) {
  await ensureSchemaReady()

  const requestRows = await sql<{
    id: string
    full_name: string
    organization: string | null
    email: string
  }>`
    SELECT id, full_name, organization, email
    FROM datalab_access_requests
    WHERE id = ${input.id}
    LIMIT 1;
  `

  const request = requestRows[0]
  if (!request) return null

  const temporaryPassword = generateTemporaryPassword()
  const passwordHash = hashSecret(temporaryPassword)

  const accountRows = await sql<DataLabAccountRecord>`
    INSERT INTO datalab_accounts (
      access_request_id,
      email,
      full_name,
      organization,
      role,
      account_status,
      password_hash,
      updated_at
    )
    VALUES (
      ${request.id},
      ${request.email},
      ${request.full_name},
      ${request.organization},
      ${input.role},
      'active',
      ${passwordHash},
      NOW()
    )
    ON CONFLICT (email)
    DO UPDATE SET
      access_request_id = EXCLUDED.access_request_id,
      full_name = EXCLUDED.full_name,
      organization = EXCLUDED.organization,
      role = EXCLUDED.role,
      account_status = 'active',
      password_hash = EXCLUDED.password_hash,
      updated_at = NOW()
    RETURNING
      id,
      access_request_id,
      email,
      full_name,
      organization,
      role,
      account_status,
      last_login_at,
      created_at,
      updated_at;
  `

  const account = accountRows[0]

  const updatedRows = await sql<DataLabAccessRequestRecord>`
    UPDATE datalab_access_requests
    SET
      status = 'accepted',
      review_notes = ${input.reviewNotes?.trim() || null},
      decision_reason = ${input.decisionReason?.trim() || input.reviewNotes?.trim() || null},
      reviewed_at = NOW(),
      reviewed_by = ${input.reviewedBy?.trim() || null},
      datalab_account_id = ${account.id},
      updated_at = NOW()
    WHERE id = ${input.id}
    RETURNING
      id,
      full_name,
      organization,
      email,
      profile_label,
      intended_use,
      requested_locale,
      submission_source,
      status,
      review_notes,
      decision_reason,
      reviewed_at,
      reviewed_by,
      datalab_account_id,
      created_at,
      updated_at;
  `

  return {
    request: updatedRows[0] ?? null,
    account,
    temporaryPassword,
    launchUrl: `/login?email=${encodeURIComponent(account.email)}`,
  }
}

export async function rejectDataLabAccessRequest(input: {
  id: string
  reviewNotes?: string
  decisionReason?: string
  reviewedBy?: string
}) {
  await ensureSchemaReady()

  const rows = await sql<DataLabAccessRequestRecord>`
    UPDATE datalab_access_requests
    SET
      status = 'rejected',
      review_notes = ${input.reviewNotes?.trim() || null},
      decision_reason = ${input.decisionReason?.trim() || input.reviewNotes?.trim() || null},
      reviewed_at = NOW(),
      reviewed_by = ${input.reviewedBy?.trim() || null},
      updated_at = NOW()
    WHERE id = ${input.id}
    RETURNING
      id,
      full_name,
      organization,
      email,
      profile_label,
      intended_use,
      requested_locale,
      submission_source,
      status,
      review_notes,
      decision_reason,
      reviewed_at,
      reviewed_by,
      datalab_account_id,
      created_at,
      updated_at;
  `

  return rows[0] ?? null
}

export async function updateDataLabAccessRequestStatus(input: {
  id: string
  status: Exclude<DataLabAccessRequestStatus, 'accepted' | 'submitted'>
  reviewNotes?: string
  decisionReason?: string
  reviewedBy?: string
}) {
  await ensureSchemaReady()

  const rows = await sql<DataLabAccessRequestRecord>`
    UPDATE datalab_access_requests
    SET
      status = ${input.status},
      review_notes = ${input.reviewNotes?.trim() || null},
      decision_reason = ${input.decisionReason?.trim() || input.reviewNotes?.trim() || null},
      reviewed_at = NOW(),
      reviewed_by = ${input.reviewedBy?.trim() || null},
      updated_at = NOW()
    WHERE id = ${input.id}
    RETURNING
      id,
      full_name,
      organization,
      email,
      profile_label,
      intended_use,
      requested_locale,
      submission_source,
      status,
      review_notes,
      decision_reason,
      reviewed_at,
      reviewed_by,
      datalab_account_id,
      created_at,
      updated_at;
  `

  return rows[0] ?? null
}
