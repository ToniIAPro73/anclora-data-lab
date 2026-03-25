'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight, Database, MapPinned, Radar, ShieldCheck } from 'lucide-react'
import { curatedDocuments, heroMetrics, mvpModules, signals, zones } from '@/lib/datalab-content'
import { DataLabUiToggles } from '@/components/datalab/DataLabUiToggles'
import { buildPrivateEstatesHref, getDefaultLocale, getDefaultTheme, type DataLabLocale } from '@/lib/datalab-ui'

export function DataLabPublicPage() {
  const defaultLocale = getDefaultLocale()
  const defaultTheme = getDefaultTheme()
  const [locale, setLocale] = useState<DataLabLocale>(defaultLocale)
  const showPublicTechnicalItems = false
  const publicDocuments = showPublicTechnicalItems
    ? curatedDocuments
    : curatedDocuments.filter((document) => document.title !== 'Feature Foundation v1')

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
              <Link href="/login" className="datalab-button">
                Entrar en Data Lab
              </Link>
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
