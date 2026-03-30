import type { DataLabLocale } from '@/lib/datalab-ui'

type ReviewStatus = 'all' | 'submitted' | 'under_review' | 'accepted' | 'rejected'

type LocaleCopy = {
  labels: {
    reviewInternalAccess: string
    brandName: string
    backofficeAdmissions: string
    accessControl: string
    total: string
    pending: string
    queue: string
    detail: string
    email: string
    organization: string
    profile: string
    status: string
    usageContext: string
    roleToGrant: string
    lastReview: string
    initialCredentials: string
    temporaryPassword: string
    launchRoute: string
    pendingOrDecision: string
    loadedRequests: string
  }
  review: {
    title: string
    lead: string
    searchPlaceholder: string
    loading: string
    noItems: string
    selectOne: string
    noIndicated: string
    notIndicated: string
    notReviewed: string
    reviewNotesPlaceholder: string
    decisionReasonPlaceholder: string
    closeSession: string
    saveInReview: string
    saving: string
    reject: string
    accepting: string
    acceptAndCreate: string
    acceptedNotice: string
    rejectedNotice: string
    inReviewNotice: string
    loadError: string
    updateError: string
    receivedAdmissions: string
  }
  login: {
    backToGroup: string
    subtitle: string
    eyebrow: string
    title: string
    copy: string
    usernamePlaceholder: string
    passwordPlaceholder: string
    busy: string
    submit: string
    openError: string
  }
  statuses: Record<ReviewStatus, string>
  rawStatuses: Record<'submitted' | 'under_review' | 'accepted' | 'rejected', string>
  generic: {
    unavailable: string
  }
}

export const datalabAdminCopy: Record<DataLabLocale, LocaleCopy> = {
  es: {
    labels: {
      reviewInternalAccess: 'Revisión interna de accesos',
      brandName: 'Anclora Data Lab',
      backofficeAdmissions: 'Backoffice de admisiones y accesos.',
      accessControl: 'Control de accesos',
      total: 'Total',
      pending: 'Pendientes',
      queue: 'Cola de solicitudes',
      detail: 'Detalle de solicitud',
      email: 'Email',
      organization: 'Organización',
      profile: 'Perfil',
      status: 'Estado',
      usageContext: 'Contexto de uso',
      roleToGrant: 'Rol a conceder',
      lastReview: 'Última revisión',
      initialCredentials: 'Credenciales iniciales',
      temporaryPassword: 'Password temporal',
      launchRoute: 'Ruta de acceso',
      pendingOrDecision: 'Requieren revisión o decisión.',
      loadedRequests: 'Solicitudes cargadas.',
    },
    review: {
      title: 'Solicitudes, validación y activación interna.',
      lead: 'Esta consola permite revisar las solicitudes procedentes de la entrada pública de Data Lab y decidir qué perfiles reciben acceso real al workspace.',
      searchPlaceholder: 'Buscar por nombre, email u organización',
      loading: 'Cargando solicitudes...',
      noItems: 'No hay solicitudes para este filtro.',
      selectOne: 'Selecciona una solicitud para revisar el detalle.',
      noIndicated: 'No indicada',
      notIndicated: 'No indicado',
      notReviewed: 'Sin revisar',
      reviewNotesPlaceholder: 'Notas internas de revisión',
      decisionReasonPlaceholder: 'Motivo o criterio de decisión',
      closeSession: 'Cerrar sesión',
      saveInReview: 'Marcar en revisión',
      saving: 'Guardando...',
      reject: 'Rechazar',
      accepting: 'Activando...',
      acceptAndCreate: 'Aceptar y crear acceso',
      acceptedNotice: 'Solicitud aceptada. Las credenciales iniciales ya están preparadas.',
      rejectedNotice: 'Solicitud rechazada y registrada correctamente.',
      inReviewNotice: 'Solicitud marcada como en revisión.',
      loadError: 'No se han podido cargar las solicitudes.',
      updateError: 'No se ha podido actualizar la solicitud.',
      receivedAdmissions: 'Admisiones recibidas.',
    },
    login: {
      backToGroup: 'Volver a Anclora Group',
      subtitle: 'Admisiones internas y control de accesos.',
      eyebrow: 'Acceso interno',
      title: 'Entrar en revisión de solicitudes.',
      copy: 'Este acceso está reservado al equipo interno que valida solicitudes, aprueba o rechaza accesos y habilita las credenciales operativas de Data Lab.',
      usernamePlaceholder: 'Usuario interno',
      passwordPlaceholder: 'Contraseña interna',
      busy: 'Abriendo backoffice...',
      submit: 'Entrar en revisión',
      openError: 'No se ha podido abrir el backoffice interno.',
    },
    statuses: {
      all: 'Todo',
      submitted: 'Recibidas',
      under_review: 'En revisión',
      accepted: 'Aceptadas',
      rejected: 'Rechazadas',
    },
    rawStatuses: {
      submitted: 'Recibida',
      under_review: 'En revisión',
      accepted: 'Aceptada',
      rejected: 'Rechazada',
    },
    generic: {
      unavailable: 'No disponible',
    },
  },
  en: {
    labels: {
      reviewInternalAccess: 'Internal access review',
      brandName: 'Anclora Data Lab',
      backofficeAdmissions: 'Admissions and access backoffice.',
      accessControl: 'Access control',
      total: 'Total',
      pending: 'Pending',
      queue: 'Request queue',
      detail: 'Request detail',
      email: 'Email',
      organization: 'Organization',
      profile: 'Profile',
      status: 'Status',
      usageContext: 'Usage context',
      roleToGrant: 'Role to grant',
      lastReview: 'Latest review',
      initialCredentials: 'Initial credentials',
      temporaryPassword: 'Temporary password',
      launchRoute: 'Launch route',
      pendingOrDecision: 'Require review or decision.',
      loadedRequests: 'Loaded requests.',
    },
    review: {
      title: 'Requests, validation and internal activation.',
      lead: 'This console reviews requests coming from the public Data Lab entry point and decides which profiles receive real workspace access.',
      searchPlaceholder: 'Search by name, email or organization',
      loading: 'Loading requests...',
      noItems: 'There are no requests for this filter.',
      selectOne: 'Select a request to review its detail.',
      noIndicated: 'Not provided',
      notIndicated: 'Not provided',
      notReviewed: 'Not reviewed',
      reviewNotesPlaceholder: 'Internal review notes',
      decisionReasonPlaceholder: 'Decision reason or criteria',
      closeSession: 'Close session',
      saveInReview: 'Mark as under review',
      saving: 'Saving...',
      reject: 'Reject',
      accepting: 'Activating...',
      acceptAndCreate: 'Accept and create access',
      acceptedNotice: 'Request accepted. Initial credentials are now prepared.',
      rejectedNotice: 'Request rejected and logged correctly.',
      inReviewNotice: 'Request marked as under review.',
      loadError: 'Requests could not be loaded.',
      updateError: 'The request could not be updated.',
      receivedAdmissions: 'Received admissions.',
    },
    login: {
      backToGroup: 'Back to Anclora Group',
      subtitle: 'Internal admissions and access control.',
      eyebrow: 'Internal access',
      title: 'Open request review.',
      copy: 'This access is reserved for the internal team that validates requests, approves or rejects access, and enables Data Lab operating credentials.',
      usernamePlaceholder: 'Internal user',
      passwordPlaceholder: 'Internal password',
      busy: 'Opening backoffice...',
      submit: 'Enter review',
      openError: 'The internal backoffice could not be opened.',
    },
    statuses: {
      all: 'All',
      submitted: 'Submitted',
      under_review: 'Under review',
      accepted: 'Accepted',
      rejected: 'Rejected',
    },
    rawStatuses: {
      submitted: 'Submitted',
      under_review: 'Under review',
      accepted: 'Accepted',
      rejected: 'Rejected',
    },
    generic: {
      unavailable: 'Unavailable',
    },
  },
  de: {
    labels: {
      reviewInternalAccess: 'Interne Zugangsprüfung',
      brandName: 'Anclora Data Lab',
      backofficeAdmissions: 'Backoffice für Zulassungen und Zugänge.',
      accessControl: 'Zugangskontrolle',
      total: 'Gesamt',
      pending: 'Ausstehend',
      queue: 'Anfragewarteschlange',
      detail: 'Anfragedetail',
      email: 'E-Mail',
      organization: 'Organisation',
      profile: 'Profil',
      status: 'Status',
      usageContext: 'Nutzungskontext',
      roleToGrant: 'Zu vergebende Rolle',
      lastReview: 'Letzte Prüfung',
      initialCredentials: 'Erstzugangsdaten',
      temporaryPassword: 'Temporäres Passwort',
      launchRoute: 'Zugriffsroute',
      pendingOrDecision: 'Benötigen Prüfung oder Entscheidung.',
      loadedRequests: 'Geladene Anfragen.',
    },
    review: {
      title: 'Anfragen, Validierung und interne Aktivierung.',
      lead: 'Diese Konsole prüft Anfragen aus dem öffentlichen Data-Lab-Einstieg und entscheidet, welche Profile echten Workspace-Zugang erhalten.',
      searchPlaceholder: 'Nach Name, E-Mail oder Organisation suchen',
      loading: 'Anfragen werden geladen...',
      noItems: 'Für diesen Filter gibt es keine Anfragen.',
      selectOne: 'Wähle eine Anfrage aus, um die Details zu prüfen.',
      noIndicated: 'Nicht angegeben',
      notIndicated: 'Nicht angegeben',
      notReviewed: 'Nicht geprüft',
      reviewNotesPlaceholder: 'Interne Prüfnotizen',
      decisionReasonPlaceholder: 'Entscheidungsgrund oder Kriterium',
      closeSession: 'Sitzung beenden',
      saveInReview: 'Als in Prüfung markieren',
      saving: 'Speichern...',
      reject: 'Ablehnen',
      accepting: 'Aktivieren...',
      acceptAndCreate: 'Akzeptieren und Zugang erstellen',
      acceptedNotice: 'Anfrage akzeptiert. Die initialen Zugangsdaten sind vorbereitet.',
      rejectedNotice: 'Anfrage abgelehnt und korrekt protokolliert.',
      inReviewNotice: 'Anfrage als in Prüfung markiert.',
      loadError: 'Die Anfragen konnten nicht geladen werden.',
      updateError: 'Die Anfrage konnte nicht aktualisiert werden.',
      receivedAdmissions: 'Eingegangene Zulassungen.',
    },
    login: {
      backToGroup: 'Zurück zu Anclora Group',
      subtitle: 'Interne Zulassungen und Zugangskontrolle.',
      eyebrow: 'Interner Zugang',
      title: 'Anfragenprüfung öffnen.',
      copy: 'Dieser Zugang ist dem internen Team vorbehalten, das Anfragen prüft, Zugänge genehmigt oder ablehnt und die operativen Data-Lab-Zugangsdaten freischaltet.',
      usernamePlaceholder: 'Interner Benutzer',
      passwordPlaceholder: 'Internes Passwort',
      busy: 'Backoffice wird geöffnet...',
      submit: 'Prüfung öffnen',
      openError: 'Das interne Backoffice konnte nicht geöffnet werden.',
    },
    statuses: {
      all: 'Alle',
      submitted: 'Eingegangen',
      under_review: 'In Prüfung',
      accepted: 'Akzeptiert',
      rejected: 'Abgelehnt',
    },
    rawStatuses: {
      submitted: 'Eingegangen',
      under_review: 'In Prüfung',
      accepted: 'Akzeptiert',
      rejected: 'Abgelehnt',
    },
    generic: {
      unavailable: 'Nicht verfügbar',
    },
  },
}
