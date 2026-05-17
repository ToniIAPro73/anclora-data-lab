import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad — Anclora Data Lab',
  description: 'Información sobre el tratamiento de datos personales en Anclora Data Lab.',
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

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--dl-bg)', color: 'var(--dl-text)', padding: '4rem 1.5rem 6rem' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--dl-brand-emerald)', marginBottom: '0.75rem' }}>
            Anclora Data Lab — Legal
          </p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.5rem' }}>
            Política de Privacidad
          </h1>
          <p style={{ color: 'var(--dl-muted-2)', fontSize: '0.875rem', margin: 0 }}>
            Última actualización: mayo de 2026
          </p>
          <div style={{ marginTop: '2rem', height: '1px', background: 'var(--dl-border)' }} />
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Section n={1} title="Responsable del tratamiento">
            <p>
              El responsable del tratamiento de los datos personales es <strong style={{ color: 'var(--dl-text)' }}>Anclora Group</strong>, operador
              de Anclora Data Lab. Puedes contactarnos en{' '}
              <a href="mailto:hola@anclora.com" style={{ color: 'var(--dl-brand-emerald)' }}>hola@anclora.com</a>.
            </p>
          </Section>

          <Section n={2} title="Datos que tratamos">
            <p>Anclora Data Lab puede tratar las siguientes categorías de datos:</p>
            <ul style={{ margin: '0.75rem 0 0 1.25rem', padding: 0, lineHeight: 1.9 }}>
              <li><strong style={{ color: 'var(--dl-text)' }}>Credenciales de acceso:</strong> dirección de correo electrónico y contraseña cifrada necesaria para la autenticación en la plataforma.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Datos de solicitud de acceso:</strong> nombre, organización, caso de uso previsto, aportados voluntariamente al solicitar acceso al workspace.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Datos de uso del workspace:</strong> patrones de consulta, dashboards accedidos, informes generados o exportados, configuraciones de análisis.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Datos de sesión:</strong> tokens de autenticación, timestamp de último acceso, configuraciones de idioma y visualización.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Datos aportados por el usuario:</strong> información que el usuario introduce directamente para análisis o cruce con la plataforma; estos datos siguen siendo propiedad del usuario o de su titular legítimo.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              No se tratan datos especialmente protegidos ni se realizan elaboraciones de perfiles automatizadas con efectos jurídicos.
            </p>
          </Section>

          <Section n={3} title="Finalidades del tratamiento">
            <ul style={{ margin: '0 0 0 1.25rem', padding: 0, lineHeight: 1.9 }}>
              <li>Gestionar el acceso y la autenticación al workspace.</li>
              <li>Prestar el servicio de analítica, inteligencia de mercado y visualización de datos.</li>
              <li>Revisar y gestionar solicitudes de acceso a la plataforma.</li>
              <li>Mantener la seguridad e integridad de la plataforma.</li>
              <li>Mejorar el servicio a partir de datos de uso agregados y anonimizados.</li>
            </ul>
          </Section>

          <Section n={4} title="Base jurídica">
            <p>
              El tratamiento se basa en la <strong style={{ color: 'var(--dl-text)' }}>ejecución del acuerdo de acceso al servicio</strong> (art. 6.1.b RGPD)
              para las finalidades operativas esenciales, y en el <strong style={{ color: 'var(--dl-text)' }}>interés legítimo</strong> (art. 6.1.f RGPD)
              para la seguridad y mejora del servicio. El consentimiento (art. 6.1.a RGPD) aplica para cookies opcionales.
            </p>
          </Section>

          <Section n={5} title="Conservación de los datos">
            <ul style={{ margin: '0 0 0 1.25rem', padding: 0, lineHeight: 1.9 }}>
              <li><strong style={{ color: 'var(--dl-text)' }}>Datos de acceso y sesión:</strong> durante el período de vigencia del acceso y hasta su revocación o solicitud de supresión.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Datos de solicitud:</strong> conservados para auditoría de accesos durante un máximo de 2 años desde la resolución.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Logs técnicos:</strong> eliminados de forma automática transcurrido el período mínimo necesario para la seguridad operativa.</li>
            </ul>
          </Section>

          <Section n={6} title="Destinatarios y cesiones">
            <p>
              No se ceden datos a terceros salvo obligación legal. Los datos pueden ser procesados por proveedores de infraestructura cloud
              actuando como encargados del tratamiento bajo las garantías contractuales pertinentes. No se realizan transferencias
              internacionales conocidas fuera del Espacio Económico Europeo.
            </p>
          </Section>

          <Section n={7} title="Seguridad">
            <p>
              Anclora Data Lab aplica medidas técnicas y organizativas adecuadas al nivel de riesgo, incluyendo comunicaciones cifradas
              mediante HTTPS, gestión de accesos por roles y controles de autenticación. Los datos aportados por el usuario en análisis
              están sujetos a las mismas medidas de seguridad operativa de la plataforma.
            </p>
          </Section>

          <Section n={8} title="Derechos del interesado">
            <p>De acuerdo con el RGPD (UE) 2016/679 y la LOPDGDD, puedes ejercer los siguientes derechos:</p>
            <ul style={{ margin: '0.75rem 0 0 1.25rem', padding: 0, lineHeight: 1.9 }}>
              <li><strong style={{ color: 'var(--dl-text)' }}>Acceso:</strong> obtener confirmación sobre el tratamiento y acceder a tus datos.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Supresión:</strong> solicitar la eliminación cuando los datos ya no sean necesarios.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Portabilidad:</strong> recibir tus datos en formato estructurado y de uso común.</li>
              <li><strong style={{ color: 'var(--dl-text)' }}>Oposición y limitación:</strong> oponerte al tratamiento o solicitar su limitación en los casos previstos por la normativa.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              Envía tu solicitud a <a href="mailto:hola@anclora.com" style={{ color: 'var(--dl-brand-emerald)' }}>hola@anclora.com</a>.
              También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en{' '}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--dl-brand-emerald)' }}>www.aepd.es</a>.
            </p>
          </Section>

          <Section n={9} title="Datos aportados por el usuario: propiedad y responsabilidad">
            <p>
              Los datos e información aportados por el usuario para su análisis en la plataforma siguen perteneciendo al usuario
              o a su titular legítimo. Anclora Data Lab actúa como herramienta de procesamiento y visualización, no como propietario
              de dichos datos. La plataforma, sus modelos analíticos, visualizaciones y plantillas son propiedad de Anclora Group.
            </p>
          </Section>

          <Section n={10} title="Contacto">
            <p>
              Para cualquier cuestión relacionada con el tratamiento de datos personales, contacta en{' '}
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
          <Link href="/terms" style={{ padding: '0.5rem 1rem', border: '1px solid var(--dl-border)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--dl-muted)', textDecoration: 'none' }}>Términos</Link>
          <Link href="/legal" style={{ padding: '0.5rem 1rem', border: '1px solid var(--dl-border)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--dl-muted)', textDecoration: 'none' }}>Aviso legal</Link>
          <Link href="/" style={{ padding: '0.5rem 1rem', border: '1px solid var(--dl-border-strong)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--dl-brand-emerald)', textDecoration: 'none' }}>← Volver</Link>
        </nav>
      </article>
    </main>
  )
}
