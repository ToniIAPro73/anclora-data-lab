'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { roleLabelsByLocale, type DataLabRole } from '@/lib/datalab-content'
import { DATALAB_BRAND } from '@/lib/datalab-brand'
import { datalabAdminCopy } from '@/lib/datalab-admin-copy'
import { DataLabUiToggles } from '@/components/datalab/DataLabUiToggles'
import { buildAncloraGroupHref, getDefaultLocale, getDefaultTheme, type DataLabLocale } from '@/lib/datalab-ui'

type DataLabAccessRequestStatus = 'submitted' | 'under_review' | 'accepted' | 'rejected'

type DataLabAccessRequestRecord = {
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

type AccessRequestsResponse = {
  items: DataLabAccessRequestRecord[]
  total: number
}

const STATUS_FILTERS: Array<'all' | DataLabAccessRequestStatus> = ['all', 'submitted', 'under_review', 'accepted', 'rejected']

const LOCALE_FORMATTERS: Record<DataLabLocale, string> = {
  es: 'es-ES',
  en: 'en-GB',
  de: 'de-DE',
}

function formatDate(value: string | null, locale: DataLabLocale) {
  if (!value) return datalabAdminCopy[locale].review.notReviewed
  return new Intl.DateTimeFormat(LOCALE_FORMATTERS[locale], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

type Props = {
  defaultLocale?: DataLabLocale
}

export function DataLabAccessRequestsReviewPage({ defaultLocale: initialLocale }: Props) {
  const defaultLocale = initialLocale ?? getDefaultLocale()
  const defaultTheme = getDefaultTheme()
  const [locale, setLocale] = useState<DataLabLocale>(defaultLocale)
  const [items, setItems] = useState<DataLabAccessRequestRecord[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | DataLabAccessRequestStatus>('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [decisionReason, setDecisionReason] = useState('')
  const [assignedRole, setAssignedRole] = useState<DataLabRole>('partner-intelligence')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [decisionPayload, setDecisionPayload] = useState<{ tempPassword?: string; launchUrl?: string } | null>(null)
  const [savingAction, setSavingAction] = useState<DataLabAccessRequestStatus | null>(null)
  const copy = datalabAdminCopy[locale]
  const roleLabels = roleLabelsByLocale[locale]

  const loadRequests = useCallback(async (nextStatus = statusFilter, nextQuery = query) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (nextStatus !== 'all') params.set('status', nextStatus)
      if (nextQuery.trim()) params.set('q', nextQuery.trim())

      const response = await fetch(`/api/access-requests?${params.toString()}`, { cache: 'no-store' })
      const body = (await response.json()) as AccessRequestsResponse | { error?: string }
      if (!response.ok || !('items' in body)) {
        throw new Error(('error' in body && body.error) || copy.review.loadError)
      }

      setItems(body.items)
      setSelectedId((current) => {
        if (current && body.items.some((item) => item.id === current)) return current
        return body.items[0]?.id || null
      })
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : copy.review.loadError)
    } finally {
      setLoading(false)
    }
  }, [copy.review.loadError, query, statusFilter])

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadRequests(statusFilter, query), 200)
    return () => window.clearTimeout(timeout)
  }, [loadRequests, statusFilter, query])

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId])

  useEffect(() => {
    setReviewNotes(selected?.review_notes || '')
    setDecisionReason(selected?.decision_reason || '')
    setNotice(null)
    setDecisionPayload(null)
  }, [selected])

  async function handleDecision(status: 'under_review' | 'accepted' | 'rejected') {
    if (!selected) return
    setSavingAction(status)
    setError(null)
    setNotice(null)
    setDecisionPayload(null)

    try {
      const response = await fetch(`/api/access-requests/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes,
          decisionReason,
          role: assignedRole,
        }),
      })

      const body = (await response.json()) as (DataLabAccessRequestRecord & { temp_password?: string; launch_url?: string }) | { error?: string }
      if (!response.ok || !('id' in body)) {
        throw new Error(('error' in body && body.error) || copy.review.updateError)
      }

      const nextRecord = {
        ...body,
        status,
      } as DataLabAccessRequestRecord

      setItems((current) => current.map((item) => (item.id === nextRecord.id ? nextRecord : item)))
      if (status === 'accepted') {
        setDecisionPayload({
          tempPassword: 'temp_password' in body ? body.temp_password : undefined,
          launchUrl: 'launch_url' in body ? body.launch_url : undefined,
        })
        setNotice(copy.review.acceptedNotice)
      } else if (status === 'rejected') {
        setNotice(copy.review.rejectedNotice)
      } else {
        setNotice(copy.review.inReviewNotice)
      }
    } catch (decisionError) {
      setError(decisionError instanceof Error ? decisionError.message : copy.review.updateError)
    } finally {
      setSavingAction(null)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/session', { method: 'DELETE' })
    window.location.assign('/access-requests/login')
  }

  return (
    <main className="datalab-page">
      <div className="datalab-noise" />
      <div className="datalab-shell">
        <header className="datalab-topbar">
          <Link href={buildAncloraGroupHref()} className="datalab-backlink">
            {copy.login.backToGroup}
          </Link>
          <div className="datalab-brand">
            <div className="datalab-brand-mark">
              <Image src={DATALAB_BRAND.logoPath} alt={DATALAB_BRAND.name} width={54} height={54} className="datalab-brand-logo" />
            </div>
            <div className="datalab-brand-copy">
              <p>{copy.labels.brandName}</p>
              <span>{copy.labels.backofficeAdmissions}</span>
            </div>
          </div>
          <div className="datalab-nav">
            <DataLabUiToggles locale={locale} defaultLocale={defaultLocale} defaultTheme={defaultTheme} onLocaleChange={setLocale} />
          </div>
        </header>

        <section className="datalab-hero">
          <article className="datalab-card">
            <p className="datalab-eyebrow">{copy.labels.accessControl}</p>
            <h1>{copy.review.title}</h1>
            <p className="datalab-lead">{copy.review.lead}</p>
          </article>
          <aside className="datalab-metrics">
            <article className="datalab-metric"><span className="datalab-kicker">{copy.labels.total}</span><strong>{items.length}</strong><span>{copy.labels.loadedRequests}</span></article>
            <article className="datalab-metric"><span className="datalab-kicker">{copy.labels.pending}</span><strong>{items.filter((item) => item.status === 'submitted' || item.status === 'under_review').length}</strong><span>{copy.labels.pendingOrDecision}</span></article>
          </aside>
        </section>

        <div className="datalab-review-toolbar">
          <input
            className="datalab-input"
            placeholder={copy.review.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="datalab-review-filter-group">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                className={`datalab-review-filter ${statusFilter === status ? 'is-active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {copy.statuses[status]}
              </button>
            ))}
          </div>
          <button type="button" className="datalab-button-ghost" onClick={() => void handleLogout()}>
            {copy.review.closeSession}
          </button>
        </div>

        {error ? <p className="datalab-notice">{error}</p> : null}
        {notice ? <p className="datalab-notice">{notice}</p> : null}

        <div className="datalab-review-grid">
          <section className="datalab-panel datalab-review-list-panel">
            <div className="datalab-section-head">
              <div>
                <p className="datalab-eyebrow">{copy.labels.queue}</p>
                <h2>{copy.review.receivedAdmissions}</h2>
              </div>
            </div>
            {loading ? (
              <div className="datalab-review-empty">{copy.review.loading}</div>
            ) : items.length === 0 ? (
              <div className="datalab-review-empty">{copy.review.noItems}</div>
            ) : (
              <div className="datalab-review-list">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`datalab-review-item ${selectedId === item.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="datalab-review-item-top">
                      <strong>{item.full_name}</strong>
                      <span className={`datalab-review-badge is-${item.status}`}>{copy.rawStatuses[item.status]}</span>
                    </div>
                    <p>{item.organization || item.email}</p>
                    <small>{formatDate(item.created_at, locale)}</small>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="datalab-panel datalab-review-detail-panel">
            {!selected ? (
              <div className="datalab-review-empty">{copy.review.selectOne}</div>
            ) : (
              <div className="datalab-review-detail">
                <div className="datalab-section-head">
                  <div>
                    <p className="datalab-eyebrow">{copy.labels.detail}</p>
                    <h2>{selected.full_name}</h2>
                  </div>
                </div>

                <div className="datalab-review-meta-grid">
                  <article className="datalab-list-item"><strong>{copy.labels.email}</strong><p className="datalab-copy">{selected.email}</p></article>
                  <article className="datalab-list-item"><strong>{copy.labels.organization}</strong><p className="datalab-copy">{selected.organization || copy.review.noIndicated}</p></article>
                  <article className="datalab-list-item"><strong>{copy.labels.profile}</strong><p className="datalab-copy">{selected.profile_label || copy.review.notIndicated}</p></article>
                  <article className="datalab-list-item"><strong>{copy.labels.status}</strong><p className="datalab-copy">{copy.rawStatuses[selected.status]}</p></article>
                </div>

                <article className="datalab-list-item">
                  <strong>{copy.labels.usageContext}</strong>
                  <p className="datalab-copy">{selected.intended_use}</p>
                </article>

                <div className="datalab-review-meta-grid">
                  <article className="datalab-list-item">
                    <strong>{copy.labels.roleToGrant}</strong>
                    <select className="datalab-select" value={assignedRole} onChange={(event) => setAssignedRole(event.target.value as DataLabRole)}>
                      {(Object.keys(roleLabels) as DataLabRole[]).map((role) => (
                        <option key={role} value={role}>{roleLabels[role]}</option>
                      ))}
                    </select>
                  </article>
                  <article className="datalab-list-item">
                    <strong>{copy.labels.lastReview}</strong>
                    <p className="datalab-copy">{formatDate(selected.reviewed_at, locale)}</p>
                  </article>
                </div>

                <textarea
                  className="datalab-textarea"
                  placeholder={copy.review.reviewNotesPlaceholder}
                  value={reviewNotes}
                  onChange={(event) => setReviewNotes(event.target.value)}
                />

                <textarea
                  className="datalab-textarea"
                  placeholder={copy.review.decisionReasonPlaceholder}
                  value={decisionReason}
                  onChange={(event) => setDecisionReason(event.target.value)}
                />

                {decisionPayload ? (
                  <article className="datalab-list-item">
                    <strong>{copy.labels.initialCredentials}</strong>
                    <p className="datalab-copy">{copy.labels.temporaryPassword}: {decisionPayload.tempPassword || copy.generic.unavailable}</p>
                    <p className="datalab-copy">{copy.labels.launchRoute}: {decisionPayload.launchUrl || copy.generic.unavailable}</p>
                  </article>
                ) : null}

                <div className="datalab-review-actions">
                  <button className="datalab-button-ghost" type="button" disabled={savingAction !== null} onClick={() => void handleDecision('under_review')}>
                    {savingAction === 'under_review' ? copy.review.saving : copy.review.saveInReview}
                  </button>
                  <button className="datalab-button-ghost" type="button" disabled={savingAction !== null} onClick={() => void handleDecision('rejected')}>
                    {savingAction === 'rejected' ? copy.review.saving : copy.review.reject}
                  </button>
                  <button className="datalab-button" type="button" disabled={savingAction !== null} onClick={() => void handleDecision('accepted')}>
                    {savingAction === 'accepted' ? copy.review.accepting : copy.review.acceptAndCreate}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
