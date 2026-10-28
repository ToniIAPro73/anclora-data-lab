export type IdentityCallbackError = 'exchange' | 'membership_required' | 'retry' | 'unavailable'

export function buildIdentityCallbackErrorUrl(requestUrl: string, error: IdentityCallbackError): URL {
  const destination = new URL('/login', requestUrl)
  destination.searchParams.set('identity_error', error)
  return destination
}
