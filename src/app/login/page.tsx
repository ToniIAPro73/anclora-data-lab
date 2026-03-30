import { cookies } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { DataLabLoginForm } from '@/components/datalab/DataLabLoginForm'
import { DataLabUiToggles } from '@/components/datalab/DataLabUiToggles'
import { getDataLabSession } from '@/lib/datalab-auth'
import { DATALAB_LOCALE_COOKIE, getDefaultTheme, resolveDataLabLocale } from '@/lib/datalab-ui'

type PageProps = {
  searchParams: Promise<{ email?: string | string[] }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await getDataLabSession()
  if (session) redirect('/workspace')

  const cookieStore = await cookies()
  const defaultLocale = resolveDataLabLocale(cookieStore.get(DATALAB_LOCALE_COOKIE)?.value)
  const defaultTheme = getDefaultTheme()
  const params = await searchParams
  const emailParam = params.email
  const prefillEmail = Array.isArray(emailParam) ? emailParam[0] || '' : emailParam || ''

  return (
    <main className="datalab-login-page">
      <div className="datalab-noise" />
      <section className="datalab-login-shell">
        <article className="datalab-login-card">
          <div className="datalab-brand">
            <div className="datalab-brand-mark">
              <Image src="/brand/logo-anclora-datalab.png" alt="Anclora Data Lab" width={44} height={44} className="datalab-brand-logo" />
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
          <div className="datalab-login-toggle-row">
            <DataLabUiToggles defaultLocale={defaultLocale} defaultTheme={defaultTheme} />
          </div>
          <p className="datalab-eyebrow">Credenciales</p>
          <h1>Abrir workspace.</h1>
          <p className="datalab-copy">
            Este acceso está reservado a usuarios ya aprobados. Entra con el email autorizado y la contraseña asociada a
            tu cuenta de Data Lab para abrir directamente el workspace analítico.
          </p>
          <DataLabLoginForm prefillEmail={prefillEmail} />
        </article>
      </section>
    </main>
  )
}
