// Application constants and configuration

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS
export type BreakpointValue = typeof BREAKPOINTS[Breakpoint]

export const RESPONSIVE_CONFIG = {
  columns: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '14px',
    lg: '16px',
    xl: '16px',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
  tableSize: {
    xs: 'small' as const,
    sm: 'small' as const,
    md: 'middle' as const,
    lg: 'middle' as const,
    xl: 'large' as const,
  },
  chartHeight: {
    xs: 250,
    sm: 250,
    md: 300,
    lg: 300,
    xl: 350,
  },
} as const

export const TABLE_PAGE_SIZES = {
  xs: 5,
  sm: 5,
  md: 10,
  lg: 10,
  xl: 15,
} as const

export const TIMELINE_ITEM_LIMITS = {
  xs: 5,
  sm: 5,
  md: 10,
  lg: 10,
  xl: 15,
} as const

export const CATEGORY_BREAKDOWN_LIMITS = {
  xs: 3,
  sm: 3,
  md: 5,
  lg: 5,
  xl: 8,
} as const

// Date format patterns
export const DATE_FORMATS = {
  short: 'MMM DD',
  medium: 'MMM DD, YYYY',
  long: 'MMM DD, YYYY HH:mm',
  full: 'MMMM DD, YYYY',
} as const

// Animation and transition durations
export const TRANSITIONS = {
  fast: '0.15s',
  normal: '0.3s',
  slow: '0.5s',
} as const

// Z-index layers
export const Z_INDEX = {
  dropdown: 1000,
  modal: 1001,
  tooltip: 1100,
  loading: 1200,
} as const

// Color schemes for consistent theming
export const COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  background: '#f8fafc',
  surface: '#ffffff',
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#64748b',
  },
} as const
