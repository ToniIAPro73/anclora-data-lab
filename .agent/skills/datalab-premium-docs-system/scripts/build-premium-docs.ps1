param()

$ErrorActionPreference = 'Stop'
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [Console]::OutputEncoding

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\..\..'))
$buildDir = Join-Path $repoRoot '.agent\skills\datalab-premium-docs-system\build'
$renderer = Join-Path $PSScriptRoot 'render-premium-markdown.mjs'
$pdfRenderer = Join-Path $PSScriptRoot 'render-premium-pdf.ps1'

if (-not (Test-Path $buildDir)) {
  New-Item -ItemType Directory -Path $buildDir | Out-Null
}

$docs = @(
  @{
    Source = 'public/docs/Anclora_Data_Lab_doc_maestro_especificaciones.md'
    Html = '.agent/skills/datalab-premium-docs-system/build/Anclora_Data_Lab_doc_maestro_especificaciones.html'
    Pdf = 'public/docs/Anclora_Data_Lab_doc_maestro_especificaciones.pdf'
    Title = 'Documento maestro de especificaciones'
    Subtitle = 'Arquitectura estratégica y técnica de Anclora Data Lab dentro del ecosistema Anclora Group.'
  },
  @{
    Source = 'public/docs/deep-research-report.md'
    Html = '.agent/skills/datalab-premium-docs-system/build/deep-research-report.html'
    Pdf = 'public/docs/deep-research-report.pdf'
    Title = 'Deep Research Report'
    Subtitle = 'Síntesis premium de investigación sobre posicionamiento, oportunidad y alcance de producto para Data Lab.'
  },
  @{
    Source = 'public/docs/Especificaciones para Anclora Data Lab.md'
    Html = '.agent/skills/datalab-premium-docs-system/build/Especificaciones_para_Anclora_Data_Lab.html'
    Pdf = 'public/docs/Especificaciones_para_Anclora_Data_Lab.pdf'
    Title = 'Especificaciones iniciales de Anclora Data Lab'
    Subtitle = 'Documento de arranque con visión funcional, requisitos técnicos y tesis de valor para la plataforma.'
  },
  @{
    Source = 'public/docs/anclora-data-lab-foundation-v1-spec.md'
    Html = '.agent/skills/datalab-premium-docs-system/build/anclora-data-lab-foundation-v1-spec.html'
    Pdf = 'public/docs/anclora-data-lab-foundation-v1-spec.pdf'
    Title = 'Foundation v1 · Anclora Data Lab'
    Subtitle = 'Primera especificación pública de la app fundacional, su promesa y su estructura inicial.'
  },
  @{
    Source = 'public/docs/anclora-data-lab-roadmap-v1.md'
    Html = '.agent/skills/datalab-premium-docs-system/build/anclora-data-lab-roadmap-v1.html'
    Pdf = 'public/docs/anclora-data-lab-roadmap-v1.pdf'
    Title = 'Roadmap v1 · Anclora Data Lab'
    Subtitle = 'Secuencia de evolución del laboratorio analítico desde la foundation hasta las siguientes capas de producto.'
  },
  @{
    Source = 'public/docs/anclora-data-lab-access-architecture-v1.md'
    Html = '.agent/skills/datalab-premium-docs-system/build/anclora-data-lab-access-architecture-v1.html'
    Pdf = 'public/docs/anclora-data-lab-access-architecture-v1.pdf'
    Title = 'Arquitectura de acceso v1 · Anclora Data Lab'
    Subtitle = 'Definición de posicionamiento, relación con Private Estates y capas iniciales de acceso selectivo.'
  }
)

foreach ($doc in $docs) {
  $sourcePath = Join-Path $repoRoot $doc.Source
  $htmlPath = Join-Path $repoRoot $doc.Html
  $pdfPath = Join-Path $repoRoot $doc.Pdf
  $titleArg = 'base64:' + [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($doc.Title))
  $subtitleArg = 'base64:' + [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($doc.Subtitle))

  & node $renderer $sourcePath $htmlPath $titleArg $subtitleArg
  if ($LASTEXITCODE -ne 0) {
    throw "Markdown renderer failed for $($doc.Source)"
  }

  & powershell -ExecutionPolicy Bypass -File $pdfRenderer -InputHtml $htmlPath -OutputPdf $pdfPath
  if ($LASTEXITCODE -ne 0) {
    throw "PDF renderer failed for $($doc.Pdf)"
  }
}
