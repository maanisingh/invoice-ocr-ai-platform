import { BREAKPOINTS, RESPONSIVE_CONFIG, type Breakpoint } from './constants'

/**
 * Get the current breakpoint based on window width
 */
export function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

/**
 * Get responsive value based on current breakpoint
 */
export function getResponsiveValue<T>(
  breakpoint: Breakpoint,
  values: Record<Breakpoint, T>
): T {
  return values[breakpoint]
}

/**
 * Check if current breakpoint is at least the specified breakpoint
 */
export function isBreakpointAtLeast(current: Breakpoint, target: Breakpoint): boolean {
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']
  return order.indexOf(current) >= order.indexOf(target)
}

/**
 * Check if current breakpoint is at most the specified breakpoint
 */
export function isBreakpointAtMost(current: Breakpoint, target: Breakpoint): boolean {
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']
  return order.indexOf(current) <= order.indexOf(target)
}

/**
 * Get responsive columns for Descriptions component
 */
export function getDescriptionsColumns(width: number) {
  const breakpoint = getBreakpoint(width)
  return RESPONSIVE_CONFIG.columns[breakpoint]
}

/**
 * Get responsive table size
 */
export function getTableSize(width: number) {
  const breakpoint = getBreakpoint(width)
  return RESPONSIVE_CONFIG.tableSize[breakpoint]
}

/**
 * Get responsive chart height
 */
export function getChartHeight(width: number) {
  const breakpoint = getBreakpoint(width)
  return RESPONSIVE_CONFIG.chartHeight[breakpoint]
}

/**
 * Get responsive table page size
 */
export function getTablePageSize(width: number) {
  const breakpoint = getBreakpoint(width)
  return RESPONSIVE_CONFIG.tableSize[breakpoint] === 'small' ? 5 : 10
}

/**
 * Get responsive timeline item limit
 */
export function getTimelineItemLimit(width: number) {
  const breakpoint = getBreakpoint(width)
  return isBreakpointAtMost(breakpoint, 'sm') ? 5 : 10
}

/**
 * Get responsive category breakdown limit
 */
export function getCategoryBreakdownLimit(width: number) {
  const breakpoint = getBreakpoint(width)
  return isBreakpointAtMost(breakpoint, 'sm') ? 3 : 5
}

/**
 * Format date responsively based on screen size
 */
export function formatDateResponsive(date: string | Date, width: number): string {
  const breakpoint = getBreakpoint(width)
  const isSmall = isBreakpointAtMost(breakpoint, 'sm')

  if (typeof date === 'string') {
    date = new Date(date)
  }

  const options: Intl.DateTimeFormatOptions = isSmall
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' }

  return date.toLocaleDateString('en-US', options)
}

/**
 * Format currency with responsive precision
 */
export function formatCurrency(amount: number, currency = 'USD', width?: number): string {
  const isSmall = width ? isBreakpointAtMost(getBreakpoint(width), 'sm') : false

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: isSmall ? 0 : 2,
    maximumFractionDigits: isSmall ? 0 : 2,
  }).format(amount)
}

/**
 * Debounce utility function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Get responsive text size class
 */
export function getTextSizeClass(width: number): string {
  const breakpoint = getBreakpoint(width)
  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-base',
  }
  return sizeMap[breakpoint]
}

/**
 * Get responsive spacing class
 */
export function getSpacingClass(width: number, type: 'margin' | 'padding' = 'margin'): string {
  const breakpoint = getBreakpoint(width)
  const spacingMap = {
    xs: type === 'margin' ? 'm-2' : 'p-2',
    sm: type === 'margin' ? 'm-3' : 'p-3',
    md: type === 'margin' ? 'm-4' : 'p-4',
    lg: type === 'margin' ? 'm-5' : 'p-5',
    xl: type === 'margin' ? 'm-6' : 'p-6',
  }
  return spacingMap[breakpoint]
}
