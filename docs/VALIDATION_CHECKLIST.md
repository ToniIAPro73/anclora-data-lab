# Checklist de validación — Data Lab Identity login reliability (2026-10-28)

**Repositorio:** anclora-data-lab
**Rama:** development
**Validación en development:** Toni confirmó que el cambio está verificado.
**Datos:** no se modificaron datos de aplicación ni secretos.

## 1. Qué cambia

- El descubrimiento OIDC queda limitado a 8 segundos.
- Si falla la inicialización del login de Anclora Identity, Data Lab vuelve a
  una pantalla propia con explicación y opción para reintentar.
- Identity continúa siendo el único login cuando está habilitado; no hay
  fallback silencioso a contraseña local.

## 2. Comprobaciones

| Comprobación | Comando o método | Resultado |
| --- | --- | --- |
| TypeScript | `npx tsc --noEmit` | PASS |
| ESLint focalizado | Archivos de login y cliente OIDC afectados | PASS |
| Integridad del diff | `git diff --check` y `git diff --cached --check` | PASS |
| Reproducción de Production | HTTP a `/login` y endpoint OIDC | `/login` redirigía; endpoint OIDC quedó pendiente hasta timeout |
| Visual QA tras el cambio | Pendiente de publicación del SHA | NOT_RUN |
| Suite de tests | No ejecutada | No solicitada; verificación focalizada suficiente para revisión de código |

## 3. Revisión de Toni

| # | Dónde | Resultado |
| --- | --- | --- |
| 1 | development | Validado por Toni antes del commit y push |
| 2 | Preview | Pendiente tras el deployment del commit |
| 3 | Production | Pendiente del flujo de promoción gobernado |

## 4. Promoción

- [x] Validado en development
- [ ] Validado en Preview
- [ ] `PROMOTE=FULL`
- [ ] Promoción completa. Pendiente de revisión de Preview y autorización expresa.
