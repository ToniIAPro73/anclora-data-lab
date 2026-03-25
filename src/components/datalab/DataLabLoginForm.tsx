'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  prefillEmail?: string
}

export function DataLabLoginForm({ prefillEmail = '' }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState(prefillEmail)
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
      body: JSON.stringify({ username: email, password }),
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
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="datalab-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="tu-email@dominio.com"
          required
        />
      </div>
      <div className="datalab-field">
        <label htmlFor="password">Contraseña</label>
        <input id="password" className="datalab-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
      </div>
      {error ? <div className="datalab-error">{error}</div> : null}
      <button className="datalab-button" type="submit" disabled={busy}>
        {busy ? 'Abriendo acceso...' : 'Entrar en el workspace'}
      </button>
    </form>
  )
}
