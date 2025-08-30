export interface AbstractsSettings {
  // Tracks like Free Paper, Poster Presentation, E-Posters
  tracks: Array<{
    key: string
    label: string
    enabled: boolean
    categories?: Array<{
      key: string
      label: string
      enabled: boolean
      subcategories?: Array<{
        key: string
        label: string
        enabled: boolean
      }>
    }>
  }>

  // Submission controls
  submissionWindow: {
    start: string // ISO date
    end: string   // ISO date
    enabled: boolean
  }

  maxAbstractsPerUser: number // admin configurable
  assignmentPolicy?: 'round-robin' | 'load-based'
  reviewersPerAbstractDefault?: number

  // File settings
  allowedInitialFileTypes: string[] // e.g., ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  allowedFinalFileTypes: string[] // e.g., ppt/pptx MIME types
  maxFileSizeMB: number // applies to both initial and final unless overridden
}

export const defaultAbstractsSettings: AbstractsSettings = {
  tracks: [
    { key: 'free-paper', label: 'Free Paper', enabled: true },
    { key: 'poster', label: 'Poster Presentation', enabled: true },
    { key: 'e-poster', label: 'E-Poster', enabled: true }
  ],
  submissionWindow: {
    start: '2026-04-01T00:00:00.000Z',
    end: '2026-06-30T23:59:59.999Z',
    enabled: false
  },
  maxAbstractsPerUser: 3,
  assignmentPolicy: 'load-based',
  reviewersPerAbstractDefault: 2,
  allowedInitialFileTypes: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  allowedFinalFileTypes: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ],
  maxFileSizeMB: 10
}


