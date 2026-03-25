'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { roleLabels, type DataLabRole } from '@/lib/datalab-content'
import { DataLabUiToggles } from '@/components/datalab/DataLabUiToggles'
import { getDefaultLocale, getDefaultTheme } from '@/lib/datalab-ui'

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

function formatDate(value: string | null) {
  if (!value) return 'Sin revisar'
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function DataLabAccessRequestsReviewPage() {
  const defaultLocale = getDefaultLocale()
  const defaultTheme = getDefaultTheme()
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
        throw new Error(('error' in body && body.error) || 'No se han podido cargar las solicitudes.')
      }

      setItems(body.items)
      setSelectedId((current) => {
        if (current && body.items.some((item) => item.id === current)) return current
        return body.items[0]?.id || null
      })
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se han podido cargar las solicitudes.')
    } finally {
      setLoading(false)
    }
  }, [query, statusFilter])

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
        throw new Error(('error' in body && body.error) || 'No se ha podido actualizar la solicitud.')
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
        setNotice('Solicitud aceptada. Las credenciales iniciales ya están preparadas.')
      } else if (status === 'rejected') {
        setNotice('Solicitud rechazada y registrada correctamente.')
      } else {
        setNotice('Solicitud marcada como en revisión.')
      }
    } catch (decisionError) {
      setError(decisionError instanceof Error ? decisionError.message : 'No se ha podido actualizar la solicitud.')
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
          <div className="datalab-backlink">Revisión interna de accesos</div>
          <div className="datalab-brand">
            <div className="datalab-brand-mark">
              <Image src="/brand/logo-anclora-datalab.png" alt="Anclora Data Lab" width={54} height={54} className="datalab-brand-logo" />
            </div>
            <div className="datalab-brand-copy">
              <p>Anclora Data Lab</p>
              <span>Backoffice de admisiones y accesos.</span>
            </div>
          </div>
          <div className="datalab-nav">
            <DataLabUiToggles defaultLocale={defaultLocale} defaultTheme={defaultTheme} />
          </div>
        </header>

        <section className="datalab-hero">
          <article className="datalab-card">
            <p className="datalab-eyebrow">Control de accesos</p>
            <h1>Solicitudes, validación y activación interna.</h1>
            <p className="datalab-lead">
              Esta consola permite revisar las solicitudes procedentes de la entrada pública de Data Lab y decidir qué
              perfiles reciben acceso real al workspace.
            </p>
          </article>
          <aside className="datalab-metrics">
            <article className="datalab-metric"><span className="datalab-kicker">Total</span><strong>{items.length}</strong><span>Solicitudes cargadas.</span></article>
            <article className="datalab-metric"><span className="datalab-kicker">Pendientes</span><strong>{items.filter((item) => item.status === 'submitted' || item.status === 'under_review').length}</strong><span>Requieren revisión o decisión.</span></article>
          </aside>
        </section>

        <div className="datalab-review-toolbar">
          <input
            className="datalab-input"
            placeholder="Buscar por nombre, email u organización"
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
                {status === 'all' ? 'Todo' : status === 'under_review' ? 'En revisión' : status === 'submitted' ? 'Recibidas' : status === 'accepted' ? 'Aceptadas' : 'Rechazadas'}
              </button>
            ))}
          </div>
          <button type="button" className="datalab-button-ghost" onClick={() => void handleLogout()}>
            Cerrar sesión
          </button>
        </div>

        {error ? <p className="datalab-notice">{error}</p> : null}
        {notice ? <p className="datalab-notice">{notice}</p> : null}

        <div className="datalab-review-grid">
          <section className="datalab-panel datalab-review-list-panel">
            <div className="datalab-section-head">
              <div>
                <p className="datalab-eyebrow">Cola de solicitudes</p>
                <h2>Admisiones recibidas.</h2>
              </div>
            </div>
            {loading ? (
              <div className="datalab-review-empty">Cargando solicitudes...</div>
            ) : items.length === 0 ? (
              <div className="datalab-review-empty">No hay solicitudes para este filtro.</div>
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
                      <span className={`datalab-review-badge is-${item.status}`}>{item.status}</span>
                    </div>
                    <p>{item.organization || item.email}</p>
                    <small>{formatDate(item.created_at)}</small>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="datalab-panel datalab-review-detail-panel">
            {!selected ? (
              <div className="datalab-review-empty">Selecciona una solicitud para revisar el detalle.</div>
            ) : (
              <div className="datalab-review-detail">
                <div className="datalab-section-head">
                  <div>
                    <p className="datalab-eyebrow">Detalle de solicitud</p>
                    <h2>{selected.full_name}</h2>
                  </div>
                </div>

                <div className="datalab-review-meta-grid">
                  <article className="datalab-list-item"><strong>Email</strong><p className="datalab-copy">{selected.email}</p></article>
                  <article className="datalab-list-item"><strong>Organización</strong><p className="datalab-copy">{selected.organization || 'No indicada'}</p></article>
                  <article className="datalab-list-item"><strong>Perfil</strong><p className="datalab-copy">{selected.profile_label || 'No indicado'}</p></article>
                  <article className="datalab-list-item"><strong>Estado</strong><p className="datalab-copy">{selected.status}</p></article>
                </div>

                <article className="datalab-list-item">
                  <strong>Contexto de uso</strong>
                  <p className="datalab-copy">{selected.intended_use}</p>
                </article>

                <div className="datalab-review-meta-grid">
                  <article className="datalab-list-item">
                    <strong>Rol a conceder</strong>
                    <select className="datalab-select" value={assignedRole} onChange={(event) => setAssignedRole(event.target.value as DataLabRole)}>
                      {(Object.keys(roleLabels) as DataLabRole[]).map((role) => (
                        <option key={role} value={role}>{roleLabels[role]}</option>
                      ))}
                    </select>
                  </article>
                  <article className="datalab-list-item">
                    <strong>Última revisión</strong>
                    <p className="datalab-copy">{formatDate(selected.reviewed_at)}</p>
                  </article>
                </div>

                <textarea
                  className="datalab-textarea"
                  placeholder="Notas internas de revisión"
                  value={reviewNotes}
                  onChange={(event) => setReviewNotes(event.target.value)}
                />

                <textarea
                  className="datalab-textarea"
                  placeholder="Motivo o criterio de decisión"
                  value={decisionReason}
                  onChange={(event) => setDecisionReason(event.target.value)}
                />

                {decisionPayload ? (
                  <article className="datalab-list-item">
                    <strong>Credenciales iniciales</strong>
                    <p className="datalab-copy">Password temporal: {decisionPayload.tempPassword || 'No disponible'}</p>
                    <p className="datalab-copy">Ruta de acceso: {decisionPayload.launchUrl || 'No disponible'}</p>
                  </article>
                ) : null}

                <div className="datalab-review-actions">
                  <button className="datalab-button-ghost" type="button" disabled={savingAction !== null} onClick={() => void handleDecision('under_review')}>
                    {savingAction === 'under_review' ? 'Guardando...' : 'Marcar en revisión'}
                  </button>
                  <button className="datalab-button-ghost" type="button" disabled={savingAction !== null} onClick={() => void handleDecision('rejected')}>
                    {savingAction === 'rejected' ? 'Guardando...' : 'Rechazar'}
                  </button>
                  <button className="datalab-button" type="button" disabled={savingAction !== null} onClick={() => void handleDecision('accepted')}>
                    {savingAction === 'accepted' ? 'Activando...' : 'Aceptar y crear acceso'}
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
