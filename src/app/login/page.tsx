import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DATALAB_BRAND } from '@/lib/datalab-brand'
import { DataLabLoginForm } from '@/components/datalab/DataLabLoginForm'
import { DataLabUiToggles } from '@/components/datalab/DataLabUiToggles'
import { getDataLabSession } from '@/lib/datalab-auth'
import { DATALAB_LOCALE_COOKIE, getDefaultTheme, resolveDataLabLocale } from '@/lib/datalab-ui'
import { getDataLabLoginPath } from '@/lib/anclora-identity/loginRouting'
import { isAncloraIdentityEnabled } from '@/lib/anclora-identity/env'

type PageProps = {
  searchParams: Promise<{ email?: string | string[]; identity_error?: string | string[] }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await getDataLabSession()
  if (session) redirect('/workspace')
  const params = await searchParams
  const identityUnavailable = params.identity_error === 'unavailable'
  const identityMembershipRequired = params.identity_error === 'membership_required'
  const identityExchangeFailed = params.identity_error === 'exchange'
  const identityRetryRequired = params.identity_error === 'retry'
  if (isAncloraIdentityEnabled() && !identityUnavailable && !identityMembershipRequired && !identityExchangeFailed && !identityRetryRequired) redirect(getDataLabLoginPath(true))

  const cookieStore = await cookies()
  const defaultLocale = resolveDataLabLocale(cookieStore.get(DATALAB_LOCALE_COOKIE)?.value)
  const defaultTheme = getDefaultTheme()
  const emailParam = params.email
  const prefillEmail = Array.isArray(emailParam) ? emailParam[0] || '' : emailParam || ''

  return (
    <main className="datalab-login-page">
      <div className="datalab-noise" />
      <section className="datalab-login-shell">
        <article className="datalab-login-card">
          <div className="datalab-brand">
            <div className="datalab-brand-mark">
              <Image src={DATALAB_BRAND.logoPath} alt={DATALAB_BRAND.name} width={44} height={44} className="datalab-brand-logo" />
            </div>
            <div className="datalab-brand-copy">
              <p>{DATALAB_BRAND.name}</p>
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
          {identityUnavailable ? (
            <>
              <p className="datalab-eyebrow">Anclora Identity</p>
              <h1>El acceso no está disponible ahora.</h1>
              <p className="datalab-copy" role="alert">
                No se pudo conectar con Anclora Identity. Espera un momento y vuelve a intentarlo.
              </p>
              <a className="datalab-button datalab-button-link" href="/api/auth/anclora-identity/login">Reintentar inicio de sesión</a>
            </>
          ) : identityMembershipRequired ? (
            <>
              <p className="datalab-eyebrow">Acceso privado</p>
              <h1>Tu acceso aún no está aprobado.</h1>
              <p className="datalab-copy" role="status">
                Has iniciado sesión, pero tu cuenta todavía no tiene acceso a Data Lab. Solicita acceso y te avisaremos cuando esté habilitado.
              </p>
              <Link className="datalab-button datalab-button-link" href="/#request-access">Solicitar acceso a Data Lab</Link>
            </>
          ) : identityExchangeFailed ? (
            <>
              <p className="datalab-eyebrow">Anclora Identity</p>
              <h1>No se pudo completar el acceso.</h1>
              <p className="datalab-copy" role="alert">
                Ha ocurrido un problema temporal al conectar con Data Lab. Vuelve a intentarlo en unos segundos.
              </p>
              <a className="datalab-button datalab-button-link" href="/api/auth/anclora-identity/login">Volver a intentarlo</a>
            </>
          ) : identityRetryRequired ? (
            <>
              <p className="datalab-eyebrow">Anclora Identity</p>
              <h1>Vuelve a iniciar sesión.</h1>
              <p className="datalab-copy" role="alert">
                No hemos podido confirmar tu sesión segura. Inicia sesión de nuevo para continuar.
              </p>
              <a className="datalab-button datalab-button-link" href="/api/auth/anclora-identity/login">Iniciar sesión de nuevo</a>
            </>
          ) : (
            <>
              <p className="datalab-eyebrow">Credenciales</p>
              <h1>Abrir workspace.</h1>
              <p className="datalab-copy">
                Este acceso está reservado a usuarios ya aprobados. Entra con el email autorizado y la contraseña asociada a
                tu cuenta de Data Lab para abrir directamente el workspace analítico.
              </p>
              <DataLabLoginForm prefillEmail={prefillEmail} />
            </>
          )}
        </article>
      </section>
    </main>
  )
}
