import Image from 'next/image'
import { redirect } from 'next/navigation'
import { DataLabLoginForm } from '@/components/datalab/DataLabLoginForm'
import { getDataLabSession } from '@/lib/datalab-auth'

export default async function LoginPage() {
  const session = await getDataLabSession()
  if (session) redirect('/workspace')

  return (
    <main className="datalab-login-page">
      <div className="datalab-noise" />
      <section className="datalab-login-shell">
        <article className="datalab-login-card">
          <div className="datalab-brand">
            <div className="datalab-brand-mark">
              <Image src="/brand/logo-anclora-datalab.png" alt="Anclora Data Lab" width={44} height={44} />
            </div>
            <div className="datalab-brand-copy">
              <p>Anclora Data Lab</p>
              <span>Plataforma de inteligencia y activos analíticos de Anclora Private Estates.</span>
            </div>
          </div>
          <p className="datalab-eyebrow" style={{ marginTop: 28 }}>Acceso privado</p>
          <h1>Entrar en la sala analítica.</h1>
          <p className="datalab-lead">
            Este acceso está reservado a equipo interno, partners autorizados y perfiles de capital con visibilidad
            selectiva sobre señales, documentos y entregables premium.
          </p>
          <p className="datalab-copy">
            La experiencia está diseñada para mantener continuidad con Anclora Private Estates, pero con una cadencia más
            institucional, reservada y operativa.
          </p>
        </article>

        <article className="datalab-login-card">
          <p className="datalab-eyebrow">Credenciales</p>
          <h1>Abrir workspace.</h1>
          <p className="datalab-copy">
            Usa tus credenciales de acceso a Data Lab. Si todavía no tienes acceso, la activación se gestiona desde el
            circuito interno de Private Estates.
          </p>
          <DataLabLoginForm />
        </article>
      </section>
    </main>
  )
}
