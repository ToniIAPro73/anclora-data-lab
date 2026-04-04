'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { DATALAB_BRAND } from '@/lib/datalab-brand'
import { datalabAdminCopy } from '@/lib/datalab-admin-copy'
import { DataLabUiToggles } from '@/components/datalab/DataLabUiToggles'
import { buildAncloraGroupHref, getDefaultLocale, getDefaultTheme, type DataLabLocale } from '@/lib/datalab-ui'

type Props = {
  defaultLocale?: DataLabLocale
  defaultUsername?: string
  defaultPassword?: string
}

export function DataLabAdmissionsLoginPage({ defaultLocale: initialLocale, defaultUsername = '', defaultPassword = '' }: Props) {
  const defaultLocale = initialLocale ?? getDefaultLocale()
  const defaultTheme = getDefaultTheme()
  const [locale, setLocale] = useState<DataLabLocale>(defaultLocale)
  const [username, setUsername] = useState(defaultUsername)
  const [password, setPassword] = useState(defaultPassword)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const copy = datalabAdminCopy[locale]

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
        throw new Error(payload?.error || copy.login.openError)
      }

      window.location.assign('/access-requests')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : copy.login.openError)
      setBusy(false)
    }
  }

  return (
    <main className="datalab-page">
      <div className="datalab-noise" />
      <div className="datalab-shell">
        <header className="datalab-topbar datalab-topbar-admin">
          <Link href={buildAncloraGroupHref()} className="datalab-backlink">
            {copy.login.backToGroup}
          </Link>
          <div className="datalab-brand">
            <div className="datalab-brand-mark">
              <Image src={DATALAB_BRAND.logoPath} alt={DATALAB_BRAND.name} width={54} height={54} className="datalab-brand-logo" />
            </div>
            <div className="datalab-brand-copy">
              <p>{copy.labels.brandName}</p>
              <span>{copy.login.subtitle}</span>
            </div>
          </div>
          <div className="datalab-nav datalab-nav-admin">
            <DataLabUiToggles locale={locale} defaultLocale={defaultLocale} defaultTheme={defaultTheme} onLocaleChange={setLocale} />
          </div>
        </header>

        <div className="datalab-review-login-wrap">
          <section className="datalab-panel datalab-review-login-panel">
            <p className="datalab-eyebrow">{copy.login.eyebrow}</p>
            <h1>{copy.login.title}</h1>
            <p className="datalab-copy">{copy.login.copy}</p>

            <form className="datalab-form" onSubmit={handleSubmit}>
              <input
                className="datalab-input"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={copy.login.usernamePlaceholder}
                autoComplete="username"
                required
                disabled={busy}
              />
              <input
                className="datalab-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={copy.login.passwordPlaceholder}
                autoComplete="current-password"
                required
                disabled={busy}
              />
              {error ? <p className="datalab-notice">{error}</p> : null}
              <button className="datalab-button" type="submit" disabled={busy}>
                {busy ? copy.login.busy : copy.login.submit}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
