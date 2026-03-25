export type DataLabRole =
  | 'datalab-admin'
  | 'market-analyst'
  | 'investment-advisory'
  | 'partner-intelligence'
  | 'investor-viewer'

export type DataLabUserRecord = {
  username: string
  password: string
  displayName: string
  role: DataLabRole
}

export type DataLabInsight = {
  title: string
  summary: string
  signal: string
  action: string
}

export type DataLabZone = {
  name: string
  thesis: string
  priceBand: string
  momentum: string
  focus: string
}

export type DataLabDocument = {
  title: string
  category: string
  summary: string
  href: string
}

export const roleLabels: Record<DataLabRole, string> = {
  'datalab-admin': 'Administrador Data Lab',
  'market-analyst': 'Analista de mercado',
  'investment-advisory': 'Investment advisory',
  'partner-intelligence': 'Partner intelligence',
  'investor-viewer': 'Investor viewer',
}

export const heroMetrics = [
  {
    value: '3',
    label: 'islas foco',
    description: 'Mallorca, Ibiza y Menorca como núcleo de lectura premium para capital selectivo.',
  },
  {
    value: '6',
    label: 'módulos iniciales',
    description: 'Radar, señales, documentación curada, alertas, packs y workspace con acceso selectivo.',
  },
  {
    value: '24/7',
    label: 'capa analítica',
    description: 'Contexto operativo siempre disponible para partners, clientes e inversores autorizados.',
  },
]

export const mvpModules = [
  {
    title: 'Radar institucional',
    body: 'Lectura territorial de mercado, pricing y momentum para detectar desequilibrios antes del mercado abierto.',
  },
  {
    title: 'Señales territoriales',
    body: 'Indicadores curados de presión de demanda, narrativa regulatoria, escasez premium y activación off-market.',
  },
  {
    title: 'Biblioteca curada',
    body: 'Informes, notas ejecutivas, normativa y piezas de inteligencia listas para consumo premium y toma de decisión.',
  },
  {
    title: 'Packs analíticos privados',
    body: 'Entregables diseñados para clientes, partners e inversores con permisos selectivos y trazabilidad de acceso.',
  },
]

export const zones: DataLabZone[] = [
  {
    name: 'Palma Prime',
    thesis: 'Mercado de reposicionamiento premium con mezcla de comprador internacional y demanda corporativa.',
    priceBand: '€11.000 - €18.500 / m²',
    momentum: 'Fuerte',
    focus: 'Reposicionamiento urbano, activos singulares y flujos patrimoniales.',
  },
  {
    name: 'Southwest Mallorca',
    thesis: 'Tensión de oferta en primera línea y consolidación de valor refugio para family office y capital recurrente.',
    priceBand: '€14.000 - €25.000 / m²',
    momentum: 'Muy fuerte',
    focus: 'Activos trophy, residencial resort y escasez estructural.',
  },
  {
    name: 'Ibiza Signature Belt',
    thesis: 'Mercado altamente ilíquido y narrativo, donde la señal de timing pesa más que la amplitud de comparables.',
    priceBand: '€17.500 - €32.000 / m²',
    momentum: 'Selectivo',
    focus: 'Off-market, presión internacional y prima de privacidad.',
  },
]

export const signals: DataLabInsight[] = [
  {
    title: 'Compresión silenciosa en producto prime',
    summary: 'El producto de alta calidad reduce tiempo efectivo de decisión incluso cuando la demanda visible parece más lenta.',
    signal: 'Oferta profunda limitada y absorción por capital paciente.',
    action: 'Priorizar alertas tempranas y dossieres de preadquisición.',
  },
  {
    title: 'Narrativa regulatoria como filtro de valor',
    summary: 'La interpretación regulatoria ya está afectando primas de ciertas microzonas en Baleares.',
    signal: 'Diferencial creciente entre activo premium compliant y producto con fricción normativa.',
    action: 'Añadir capa de contexto normativo a cada pack de inversión.',
  },
  {
    title: 'Señal territorial previa a pricing abierto',
    summary: 'En segmentos muy ilíquidos, los desplazamientos de narrativa local preceden al movimiento explícito de precio.',
    signal: 'Interacción entre demanda internacional, stock restringido y rotación privada.',
    action: 'Monitorizar zonas con baja visibilidad pero alta convicción patrimonial.',
  },
]

export const curatedDocuments: DataLabDocument[] = [
  {
    title: 'Documento maestro de especificaciones',
    category: 'Foundational Research',
    summary: 'Arquitectura completa del producto, alcance funcional, hipótesis y visión de plataforma.',
    href: '/docs/Anclora_Data_Lab_doc_maestro_especificaciones.md',
  },
  {
    title: 'Deep Research Report',
    category: 'Market Intelligence',
    summary: 'Investigación estructurada sobre posicionamiento, valor diferencial y oportunidades de producto.',
    href: '/docs/deep-research-report.md',
  },
  {
    title: 'Especificaciones iniciales',
    category: 'Product Design',
    summary: 'Documento de arranque con visión de módulos, perfiles de acceso y narrativa para la experiencia premium.',
    href: '/docs/Especificaciones para Anclora Data Lab.md',
  },
  {
    title: 'Feature Foundation v1',
    category: 'SDD',
    summary: 'Spec operativa de la primera versión funcional del repositorio Anclora Data Lab.',
    href: '/docs/anclora-data-lab-foundation-v1-spec.md',
  },
]

export const workspacePacks = [
  {
    title: 'Pack Balearic Luxury Snapshot',
    audience: 'Partners e inversores autorizados',
    status: 'Disponible',
    notes: 'Síntesis ejecutiva con pricing, narrativa territorial y focos de convicción patrimonial.',
  },
  {
    title: 'Pack Coastal Regulation Watch',
    audience: 'Equipo interno y advisory',
    status: 'En revisión',
    notes: 'Seguimiento de señales normativas y lectura de impacto sobre producto premium y reposicionamiento.',
  },
]

export const workspaceAlerts = [
  {
    title: 'Alerta de absorción en Palma Prime',
    when: 'Hoy · 08:40',
    summary: 'Nueva señal de compresión en producto turnkey premium con demanda internacional activa.',
  },
  {
    title: 'Cambio narrativo en costa suroeste',
    when: 'Ayer · 17:15',
    summary: 'Contexto territorial actualizado sobre escasez estructural, presión de demanda y timing comercial.',
  },
]

export function getDataLabUsers(): DataLabUserRecord[] {
  const raw = process.env.ANCLORA_DATALAB_USERS_JSON?.trim()
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as DataLabUserRecord[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {
      // fall through
    }
  }

  return [
    {
      username: process.env.ANCLORA_DATALAB_BOOTSTRAP_USERNAME?.trim() || 'antonio',
      password: process.env.ANCLORA_DATALAB_BOOTSTRAP_PASSWORD?.trim() || 'AncloraDataLab123!',
      displayName: process.env.ANCLORA_DATALAB_BOOTSTRAP_DISPLAY_NAME?.trim() || 'Antonio',
      role: (process.env.ANCLORA_DATALAB_BOOTSTRAP_ROLE?.trim() as DataLabRole) || 'datalab-admin',
    },
  ]
}
