'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { DataLabUiToggles } from '@/components/datalab/DataLabUiToggles'
import { buildAncloraGroupHref, getDefaultLocale, getDefaultTheme } from '@/lib/datalab-ui'

export function DataLabAdmissionsLoginPage() {
  const defaultLocale = getDefaultLocale()
  const defaultTheme = getDefaultTheme()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(payload?.error || 'No se ha podido abrir el backoffice interno.')
      }

      window.location.assign('/access-requests')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se ha podido abrir el backoffice interno.')
      setBusy(false)
    }
  }

  return (
    <main className="datalab-page">
      <div className="datalab-noise" />
      <div className="datalab-shell">
        <header className="datalab-topbar datalab-topbar-admin">
          <Link href={buildAncloraGroupHref()} className="datalab-backlink">
            Volver a Anclora Group
          </Link>
          <div className="datalab-brand">
            <div className="datalab-brand-mark">
              <Image src="/brand/logo-anclora-datalab.png" alt="Anclora Data Lab" width={54} height={54} className="datalab-brand-logo" />
            </div>
            <div className="datalab-brand-copy">
              <p>Anclora Data Lab</p>
              <span>Admisiones internas y control de accesos.</span>
            </div>
          </div>
          <div className="datalab-nav datalab-nav-admin">
            <DataLabUiToggles defaultLocale={defaultLocale} defaultTheme={defaultTheme} />
          </div>
        </header>

        <div className="datalab-review-login-wrap">
          <section className="datalab-panel datalab-review-login-panel">
            <p className="datalab-eyebrow">Acceso interno</p>
            <h1>Entrar en revisión de solicitudes.</h1>
            <p className="datalab-copy">
              Este acceso está reservado al equipo interno que valida solicitudes, aprueba o rechaza accesos y habilita
              las credenciales operativas de Data Lab.
            </p>

            <form className="datalab-form" onSubmit={handleSubmit}>
              <input
                className="datalab-input"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Usuario interno"
                autoComplete="username"
                required
                disabled={busy}
              />
              <input
                className="datalab-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Contraseña interna"
                autoComplete="current-password"
                required
                disabled={busy}
              />
              {error ? <p className="datalab-notice">{error}</p> : null}
              <button className="datalab-button" type="submit" disabled={busy}>
                {busy ? 'Abriendo backoffice...' : 'Entrar en revisión'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
