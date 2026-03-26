# Anclora Data Lab

Aplicación independiente de inteligencia y activos analíticos para `Anclora Private Estates`.

## Incluye

- landing pública premium
- solicitud pública de acceso
- login privado para perfiles aprobados
- backoffice interno de revisión de accesos
- workspace inicial
- base SDD
- documentación pública

## Entorno

Ver `.env.example`.

Variables mínimas:

- `DATABASE_URL`
- `DATALAB_USER_SESSION_SECRET`
- `DATALAB_ADMIN_USERNAME`
- `DATALAB_ADMIN_PASSWORD`
- `DATALAB_ADMIN_SESSION_SECRET`

Modelo de acceso:

- usuarios finales aprobados: solo cuentas reales creadas en base de datos al aceptar una solicitud
- backoffice interno: credenciales `DATALAB_ADMIN_*`

Rutas relevantes:

- `/` acceso público dual
- `/login` acceso al workspace para usuarios aprobados
- `/access-requests/login` acceso interno al backoffice de revisión
- `/access-requests` consola interna de admisiones

Esquema SQL base:

- `db/datalab_access.sql`

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run build`
