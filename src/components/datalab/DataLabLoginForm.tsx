'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  prefillUsername?: string
}

export function DataLabLoginForm({ prefillUsername = '' }: Props) {
  const router = useRouter()
  const [username, setUsername] = useState(prefillUsername)
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)

    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      setError(payload?.error || 'No se ha podido abrir el acceso privado.')
      setBusy(false)
      return
    }

    router.push('/workspace')
    router.refresh()
  }

  return (
    <form className="datalab-form" onSubmit={handleSubmit}>
      <div className="datalab-field">
        <label htmlFor="username">Usuario</label>
        <input id="username" className="datalab-input" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
      </div>
      <div className="datalab-field">
        <label htmlFor="password">Contraseña</label>
        <input id="password" className="datalab-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
      </div>
      {error ? <div className="datalab-error">{error}</div> : null}
      <button className="datalab-button" type="submit" disabled={busy}>
        {busy ? 'Abriendo acceso...' : 'Entrar en Anclora Data Lab'}
      </button>
    </form>
  )
}
