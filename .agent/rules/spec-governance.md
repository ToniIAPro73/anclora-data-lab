# Spec Governance

## Propósito
Este documento define cómo se crean, revisan y evolucionan las especificaciones SDD para `Anclora Group`.

## Principios

- La SDD es la fuente de verdad funcional y documental para el portal interno.
- Ninguna feature debe considerarse lista sin trazabilidad entre objetivo, requisitos y pruebas.
- Las especificaciones deben reflejar una arquitectura corporativa, modular y segura.
- Los documentos deben ser claros, versionados y fáciles de auditar.

## Convenciones de documentación

- `sdd/README.md` describe el sistema documental y el flujo de trabajo.
- `sdd/core/product-spec-v0.md` define la visión y el alcance del producto.
- `sdd/core/spec-core-v1.md` fija la base arquitectónica y de gobernanza.
- Cada feature vive en `sdd/features/<feature-id>/`.
- Cada feature debe incluir como mínimo:
  - `*-spec-v1.md`
  - `test-plan.md`

## Ciclo de vida de una spec

1. `draft`
1. `review`
1. `approved`
1. `implemented`
1. `retired`

## Reglas de cambio

- Un cambio de alcance exige actualizar el spec afectado y su plan de pruebas.
- Los cambios de arquitectura deben reflejarse en el core spec.
- Si una decisión afecta a varios módulos, debe registrarse en el producto y no solo en la feature.
- Las decisiones revertibles deben documentarse como supuestos, no como hechos cerrados.

## Trazabilidad requerida

- Cada requisito funcional debe tener criterio de aceptación.
- Cada criterio de aceptación debe tener al menos un caso de prueba asociado.
- Cada feature debe indicar dependencias y no objetivos.
- Las referencias cruzadas entre docs deben usar identificadores estables.

## Criterios de calidad

- Consistencia terminológica.
- Alcance acotado por versión.
- Lenguaje operativo, no aspiracional.
- Separación explícita entre decisión, supuesto y recomendación.

