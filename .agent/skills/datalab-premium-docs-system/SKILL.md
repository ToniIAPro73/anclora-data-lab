---
name: datalab-premium-docs-system
description: Crear o actualizar documentación pública premium de Anclora Data Lab en `public/docs`, manteniendo el Markdown fuente y generando una versión PDF elegante y coherente con la identidad visual de la aplicación.
---

# Skill: Data Lab Premium Docs System

Crear documentación de `Anclora Data Lab` pensada para usuario final e interlocutores autorizados, con doble salida:

- Markdown editable y mantenible en `public/docs`
- PDF premium listo para descarga pública

## Flujo

1. Revisar el estado real de la app antes de escribir o regenerar documentos.
2. Mantener siempre el Markdown como fuente viva.
3. Convertir el Markdown a HTML premium con el script de la skill.
4. Renderizar el PDF final con Chrome o Edge en modo headless.
5. Hacer que la app enlace siempre al PDF, no al Markdown fuente.

## Entregables esperados

- PDFs premium dentro de `public/docs`
- HTML temporales de render dentro de `.agent/skills/datalab-premium-docs-system/build`

## Recursos

- render Markdown -> HTML: `scripts/render-premium-markdown.mjs`
- render HTML -> PDF: `scripts/render-premium-pdf.ps1`
- build completo de todos los documentos definidos: `scripts/build-premium-docs.ps1`

## Uso recomendado

```powershell
powershell -ExecutionPolicy Bypass -File .agent/skills/datalab-premium-docs-system/scripts/build-premium-docs.ps1
```

## Criterio de cierre

- todos los documentos descargables de la app existen en PDF premium
- el logo de `Anclora Data Lab` aparece en el documento
- el tono visual y editorial es coherente con la aplicación
