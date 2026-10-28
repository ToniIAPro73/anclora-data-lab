# Checklist de validación — Data Lab Identity access recovery (2026-10-28)

**Repositorio:** anclora-data-lab
**Rama:** development
**Validación en development:** Toni confirmó que el cambio está verificado.
**Datos:** no se modificaron datos de aplicación ni secretos.

## 1. Qué cambia

- Los errores del callback de Identity vuelven a una pantalla de Data Lab con
  explicación clara y opción para reintentar, sin exponer códigos OAuth.
- Si la cuenta no tiene membresía `data-lab`, la pantalla enlaza al formulario
  público de solicitud de acceso.
- El formulario público tiene un ancla estable para llevar al usuario a la
  solicitud.
- La autorización sigue denegando el acceso si falta una membresía activa.

## 2. Comprobaciones

| Comprobación | Comando o método | Resultado |
| --- | --- | --- |
| Pruebas focalizadas | `npx vitest run tests/anclora-identity-callback-redirect.test.ts tests/anclora-identity-authorization.test.ts` | PASS; 9 pruebas |
| TypeScript | `npx tsc --noEmit` | PASS |
| ESLint focalizado | Callback, helper, login y formulario afectados | PASS |
| Integridad del diff | `git diff --check` | PASS |
| Visual QA local | `anclora-visual-qa` en estados de membresía, intercambio y reintento, más `/#request-access` | PASS |

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
