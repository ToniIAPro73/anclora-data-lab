export const ANCLORA_IDENTITY_LOGIN_PATH = '/api/auth/anclora-identity/login'

export function getDataLabLoginPath(identityEnabled: boolean): string {
  return identityEnabled ? ANCLORA_IDENTITY_LOGIN_PATH : '/login'
}
