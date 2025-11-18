import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Glassmorphism utility
export const glassmorphism = 'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/30'

// Modern card styles
export const modernCard = 'rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100/50'

// Gradient backgrounds
export const gradients = {
  primary: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
  success: 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700',
  warning: 'bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-700',
  danger: 'bg-gradient-to-br from-red-500 via-rose-600 to-pink-700',
  purple: 'bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700',
  ocean: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700',
  sunset: 'bg-gradient-to-br from-orange-500 via-pink-600 to-purple-700',
  forest: 'bg-gradient-to-br from-green-500 via-teal-600 to-cyan-700',
}

// Smooth animation utilities
export const smoothTransition = 'transition-all duration-500 ease-out'

// Hover effects
export const hoverLift = 'hover:-translate-y-1 hover:scale-105 transition-transform duration-300'
export const hoverGlow = 'hover:shadow-2xl hover:shadow-blue-500/20 transition-shadow duration-300'
