# datalab-foundation-v1 · Spec v1

## Objetivo

Levantar el primer repositorio funcional de `Anclora Data Lab` con:

- base SDD
- sistema de agentes
- branding
- landing pública
- login privado
- workspace fundacional
- documentación pública de acceso y roadmap

## Razón de negocio

`Anclora Data Lab` es la única aplicación todavía no implementada dentro del perímetro `Private Estates`. Su fundación debe ser coherente con la promesa ya anunciada desde el Área Privada.

## Requisitos funcionales

1. La app debe existir como repo independiente `anclora-data-lab`.
2. Debe incluir `.agent`, `sdd`, `public/brand` y `public/docs`.
3. Debe usar el logo `logo-anclora-datalab.png`.
4. Debe exponer una home pública con narrativa premium.
5. Debe tener login privado funcional.
6. Debe tener workspace privado inicial.
7. Debe tener acceso basado en usuario bootstrap o JSON.
8. Debe incluir documentación fundacional visible desde `public/docs`.

## Requisitos de UX

- continuidad con `Private Estates`
- tono más institucional y analítico
- paleta derivada del logo
- botones con halo premium

## Fuera de alcance

- SSO corporativo completo
- data ingestion real
- scoring avanzado
- base de datos o backoffice complejos

## Criterios de aceptación

- `npm run lint` pasa
- `npm run test` pasa
- `npm run build` pasa
- el login permite entrar al workspace
- la documentación pública es accesible
