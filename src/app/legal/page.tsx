import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Aviso Legal — Anclora Data Lab',
  description: 'Aviso legal e información corporativa de Anclora Data Lab.',
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--dl-border)' }}>
      <h2 style={{ color: 'var(--dl-text)', fontSize: '1.05rem', fontWeight: 700, marginTop: 0, marginBottom: '0.75rem' }}>
        {n}. {title}
      </h2>
      <div style={{ color: 'var(--dl-muted)', lineHeight: 1.8, fontSize: '0.9375rem' }}>{children}</div>
    </section>
  )
}

export default function LegalPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--dl-bg)', color: 'var(--dl-text)', padding: '4rem 1.5rem 6rem' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--dl-brand-emerald)', marginBottom: '0.75rem' }}>
            Anclora Data Lab — Legal
          </p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.5rem' }}>
            Aviso Legal
          </h1>
          <p style={{ color: 'var(--dl-muted-2)', fontSize: '0.875rem', margin: 0 }}>
            Última actualización: mayo de 2026
          </p>
          <div style={{ marginTop: '2rem', height: '1px', background: 'var(--dl-border)' }} />
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Section n={1} title="Titularidad y operador">
            <p>
              Anclora Data Lab es operado por <strong style={{ color: 'var(--dl-text)' }}>Anclora Group</strong>.
              Anclora Data Lab forma parte del ecosistema tecnológico de Anclora Group.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Contacto: <a href="mailto:hola@anclora.com" style={{ color: 'var(--dl-brand-emerald)' }}>hola@anclora.com</a>
            </p>
          </Section>

          <Section n={2} title="Naturaleza del servicio">
            <p>
              Anclora Data Lab es una plataforma de acceso restringido orientada a analítica, inteligencia de mercado,
              modelos predictivos y visualización de datos. No es un servicio de asesoramiento financiero, fiscal, legal
              ni de inversión. Los outputs son de naturaleza analítica e informativa.
            </p>
          </Section>

          <Section n={3} title="Condiciones de acceso">
            <p>
              El acceso a la plataforma requiere autorización previa y está limitado a usuarios validados por Anclora Group.
              El acceso no autorizado está prohibido y puede dar lugar a acciones legales conforme a la legislación aplicable.
            </p>
          </Section>

          <Section n={4} title="Propiedad intelectual e industrial">
            <p>
              La plataforma Anclora Data Lab, su código fuente, arquitectura, modelos analíticos, algoritmos de estimación,
              plantillas de informes, visualizaciones y diseño son propiedad de Anclora Group o están licenciados a su favor.
              Queda prohibida su reproducción, distribución o uso fuera del ámbito del servicio sin autorización expresa.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Los datos aportados por el usuario para análisis pertenecen al usuario o a su titular legítimo.
            </p>
          </Section>

          <Section n={5} title="Responsabilidad sobre contenidos">
            <p>
              Anclora Group realiza los esfuerzos razonables para mantener la precisión y actualidad de la plataforma,
              pero no garantiza la exactitud de los modelos predictivos ni de las estimaciones generadas. Anclora Group
              no asume responsabilidad por decisiones tomadas basándose exclusivamente en los outputs del servicio.
            </p>
          </Section>

          <Section n={6} title="Marca Anclora">
            <p>
              Anclora Data Lab forma parte del ecosistema tecnológico de Anclora Group. Las marcas, nombres comerciales
              y logotipos de Anclora son propiedad de Anclora Group y no pueden usarse sin autorización.
            </p>
          </Section>

          <Section n={7} title="Legislación aplicable">
            <p>
              Este aviso legal se rige por la legislación española y de la Unión Europea. Para cualquier controversia
              derivada del uso de la plataforma, las partes se someten a los juzgados y tribunales competentes conforme
              a la normativa aplicable.
            </p>
          </Section>

          <Section n={8} title="Contacto">
            <p>
              Para cualquier cuestión legal, contacta en{' '}
              <a href="mailto:hola@anclora.com" style={{ color: 'var(--dl-brand-emerald)' }}>hola@anclora.com</a>.
            </p>
          </Section>
        </div>

        <div style={{ marginTop: '3rem', padding: '1.25rem 1.5rem', border: '1px solid var(--dl-border-strong)', borderRadius: '12px', background: 'var(--dl-panel)' }}>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--dl-text)' }}>Contacto legal</p>
          <a href="mailto:hola@anclora.com" style={{ color: 'var(--dl-brand-emerald)', display: 'block', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            hola@anclora.com
          </a>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--dl-muted-2)', fontSize: '0.875rem' }}>
            Anclora Data Lab forma parte del ecosistema tecnológico de Anclora Group.
          </p>
        </div>

        <nav style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ padding: '0.5rem 1rem', border: '1px solid var(--dl-border)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--dl-muted)', textDecoration: 'none' }}>Privacidad</Link>
          <Link href="/terms" style={{ padding: '0.5rem 1rem', border: '1px solid var(--dl-border)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--dl-muted)', textDecoration: 'none' }}>Términos</Link>
          <Link href="/" style={{ padding: '0.5rem 1rem', border: '1px solid var(--dl-border-strong)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--dl-brand-emerald)', textDecoration: 'none' }}>← Volver</Link>
        </nav>
      </article>
    </main>
  )
}
