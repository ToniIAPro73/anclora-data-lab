'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, Database, KeyRound, MapPinned, Radar, ShieldCheck, Sparkles, UserRoundPlus } from 'lucide-react'
import { curatedDocuments, heroMetrics, mvpModules, signals, zones } from '@/lib/datalab-content'
import { DataLabUiToggles } from '@/components/datalab/DataLabUiToggles'
import { buildPrivateEstatesHref, getDefaultLocale, getDefaultTheme, type DataLabLocale } from '@/lib/datalab-ui'

export function DataLabPublicPage() {
  const defaultLocale = getDefaultLocale()
  const defaultTheme = getDefaultTheme()
  const [locale, setLocale] = useState<DataLabLocale>(defaultLocale)
  const [requestForm, setRequestForm] = useState({
    name: '',
    organization: '',
    email: '',
    profile: '',
    intendedUse: '',
  })
  const [requestBusy, setRequestBusy] = useState(false)
  const [requestNotice, setRequestNotice] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const showPublicTechnicalItems = false
  const publicDocuments = showPublicTechnicalItems
    ? curatedDocuments
    : curatedDocuments.filter((document) => document.title !== 'Feature Foundation v1')

  async function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRequestBusy(true)
    setRequestError(null)
    setRequestNotice(null)

    try {
      const response = await fetch('/api/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: requestForm.name,
          organization: requestForm.organization,
          email: requestForm.email,
          profileLabel: requestForm.profile,
          intendedUse: requestForm.intendedUse,
          requestedLocale: locale,
          submissionSource: 'private-estates',
        }),
      })

      const payload = (await response.json().catch(() => null)) as { error?: string } | { id?: string } | null
      if (!response.ok) {
        throw new Error((payload && 'error' in payload && payload.error) || 'No se ha podido registrar la solicitud de acceso.')
      }

      setRequestNotice(
        'Solicitud de acceso registrada. El equipo de Data Lab evaluará tu encaje y te responderá por email con los siguientes pasos.'
      )
      setRequestForm({
        name: '',
        organization: '',
        email: '',
        profile: '',
        intendedUse: '',
      })
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'No se ha podido registrar la solicitud de acceso.')
    } finally {
      setRequestBusy(false)
    }
  }

  return (
    <main className="datalab-page">
      <div className="datalab-noise" />
      <div className="datalab-shell">
        <header className="datalab-topbar">
          <Link href={buildPrivateEstatesHref(locale)} className="datalab-backlink">
            Volver a Private Estates
          </Link>

          <div className="datalab-brand">
            <div className="datalab-brand-mark">
              <Image src="/brand/logo-anclora-datalab.png" alt="Anclora Data Lab" width={54} height={54} className="datalab-brand-logo" />
            </div>
            <div className="datalab-brand-copy">
              <p>Anclora Data Lab</p>
              <span>Inteligencia territorial y activos analíticos de Anclora.</span>
            </div>
          </div>
          <div className="datalab-nav">
            <DataLabUiToggles defaultLocale={defaultLocale} defaultTheme={defaultTheme} onLocaleChange={setLocale} />
          </div>
        </header>

        <section className="datalab-hero">
          <article className="datalab-card">
            <p className="datalab-eyebrow">Inteligencia institucional para Private Estates</p>
            <h1>La capa analítica donde el territorio se convierte en decisión.</h1>
            <p className="datalab-lead">
              Anclora Data Lab traduce contexto territorial, señales de mercado, documentación curada y lectura institucional
              en una experiencia premium para perfiles autorizados de Anclora Private Estates.
            </p>
            <p className="datalab-copy">
              Esta primera versión nace en sintonía con el acceso ya expuesto desde el Área Privada de Private Estates: una sala
              analítica selectiva para capital, partners e interlocutores con permiso, no un dashboard genérico de proptech.
            </p>
            <div className="datalab-hero-actions">
              <span className="datalab-pill-tag">Solicitud curada</span>
              <span className="datalab-pill-tag">Acceso aprobado</span>
              <span className="datalab-pill-tag">Workspace analítico</span>
              {showPublicTechnicalItems ? (
                <Link href="/docs/anclora-data-lab-foundation-v1-spec.pdf" className="datalab-doc-link" target="_blank">
                  Ver spec fundacional
                </Link>
              ) : null}
            </div>
          </article>

          <aside className="datalab-metrics">
            {heroMetrics.map((metric) => (
              <article key={metric.label} className="datalab-metric">
                <span className="datalab-kicker">{metric.label}</span>
                <strong>{metric.value}</strong>
                <span>{metric.description}</span>
              </article>
            ))}
          </aside>
        </section>

        <section className="datalab-grid-2 datalab-access-grid">
          <section className="datalab-panel datalab-access-panel">
            <div className="datalab-section-intro">
              <div className="datalab-section-icon">
                <UserRoundPlus size={18} />
              </div>
              <div>
                <p className="datalab-eyebrow">Solicitud de acceso</p>
                <h2 className="datalab-section-title">Solicitar acceso a Data Lab</h2>
                <p className="datalab-section-copy">
                  Comparte tu perfil, organización y contexto de uso para que Anclora valide si procede darte acceso a la
                  capa analítica.
                </p>
              </div>
            </div>

            <div className="datalab-signals">
              <article className="datalab-signal-card">
                <Sparkles className="datalab-signal-icon" />
                <h3>Solicitud estructurada</h3>
                <p>Recogemos organización, perfil de acceso y el tipo de uso previsto dentro de Anclora Data Lab.</p>
              </article>
              <article className="datalab-signal-card">
                <ShieldCheck className="datalab-signal-icon is-cyan" />
                <h3>Validación curada</h3>
                <p>El acceso se concede solo cuando encaja con el nivel de confidencialidad y el propósito analítico.</p>
              </article>
            </div>

            <form className="datalab-form" onSubmit={handleRequestSubmit}>
              <input
                className="datalab-input"
                placeholder="Nombre completo"
                value={requestForm.name}
                onChange={(event) => setRequestForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              <div className="datalab-form-grid">
                <input
                  className="datalab-input"
                  placeholder="Empresa u organización"
                  value={requestForm.organization}
                  onChange={(event) => setRequestForm((prev) => ({ ...prev, organization: event.target.value }))}
                />
                <input
                  className="datalab-input"
                  type="email"
                  placeholder="Email profesional"
                  value={requestForm.email}
                  onChange={(event) => setRequestForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>
              <input
                className="datalab-input"
                placeholder="Perfil o rol previsto"
                value={requestForm.profile}
                onChange={(event) => setRequestForm((prev) => ({ ...prev, profile: event.target.value }))}
              />
              <textarea
                className="datalab-textarea"
                placeholder="Explica brevemente cómo utilizarías Data Lab y qué tipo de acceso necesitas."
                value={requestForm.intendedUse}
                onChange={(event) => setRequestForm((prev) => ({ ...prev, intendedUse: event.target.value }))}
                required
              />

              {requestError ? <p className="datalab-notice">{requestError}</p> : null}
              {requestNotice ? <p className="datalab-notice">{requestNotice}</p> : null}

              <button className="datalab-button" type="submit" disabled={requestBusy}>
                {requestBusy ? 'Registrando solicitud...' : 'Enviar solicitud de acceso'}
              </button>
            </form>
          </section>

          <section className="datalab-panel datalab-access-panel">
            <div className="datalab-approved-card">
              <div className="datalab-approved-icon">
                <KeyRound size={18} />
              </div>
              <div>
                <p className="datalab-approved-title">Acceso aprobado</p>
                <p className="datalab-approved-copy">
                  Esta vía está reservada a perfiles ya autorizados. Si ya has sido validado, entra con tu email y tu
                  contraseña para abrir el workspace analítico.
                </p>
              </div>
            </div>

            <div className="datalab-form-header">
              <p className="datalab-eyebrow">Entrada privada</p>
              <h2>Entrar en Anclora Data Lab</h2>
              <p>
                El acceso privado se habilita tras revisión interna. Una vez activa tu cuenta, podrás entrar
                directamente al workspace analítico y a los packs documentales autorizados con tu email y contraseña.
              </p>
            </div>

            <div className="datalab-signals datalab-signal-stack">
              <article className="datalab-signal-card">
                <KeyRound className="datalab-signal-icon" />
                <h3>Credenciales activas</h3>
                <p>El login está reservado a usuarios aprobados con acceso real al entorno analítico de Data Lab.</p>
              </article>
              <article className="datalab-signal-card">
                <ArrowRight className="datalab-signal-icon is-cyan" />
                <h3>Workspace selectivo</h3>
                <p>Una vez dentro, el acceso se adapta al perfil y a la capa de visibilidad concedida.</p>
              </article>
            </div>

            <div className="datalab-login-cta-box">
              <Link href="/login" className="datalab-button datalab-button-link">
                Abrir acceso privado
              </Link>
            </div>

            <div className="datalab-support-grid">
              <a href="mailto:datalab@anclora.com?subject=Data%20Lab%20Access" className="datalab-support-card">
                <p>Soporte de acceso</p>
                <span>Si no localizas tus credenciales o necesitas asistencia, contacta con el equipo de Data Lab.</span>
              </a>
              <a href="mailto:datalab@anclora.com?subject=Data%20Lab%20Access%20Review" className="datalab-support-card">
                <p>Estado de solicitud</p>
                <span>Si ya has solicitado acceso y necesitas seguimiento, podemos revisar contigo el estado del proceso.</span>
              </a>
            </div>
          </section>
        </section>

        <section className="datalab-section datalab-grid-3">
          {mvpModules.map((module) => (
            <article key={module.title} className="datalab-panel">
              <p className="datalab-eyebrow">Módulo MVP</p>
              <h2>{module.title}</h2>
              <p className="datalab-copy">{module.body}</p>
            </article>
          ))}
        </section>

        <section className="datalab-section datalab-grid-side">
          <article className="datalab-card">
            <div className="datalab-section-head">
              <div>
                <p className="datalab-eyebrow">Radar territorial</p>
                <h2>Mercado balear en lectura premium.</h2>
              </div>
            </div>
            <div className="datalab-list">
              {zones.map((zone) => (
                <article key={zone.name} className="datalab-list-item">
                  <div className="datalab-zone-head">
                    <strong>{zone.name}</strong>
                    <span className="datalab-kicker">{zone.momentum}</span>
                  </div>
                  <p className="datalab-copy">{zone.thesis}</p>
                  <p className="datalab-inline-note">Rango: {zone.priceBand}</p>
                  <p className="datalab-inline-note">Foco: {zone.focus}</p>
                </article>
              ))}
            </div>
          </article>

          <aside className="datalab-side-panel">
            <p className="datalab-eyebrow">Promesa de producto</p>
            <h2>Packs, señales y activos analíticos con acceso selectivo.</h2>
            <p className="datalab-copy">
              Data Lab se articula como una extensión privada y analítica de Anclora Private Estates. Su misión es reducir
              opacidad, ordenar señal e incrementar la calidad de decisión patrimonial.
            </p>
            <ul className="datalab-signal-list">
              <li className="datalab-signal-item"><Radar size={18} /> Señales previas al mercado abierto</li>
              <li className="datalab-signal-item"><MapPinned size={18} /> Contexto territorial y regulatorio</li>
              <li className="datalab-signal-item"><Database size={18} /> Documentación curada y entregables premium</li>
              <li className="datalab-signal-item"><ShieldCheck size={18} /> Visibilidad controlada por perfil autorizado</li>
            </ul>
          </aside>
        </section>

        <section className="datalab-section datalab-grid-side">
          <article className="datalab-card">
            <div className="datalab-section-head">
              <div>
                <p className="datalab-eyebrow">Señales curadas</p>
                <h2>Qué se está leyendo desde la capa analítica.</h2>
              </div>
            </div>
            <ul className="datalab-signal-list">
              {signals.map((signal) => (
                <li key={signal.title} className="datalab-signal-item">
                  <strong>{signal.title}</strong>
                  <p className="datalab-copy">{signal.summary}</p>
                  <p className="datalab-inline-note">Señal: {signal.signal}</p>
                  <p className="datalab-inline-note">Uso recomendado: {signal.action}</p>
                </li>
              ))}
            </ul>
          </article>

          <aside className="datalab-side-panel">
            <p className="datalab-eyebrow">Acceso selectivo</p>
            <h2>Tres capas iniciales de acceso.</h2>
            <div className="datalab-list">
              <article className="datalab-list-item">
                <strong>Interno / advisory</strong>
                <p className="datalab-copy">Lectura completa de señales, packs y biblioteca premium.</p>
              </article>
              <article className="datalab-list-item">
                <strong>Partner intelligence</strong>
                <p className="datalab-copy">Acceso curado a materiales y tesis compartibles con contexto restringido.</p>
              </article>
              <article className="datalab-list-item">
                <strong>Capital autorizado</strong>
                <p className="datalab-copy">Consumo selectivo de informes, snapshots y documentos preparados para decisión.</p>
              </article>
            </div>
          </aside>
        </section>

        <section className="datalab-section">
          <div className="datalab-section-head">
            <div>
              <p className="datalab-eyebrow">Biblioteca curada</p>
              <h2>Documentación fundacional ya disponible.</h2>
            </div>
          </div>
          <div className="datalab-grid-docs">
            {publicDocuments.map((document) => (
              <article key={document.title} className="datalab-panel">
                <div className="datalab-doc-head">
                  <strong>{document.title}</strong>
                  <span className="datalab-kicker">{document.category}</span>
                </div>
                <p className="datalab-copy">{document.summary}</p>
                <Link href={document.href} target="_blank" className="datalab-doc-link">
                  Abrir documento
                  <ArrowUpRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
