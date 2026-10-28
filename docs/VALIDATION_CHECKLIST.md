# Checklist de validación — acceso QA de Data Lab vía Identity (2026-10-28)

> Este fichero se sobrescribe en cada entrega. El historial queda en Git.

**Repositorio:** anclora-data-lab
**Rama:** development
**Validación en development:** Toni validó este cambio.
**Datos:** la ruta QA evita insertar solicitudes en las tablas operativas de Data Lab.

## 1. Qué cambia

- El scope QA se selecciona solo desde configuración del servidor y se entrega a la ruta QA de Nexus.
- La autorización reconoce el rol QA de Identity; el área de revisión sigue separada.

## 2. Ya comprobado por el agente

| Comprobación | Comando o método | Resultado |
| --- | --- | --- |
| TypeScript | `npx tsc --noEmit` | PASS |
| Pruebas focalizadas | `node --import tsx --test tests/anclora-identity-authorization.test.ts tests/nexus-intake-forward.test.ts` | PASS; 9 pruebas |
| Integridad | `git diff --check` | PASS |
| Revisión de solicitudes previas | Consulta de solo lectura para la identidad QA en Nexus y Data Lab | PASS; ninguna encontrada |

## 3. Pruebas no ejecutadas (NOT_RUN)

| Prueba | Motivo concreto |
| --- | --- |
| Solicitud real, aprobación Nexus, correo y callback Identity | El código local no está desplegado y Vercel denegó acceso a las variables del proyecto. |
| Visual QA del área autenticada desplegada | Pendiente de deployment con este cambio. |

## 4. Checklist para validar en la aplicación

| # | Dónde | Pasos | Resultado esperado | Cuenta o configuración | Bloqueante |
| --- | --- | --- | --- | --- | --- |
| 1 | Data Lab Preview | Solicitar acceso, verificar Nexus, aprobar y abrir Data Lab | Solicitud dentro del scope QA; sesión con rol de solo lectura QA | `tonipmi.test@gmail.com`; revisora QA Nexus | Sí |

### Casos negativos y de borde

- Si falta configuración QA, no se escribe en el almacén operativo de Data Lab.
- Sin membresía Identity válida, el área autenticada no abre.
- El rol QA no obtiene acceso a las funciones de administración/revisión.

## 5. Riesgos y limitaciones

- Vercel devolvió `403` al listar variables; no se configuraron secretos.
- No se leyó Gmail ni se enviaron solicitudes o notificaciones.
- Preview y producción siguen pendientes de la secuencia gobernada.

## 6. Decisión de Toni

- [x] Cambios revisados y validados en development.
- [ ] Todos los puntos bloqueantes del flujo desplegado pasan.
- [ ] Se promociona: escribir `PROMOTE=FULL`.
