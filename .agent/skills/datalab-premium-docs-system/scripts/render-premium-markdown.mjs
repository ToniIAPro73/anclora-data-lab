import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'

const [,, inputMarkdown, outputHtml, title, subtitle = ''] = process.argv

if (!inputMarkdown || !outputHtml || !title) {
  throw new Error('Usage: node render-premium-markdown.mjs <inputMarkdown> <outputHtml> <title> [subtitle]')
}

const markdownPath = path.resolve(inputMarkdown)
const outputPath = path.resolve(outputHtml)
const logoPath = path.resolve(path.dirname(outputPath), '..', '..', '..', '..', 'public', 'brand', 'logo-anclora-datalab.png')

const markdown = fs.readFileSync(markdownPath, 'utf8')
const content = marked.parse(markdown)
const logoUri = `file:///${logoPath.replace(/\\/g, '/')}`

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
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

    * { box-sizing: border-box; }
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
      padding: 40px;
    }

    .shell {
      max-width: 1040px;
      margin: 0 auto;
      border: 1px solid var(--dl-border);
      border-radius: 34px;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(9, 30, 39, 0.96), rgba(6, 19, 26, 0.98));
      box-shadow: 0 34px 90px var(--dl-shadow);
    }

    .hero {
      padding: 42px 48px 30px;
      border-bottom: 1px solid rgba(113, 236, 245, 0.16);
      background:
        linear-gradient(180deg, rgba(11, 36, 46, 0.98), rgba(7, 23, 30, 0.94));
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
      padding: 32px 48px 44px;
    }

    .content h1, .content h2, .content h3 {
      color: var(--dl-ice);
      line-height: 1.18;
      page-break-after: avoid;
    }

    .content h1 { font-size: 30px; margin: 30px 0 16px; }
    .content h2 { font-size: 24px; margin: 26px 0 14px; }
    .content h3 { font-size: 19px; margin: 22px 0 12px; }

    .content p, .content li {
      color: var(--dl-muted);
      font-size: 15px;
      line-height: 1.78;
    }

    .content ul, .content ol {
      padding-left: 24px;
      margin: 10px 0 18px;
    }

    .content strong { color: var(--dl-ice); }

    .content blockquote {
      margin: 22px 0;
      padding: 18px 22px;
      border-left: 3px solid rgba(136, 242, 248, 0.48);
      background: rgba(9, 31, 40, 0.74);
      border-radius: 18px;
    }

    .content code {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: var(--dl-aqua-soft);
    }

    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 22px 0;
      font-size: 14px;
      overflow: hidden;
      border-radius: 18px;
    }

    .content th, .content td {
      border: 1px solid rgba(100, 226, 235, 0.16);
      padding: 12px 14px;
      vertical-align: top;
    }

    .content th {
      background: rgba(13, 42, 53, 0.92);
      color: var(--dl-ice);
      text-align: left;
    }

    .content td {
      background: rgba(8, 25, 33, 0.9);
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
