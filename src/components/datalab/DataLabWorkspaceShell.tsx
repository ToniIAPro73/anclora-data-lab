import Image from 'next/image'
import Link from 'next/link'
import { Bell, BookOpenText, ChartColumnBig, LockKeyhole, Map, Radar, Shield } from 'lucide-react'
import type { DataLabSession } from '@/lib/datalab-auth'
import { curatedDocuments, roleLabels, signals, workspaceAlerts, workspacePacks, zones } from '@/lib/datalab-content'
import { DataLabUiToggles } from '@/components/datalab/DataLabUiToggles'
import { getDefaultLocale, getDefaultTheme } from '@/lib/datalab-ui'

type Props = {
  session: DataLabSession
}

export function DataLabWorkspaceShell({ session }: Props) {
  const defaultLocale = getDefaultLocale()
  const defaultTheme = getDefaultTheme()

  return (
    <main className="datalab-page">
      <div className="datalab-noise" />
      <div className="datalab-shell">
        <header className="datalab-topbar">
          <div className="datalab-brand">
            <div className="datalab-brand-mark">
              <Image src="/brand/logo-anclora-datalab.png" alt="Anclora Data Lab" width={44} height={44} className="datalab-brand-logo" />
            </div>
            <div className="datalab-brand-copy">
              <p>Anclora Data Lab</p>
              <span>Workspace privado para señal territorial, activos documentales y consumo premium de inteligencia.</span>
            </div>
          </div>
          <div className="datalab-workspace-actions">
            <DataLabUiToggles defaultLocale={defaultLocale} defaultTheme={defaultTheme} />
            <span className="datalab-role-badge">
              <Shield size={15} />
              {roleLabels[session.role]}
            </span>
            <form action="/api/auth/session" method="post">
              <input type="hidden" name="_method" value="DELETE" />
              <button className="datalab-button-ghost" type="submit">Cerrar sesión</button>
            </form>
          </div>
        </header>

        <section className="datalab-hero">
          <article className="datalab-card">
            <p className="datalab-eyebrow">Acceso privado activo</p>
            <h1>Radar y activos listos para decisión.</h1>
            <p className="datalab-lead">
              Bienvenido, {session.displayName}. Esta primera versión concentra la lógica fundacional de Data Lab: lectura
              territorial, documentación premium y packs de inteligencia con acceso selectivo.
            </p>
            <div className="datalab-workspace-actions">
              <div className="datalab-mini-stat"><span className="datalab-kicker">Señales</span><strong>{signals.length}</strong></div>
              <div className="datalab-mini-stat"><span className="datalab-kicker">Documentos</span><strong>{curatedDocuments.length}</strong></div>
              <div className="datalab-mini-stat"><span className="datalab-kicker">Packs</span><strong>{workspacePacks.length}</strong></div>
            </div>
          </article>

          <aside className="datalab-metrics">
            {workspaceAlerts.map((alert) => (
              <article key={alert.title} className="datalab-metric">
                <span className="datalab-kicker">{alert.when}</span>
                <strong>{alert.title}</strong>
                <span>{alert.summary}</span>
              </article>
            ))}
          </aside>
        </section>

        <section className="datalab-workspace-grid">
          <div className="datalab-workspace-stack">
            <article className="datalab-workspace-card">
              <div className="datalab-section-head"><div><p className="datalab-eyebrow">Radar ejecutivo</p><h2>Señales que merecen seguimiento inmediato.</h2></div><Radar size={18} /></div>
              <ul className="datalab-signal-list">
                {signals.map((signal) => (
                  <li key={signal.title} className="datalab-signal-item">
                    <strong>{signal.title}</strong>
                    <p className="datalab-copy">{signal.summary}</p>
                    <p className="datalab-inline-note">Acción sugerida: {signal.action}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="datalab-workspace-card">
              <div className="datalab-section-head"><div><p className="datalab-eyebrow">Foco territorial</p><h2>Mercados donde la señal precede al pricing abierto.</h2></div><Map size={18} /></div>
              <div className="datalab-grid-3">
                {zones.map((zone) => (
                  <article key={zone.name} className="datalab-list-item">
                    <strong>{zone.name}</strong>
                    <p className="datalab-copy">{zone.thesis}</p>
                    <p className="datalab-inline-note">{zone.priceBand}</p>
                    <p className="datalab-inline-note">Momentum: {zone.momentum}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="datalab-workspace-card">
              <div className="datalab-section-head"><div><p className="datalab-eyebrow">Activos documentales</p><h2>Biblioteca premium disponible.</h2></div><BookOpenText size={18} /></div>
              <div className="datalab-grid-2">
                {curatedDocuments.map((document) => (
                  <article key={document.title} className="datalab-doc-item">
                    <div className="datalab-doc-head">
                      <strong>{document.title}</strong>
                      <span className="datalab-kicker">{document.category}</span>
                    </div>
                    <p className="datalab-copy">{document.summary}</p>
                    <Link href={document.href} target="_blank" className="datalab-doc-link">Abrir documento</Link>
                  </article>
                ))}
              </div>
            </article>
          </div>

          <div className="datalab-workspace-stack">
            <aside className="datalab-side-panel">
              <div className="datalab-section-head"><div><p className="datalab-eyebrow">Packs activos</p><h2>Entregables premium en circulación.</h2></div><ChartColumnBig size={18} /></div>
              <ul className="datalab-pack-list">
                {workspacePacks.map((pack) => (
                  <li key={pack.title} className="datalab-pack-item">
                    <div className="datalab-pack-head"><strong>{pack.title}</strong><span className="datalab-kicker">{pack.status}</span></div>
                    <p className="datalab-inline-note">Audiencia: {pack.audience}</p>
                    <p className="datalab-copy">{pack.notes}</p>
                  </li>
                ))}
              </ul>
            </aside>

            <aside className="datalab-side-panel">
              <div className="datalab-section-head"><div><p className="datalab-eyebrow">Alertas</p><h2>Actividad reciente del laboratorio.</h2></div><Bell size={18} /></div>
              <ul className="datalab-alert-list">
                {workspaceAlerts.map((alert) => (
                  <li key={alert.title} className="datalab-alert-item">
                    <div className="datalab-alert-head"><strong>{alert.title}</strong><span className="datalab-kicker">{alert.when}</span></div>
                    <p className="datalab-copy">{alert.summary}</p>
                  </li>
                ))}
              </ul>
            </aside>

            <aside className="datalab-side-panel">
              <div className="datalab-section-head"><div><p className="datalab-eyebrow">Arquitectura</p><h2>Documentación de producto y acceso.</h2></div><LockKeyhole size={18} /></div>
              <div className="datalab-stack-actions">
                <Link href="/docs/anclora-data-lab-access-architecture-v1.pdf" target="_blank" className="datalab-doc-link">Arquitectura de acceso</Link>
                <Link href="/docs/anclora-data-lab-roadmap-v1.pdf" target="_blank" className="datalab-doc-link">Roadmap inicial</Link>
              </div>
              <p className="datalab-footer-note">
                Esta fundación se alinea con el acceso ya mostrado en el Área Privada de Anclora Private Estates y prepara la evolución hacia dashboards, scoring y briefings IA más profundos.
              </p>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}
