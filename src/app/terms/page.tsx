import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos del Servicio — Anclora Data Lab',
  description: 'Condiciones de uso de la plataforma Anclora Data Lab.',
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

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--dl-bg)', color: 'var(--dl-text)', padding: '4rem 1.5rem 6rem' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--dl-brand-emerald)', marginBottom: '0.75rem' }}>
            Anclora Data Lab — Legal
          </p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.5rem' }}>
            Términos del Servicio
          </h1>
          <p style={{ color: 'var(--dl-muted-2)', fontSize: '0.875rem', margin: 0 }}>
            Última actualización: mayo de 2026
          </p>
          <div style={{ marginTop: '2rem', height: '1px', background: 'var(--dl-border)' }} />
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Section n={1} title="Objeto del servicio">
            <p>
              Anclora Data Lab es una plataforma de analítica, inteligencia de mercado y visualización de datos
              operada por Anclora Group. El acceso al workspace está restringido a usuarios autorizados mediante proceso de solicitud y validación.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Anclora Data Lab forma parte del ecosistema tecnológico de Anclora Group.
            </p>
          </Section>

          <Section n={2} title="Condiciones de uso">
            <ul style={{ margin: '0 0 0 1.25rem', padding: 0, lineHeight: 1.9 }}>
              <li>El acceso es personal e intransferible. No está permitido compartir credenciales.</li>
              <li>El uso de la plataforma está limitado a fines profesionales y analíticos legítimos.</li>
              <li>No está permitida la redistribución de informes, dashboards o datos de la plataforma sin autorización expresa de Anclora Group.</li>
              <li>No está permitido el uso automatizado no autorizado ni el scraping de datos de la plataforma.</li>
            </ul>
          </Section>

          <Section n={3} title="Responsabilidades del usuario">
            <p>El usuario es responsable de:</p>
            <ul style={{ margin: '0.75rem 0 0 1.25rem', padding: 0, lineHeight: 1.9 }}>
              <li>La precisión y licitud de los datos que aporta para análisis en la plataforma.</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>Notificar cualquier uso no autorizado detectado.</li>
              <li>No introducir datos de terceros sin las autorizaciones correspondientes.</li>
            </ul>
          </Section>

          <Section n={4} title="Limitaciones del servicio">
            <p>
              Los resultados, estimaciones y visualizaciones de Anclora Data Lab son de naturaleza analítica e informativa.
              No constituyen asesoramiento financiero, legal, fiscal, de inversión ni de ningún otro tipo regulado.
              Los modelos predictivos tienen limitaciones inherentes y los outputs pueden contener errores o imprecisiones.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              El usuario asume la responsabilidad de validar los resultados antes de tomar decisiones basadas en ellos.
            </p>
          </Section>

          <Section n={5} title="Disponibilidad del servicio">
            <p>
              Anclora Group realiza los esfuerzos razonables para mantener la disponibilidad del servicio, pero no garantiza
              disponibilidad continua. El servicio puede estar sujeto a interrupciones por mantenimiento, actualizaciones o
              causas ajenas a Anclora Group. No se establece ningún SLA salvo acuerdo específico por escrito.
            </p>
          </Section>

          <Section n={6} title="Propiedad intelectual">
            <p>
              La plataforma Anclora Data Lab, incluyendo su código, modelos analíticos, algoritmos, visualizaciones,
              plantillas de informes e interfaz, son propiedad de Anclora Group.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Los datos aportados por el usuario para análisis permanecen bajo la titularidad del usuario o de su titular
              legítimo. Anclora Group no reclama propiedad sobre dichos datos.
            </p>
          </Section>

          <Section n={7} title="Exclusión de garantías">
            <p>
              La plataforma se presta «tal cual» y en la medida de las capacidades técnicas disponibles.
              Anclora Group no garantiza que los resultados analíticos sean exactos, completos o adecuados para
              ningún propósito específico. Los modelos predictivos implican incertidumbre inherente.
            </p>
          </Section>

          <Section n={8} title="Limitación de responsabilidad">
            <p>
              Anclora Group no será responsable de pérdidas económicas, decisiones de negocio, daños directos o indirectos
              derivados del uso de los outputs, informes o visualizaciones de la plataforma. La responsabilidad
              máxima de Anclora Group, en cualquier caso, estará limitada al importe abonado por el usuario en los
              doce meses anteriores al evento que origine la reclamación, salvo dolo o negligencia grave.
            </p>
          </Section>

          <Section n={9} title="Modificaciones del servicio">
            <p>
              Anclora Group se reserva el derecho de modificar, ampliar o discontinuar funcionalidades de la plataforma,
              así como de actualizar estos términos. Los cambios materiales se comunicarán con antelación razonable.
              El uso continuado del servicio tras la notificación implicará la aceptación de los nuevos términos.
            </p>
          </Section>

          <Section n={10} title="Contacto">
            <p>
              Para cuestiones relativas a estos términos, contacta en{' '}
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
          <Link href="/legal" style={{ padding: '0.5rem 1rem', border: '1px solid var(--dl-border)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--dl-muted)', textDecoration: 'none' }}>Aviso legal</Link>
          <Link href="/" style={{ padding: '0.5rem 1rem', border: '1px solid var(--dl-border-strong)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--dl-brand-emerald)', textDecoration: 'none' }}>← Volver</Link>
        </nav>
      </article>
    </main>
  )
}
