export type AvmConfidenceLevel = 'low' | 'medium' | 'high'

export interface AvmComparable {
  id: string
  priceEur: number
  surfaceM2: number
  municipality: string
  source: 'source_observatory' | 'deal_margin'
  transactionDate?: string
}

export interface AvmValuationRequest {
  subject: {
    surfaceM2: number
    municipality?: string
    cadastralReference?: string
  }
  comparables: AvmComparable[]
}

export interface AvmValuationResult {
  estimatedValueEur: number
  confidenceInterval: {
    low: number
    high: number
  }
  confidenceLevel: AvmConfidenceLevel
  explanation?: string
  dataSourcesUsed: string[]
  comparablesUsed: number
}

const MALLORCA_MUNICIPALITIES = new Set([
  'alaro',
  'alcudia',
  'andratx',
  'arta',
  'binissalem',
  'bunyola',
  'calvia',
  'campanet',
  'campos',
  'capdepera',
  'consell',
  'deia',
  'escorca',
  'esporles',
  'estellencs',
  'felanitx',
  'fornalutx',
  'inca',
  'lloret de vistalegre',
  'lloseta',
  'llubi',
  'llucmajor',
  'manacor',
  'mancor de la vall',
  'maria de la salut',
  'marratxi',
  'montuiri',
  'muro',
  'palma',
  'pollenca',
  'porreres',
  'puigpunyent',
  'sa pobla',
  'sant joan',
  'sant llorenc des cardassar',
  'santa eugenia',
  'santa margalida',
  'santa maria del cami',
  'santanyi',
  'selva',
  'sencelles',
  'ses salines',
  'sineu',
  'soller',
  'son servera',
  'valldemossa',
  'vilafranca de bonany',
])

function normalizeMunicipality(value?: string) {
  return value
    ?.normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function isInsideMallorcaBoundary(input: { municipality?: string; cadastralReference?: string }) {
  const municipality = normalizeMunicipality(input.municipality)
  if (municipality && MALLORCA_MUNICIPALITIES.has(municipality)) return true

  const cadastral = input.cadastralReference?.trim()
  if (cadastral && /^07\d{5}/.test(cadastral)) return true

  return false
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function roundEuro(value: number) {
  return Math.round(value)
}

export function estimateMallorcaValue(request: AvmValuationRequest): AvmValuationResult {
  if (!isInsideMallorcaBoundary(request.subject)) {
    throw new Error('AVM_OUTSIDE_MALLORCA_BOUNDARY')
  }

  if (!Number.isFinite(request.subject.surfaceM2) || request.subject.surfaceM2 <= 0) {
    throw new Error('AVM_INVALID_SURFACE')
  }

  const usableComparables = request.comparables.filter(
    (comparable) =>
      comparable.priceEur > 0 &&
      comparable.surfaceM2 > 0 &&
      isInsideMallorcaBoundary({
        municipality: comparable.municipality,
      })
  )

  if (usableComparables.length === 0) {
    return {
      estimatedValueEur: 0,
      confidenceInterval: { low: 0, high: 0 },
      confidenceLevel: 'low',
      explanation: 'No comparable Mallorca transactions were available.',
      dataSourcesUsed: [],
      comparablesUsed: 0,
    }
  }

  const medianPricePerM2 = median(usableComparables.map((comparable) => comparable.priceEur / comparable.surfaceM2))
  const estimatedValueEur = roundEuro(medianPricePerM2 * request.subject.surfaceM2)
  const dataSourcesUsed = [...new Set(usableComparables.map((comparable) => comparable.source))].sort()
  const confidenceLevel: AvmConfidenceLevel =
    usableComparables.length < 10 ? 'low' : usableComparables.length < 25 ? 'medium' : 'high'
  const margin = confidenceLevel === 'low' ? 0.25 : confidenceLevel === 'medium' ? 0.15 : 0.1

  return {
    estimatedValueEur,
    confidenceInterval: {
      low: roundEuro(estimatedValueEur * (1 - margin)),
      high: roundEuro(estimatedValueEur * (1 + margin)),
    },
    confidenceLevel,
    explanation:
      usableComparables.length < 10
        ? 'Confidence is low because fewer than 10 comparable Mallorca transactions were available.'
        : undefined,
    dataSourcesUsed,
    comparablesUsed: usableComparables.length,
  }
}
