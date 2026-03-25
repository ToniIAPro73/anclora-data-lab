import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'

function decodeArg(value = '') {
  if (value.startsWith('base64:')) {
    return Buffer.from(value.slice('base64:'.length), 'base64').toString('utf8')
  }
  return value
}

function escapeHtml(text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function hasMojibake(text = '') {
  return /Ã.|Â[^\s]|â€[^\s]?|â€”|â€“|â€¦|�/u.test(text)
}

function repairMojibake(text = '') {
  let repaired = text

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (!hasMojibake(repaired)) {
      break
    }

    try {
      repaired = Buffer.from(repaired, 'latin1').toString('utf8')
    } catch {
      break
    }
  }

  return repaired
}

function stripInlineReferences(text = '') {
  return text
    .replace(/【\d+†L\d+(?:-L?\d+)?】/gu, '')
    .replace(/\[\d+†L\d+(?:-L?\d+)?\]/gu, '')
    .replace(/【\d+†[^\]】]+】/gu, '')
    .replace(/\[\d+†[^\]]*\]/gu, '')
    .replace(/(?<=[.:;)])\d{1,2}(?=\s|$)/gu, '')
    .replace(/[^\S\r\n]{2,}/g, ' ')
    .replace(/\s+([,.;:!?)])/g, '$1')
}

function cleanSourceLabel(text = '') {
  return repairMojibake(stripInlineReferences(text))
    .replace(/\[[^\]]+]\([^)]+\)/g, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/,\s*fecha de acceso:.*$/i, '')
    .replace(/\s+-\s+Documents?\s*&\s*Reports?/i, '')
    .replace(/\s+-\s+.*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/[.;:,]+$/g, '')
}

function extractNumberedSources(markdown = '') {
  const sources = []
  const lines = markdown.split(/\r?\n/)
  const keptLines = []

  for (const line of lines) {
    const referenceMatch = line.match(/^\s*\d+\.\s+(.*)$/)
    const imageRefMatch = line.match(/^\s*\[image\d+]:/i)

    if (imageRefMatch) {
      continue
    }

    if (referenceMatch) {
      const label = cleanSourceLabel(referenceMatch[1])
      if (label) {
        sources.push(label)
      }
      continue
    }

    if (/^\s*!\[\]\[image\d+]\s*$/i.test(line)) {
      continue
    }

    keptLines.push(line)
  }

  return {
    markdown: keptLines.join('\n'),
    sources,
  }
}

function rewriteInlineSourcesSection(markdown = '') {
  const match = markdown.match(/^\*\*Fuentes:\*\*\s*(.+)$/im)
  if (!match) {
    return { markdown, sources: [] }
  }

  const sources = match[1]
    .split(/\s*;\s*/g)
    .map(cleanSourceLabel)
    .filter(Boolean)

  return {
    markdown: markdown.replace(/^\*\*Fuentes:\*\*.*$/im, '').trimEnd(),
    sources,
  }
}

function dedupeSources(sources = []) {
  const seen = new Set()
  const deduped = []

  for (const source of sources) {
    const key = source.toLocaleLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(source)
    }
  }

  return deduped
}

function normalizeMarkdown(markdown = '') {
  let normalized = repairMojibake(markdown)
    .replace(/\r\n/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')

  const numberedSources = extractNumberedSources(normalized)
  normalized = numberedSources.markdown

  const inlineSources = rewriteInlineSourcesSection(normalized)
  normalized = inlineSources.markdown

  normalized = stripInlineReferences(normalized)
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const sources = dedupeSources([...numberedSources.sources, ...inlineSources.sources])

  if (sources.length > 0) {
    normalized += `\n\n## Fuentes\n\n${sources.map((source) => `<div class="source-line">· ${escapeHtml(source)}</div>`).join('\n')}\n`
  }

  return normalized
}

function enhanceTables(html = '') {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (tableHtml) => {
    const headerMatches = tableHtml.match(/<th\b/gi) ?? []
    const columnCount = headerMatches.length
    const compactClass =
      columnCount >= 7 ? ' table-compact table-ultra-compact'
      : columnCount >= 6 ? ' table-compact'
      : ''

    return `<div class="table-shell${compactClass}" data-columns="${columnCount}">${tableHtml}</div>`
  })
}

const [,, inputMarkdown, outputHtml, rawTitle, rawSubtitle = ''] = process.argv
const title = repairMojibake(decodeArg(rawTitle))
const subtitle = repairMojibake(decodeArg(rawSubtitle))

if (!inputMarkdown || !outputHtml || !title) {
  throw new Error('Usage: node render-premium-markdown.mjs <inputMarkdown> <outputHtml> <title> [subtitle]')
}

const markdownPath = path.resolve(inputMarkdown)
const outputPath = path.resolve(outputHtml)
const logoPath = path.resolve(path.dirname(outputPath), '..', '..', '..', '..', 'public', 'brand', 'logo-anclora-datalab.png')

function readMarkdownText(filePath) {
  const buffer = fs.readFileSync(filePath)
  const utf8Decoder = new TextDecoder('utf-8', { fatal: true })
  const windows1252Decoder = new TextDecoder('windows-1252')

  try {
    return utf8Decoder.decode(buffer)
  } catch {
    return windows1252Decoder.decode(buffer)
  }
}

const markdown = normalizeMarkdown(readMarkdownText(markdownPath))
const content = enhanceTables(marked.parse(markdown))
const logoUri = `file:///${logoPath.replace(/\\/g, '/')}`

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    @page {
      margin: 20mm 14mm 20mm;
      size: A4;
    }

    :root {
      --dl-bg: #07131a;
      --dl-bg-soft: #0d232d;
      --dl-panel: rgba(10, 33, 43, 0.94);
      --dl-border: rgba(86, 229, 240, 0.22);
      --dl-text: #eefcff;
      --dl-muted: rgba(216, 241, 245, 0.78);
      --dl-aqua: #5fd9e2;
      --dl-aqua-soft: #b6f4f8;
      --dl-ice: #f4fdff;
      --dl-shadow: rgba(2, 8, 12, 0.35);
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    html, body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      margin: 0;
      color: var(--dl-text);
      font-family: Georgia, 'Times New Roman', serif;
      background:
        radial-gradient(circle at top left, rgba(61, 181, 191, 0.26), transparent 26%),
        linear-gradient(180deg, #02070b 0%, #07141a 54%, #081a21 100%);
    }

    .page {
      width: 100%;
      min-height: 100vh;
      padding: 0;
    }

    .shell {
      width: 100%;
      max-width: none;
      margin: 0;
      border: 1px solid var(--dl-border);
      border-radius: 34px;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(9, 30, 39, 0.96), rgba(6, 19, 26, 0.98));
      box-shadow: 0 34px 90px var(--dl-shadow);
    }

    .hero {
      padding: 34px 34px 26px;
      border-bottom: 1px solid rgba(113, 236, 245, 0.16);
      background:
        linear-gradient(180deg, rgba(11, 36, 46, 0.98), rgba(7, 23, 30, 0.94));
      break-inside: avoid-page;
      page-break-inside: avoid;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 22px;
    }

    .brand img {
      width: 62px;
      height: 62px;
      object-fit: contain;
      filter: drop-shadow(0 12px 22px rgba(5, 24, 31, 0.32));
    }

    .eyebrow {
      margin: 0 0 10px;
      color: var(--dl-aqua-soft);
      text-transform: uppercase;
      letter-spacing: 0.28rem;
      font-size: 12px;
    }

    h1 {
      margin: 0;
      font-size: 40px;
      line-height: 1.06;
      color: var(--dl-ice);
    }

    .subtitle {
      margin-top: 14px;
      max-width: 760px;
      color: var(--dl-muted);
      font-size: 18px;
      line-height: 1.7;
    }

    .content {
      padding: 28px 34px 38px;
    }

    .content h1, .content h2, .content h3 {
      color: var(--dl-ice);
      line-height: 1.18;
      page-break-after: avoid;
      break-after: avoid-page;
      page-break-inside: avoid;
      break-inside: avoid-page;
    }

    .content h1 { font-size: 30px; margin: 30px 0 16px; }
    .content h2 { font-size: 24px; margin: 26px 0 14px; }
    .content h3 { font-size: 19px; margin: 22px 0 12px; }

    .content p, .content li {
      color: var(--dl-muted);
      font-size: 15px;
      line-height: 1.78;
      text-align: justify;
      text-justify: inter-word;
      orphans: 3;
      widows: 3;
    }

    .content ul, .content ol {
      padding-left: 24px;
      margin: 10px 0 18px;
      break-inside: avoid-page;
      page-break-inside: avoid;
    }

    .content h2 + p,
    .content h3 + p {
      page-break-before: avoid;
      break-before: avoid-page;
    }

    .content strong { color: var(--dl-ice); }

    .content blockquote {
      margin: 22px 0;
      padding: 18px 22px;
      border-left: 3px solid rgba(136, 242, 248, 0.48);
      background: rgba(9, 31, 40, 0.74);
      border-radius: 18px;
      break-inside: avoid-page;
      page-break-inside: avoid;
    }

    .content code {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: var(--dl-aqua-soft);
    }

    .content pre {
      break-inside: avoid-page;
      page-break-inside: avoid;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .table-shell {
      width: 100%;
      margin: 22px 0;
      break-inside: avoid-page;
      page-break-inside: avoid;
    }

    .content table {
      width: 100%;
      max-width: 100%;
      border-collapse: collapse;
      margin: 0;
      font-size: 13px;
      table-layout: fixed;
      overflow: hidden;
      border-radius: 18px;
      break-inside: avoid-page;
      page-break-inside: avoid;
    }

    .content thead {
      display: table-header-group;
    }

    .content tfoot {
      display: table-footer-group;
    }

    .content th, .content td {
      border: 1px solid rgba(100, 226, 235, 0.16);
      padding: 10px 12px;
      vertical-align: top;
      break-inside: avoid-page;
      page-break-inside: avoid;
      overflow-wrap: anywhere;
      word-break: break-word;
      hyphens: auto;
    }

    .content th {
      background: rgba(13, 42, 53, 0.92);
      color: var(--dl-ice);
      text-align: left;
    }

    .content td {
      background: rgba(8, 25, 33, 0.9);
      text-align: justify;
      text-justify: inter-word;
    }

    .table-shell.table-compact table {
      font-size: 11.5px;
    }

    .table-shell.table-compact th,
    .table-shell.table-compact td {
      padding: 8px 9px;
    }

    .table-shell.table-ultra-compact table {
      font-size: 10.5px;
    }

    .table-shell.table-ultra-compact th,
    .table-shell.table-ultra-compact td {
      padding: 7px 8px;
    }

    .content tr,
    .content img,
    .content svg,
    .content figure,
    .content tbody,
    .content .source-line,
    .content ul li,
    .content ol li {
      break-inside: avoid-page;
      page-break-inside: avoid;
    }

    .content .source-line {
      color: var(--dl-muted);
      font-size: 15px;
      line-height: 1.72;
      text-align: left;
      margin: 0 0 6px;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="shell">
      <section class="hero">
        <div class="brand">
          <img src="${logoUri}" alt="Anclora Data Lab" />
          <div>
            <p class="eyebrow">Anclora Data Lab</p>
            <p class="eyebrow" style="letter-spacing:.18rem;opacity:.82;">Inteligencia institucional aplicada a Anclora Private Estates</p>
          </div>
        </div>
        <h1>${title}</h1>
        ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
      </section>
      <section class="content">
        ${content}
      </section>
    </div>
  </div>
</body>
</html>`

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, html, 'utf8')
