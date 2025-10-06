/**
 * Style Utilities
 *
 * Utility functions and classes for consistent styling across the application.
 * Works with the design tokens to provide reusable style patterns.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// =============================================================================
// CLASS NAME UTILITIES
// =============================================================================

/**
 * Combines class names with conflict resolution
 * Uses clsx for conditional classes and tailwind-merge for Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================================================
// COMMON STYLE PATTERNS
// =============================================================================

/**
 * Common style patterns used throughout the application
 * These provide consistent spacing, typography, and layout patterns
 */
export const stylePatterns = {
  // Layout patterns
  page: 'min-h-screen bg-background text-foreground',
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-8 md:py-12 lg:py-16',

  // Card patterns
  card: {
    base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
    elevated: 'rounded-lg border bg-card text-card-foreground shadow-md',
    interactive: 'rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow',
    content: 'p-6',
    header: 'flex items-center justify-between p-6 pb-2',
    footer: 'p-6 pt-2'
  },

  // Typography patterns
  heading: {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    h6: 'scroll-m-20 text-base font-semibold tracking-tight'
  },

  text: {
    large: 'text-lg font-semibold',
    normal: 'text-sm',
    small: 'text-sm text-muted-foreground',
    muted: 'text-sm text-muted-foreground',
    lead: 'text-xl text-muted-foreground'
  },

  // Interactive element patterns
  button: {
    base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    sizes: {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10'
    }
  },

  input: {
    base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  },

  // Healthcare-specific patterns
  metric: {
    large: 'text-3xl font-bold tracking-tight',
    normal: 'text-2xl font-bold tracking-tight',
    small: 'text-xl font-bold tracking-tight',
    label: 'text-sm font-medium text-muted-foreground'
  },

  status: {
    badge: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    indicator: 'inline-block h-2 w-2 rounded-full'
  },

  // Navigation patterns
  nav: {
    item: 'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
    active: 'bg-accent text-accent-foreground',
    brand: 'flex items-center space-x-2 text-lg font-semibold'
  }
} as const;

// =============================================================================
// RESPONSIVE UTILITIES
// =============================================================================

/**
 * Responsive design utilities
 * Consistent breakpoints and responsive patterns
 */
export const responsive = {
  // Breakpoint utilities
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Common responsive patterns
  grid: {
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    auto: 'grid grid-cols-auto-fit gap-6',
    cards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
  },

  flex: {
    stack: 'flex flex-col space-y-4',
    row: 'flex flex-row items-center space-x-4',
    between: 'flex items-center justify-between',
    center: 'flex items-center justify-center',
    responsive: 'flex flex-col md:flex-row md:items-center md:space-x-4 md:space-y-0 space-y-4'
  },

  spacing: {
    section: 'py-8 md:py-12 lg:py-16',
    component: 'p-4 md:p-6',
    tight: 'p-2 md:p-4',
    loose: 'p-6 md:p-8 lg:p-12'
  }
} as const;

// =============================================================================
// ANIMATION UTILITIES
// =============================================================================

/**
 * Animation and transition utilities
 * Consistent timing and easing for smooth interactions
 */
export const animations = {
  // Transition presets
  transition: {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-200 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
    colors: 'transition-colors duration-200 ease-in-out',
    transform: 'transition-transform duration-200 ease-in-out'
  },

  // Loading states
  loading: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping'
  },

  // Entrance animations
  entrance: {
    fadeIn: 'animate-in fade-in duration-200',
    slideIn: 'animate-in slide-in-from-bottom-4 duration-300',
    slideUp: 'animate-in slide-in-from-top-4 duration-300',
    scaleIn: 'animate-in zoom-in-95 duration-200'
  },

  // Exit animations
  exit: {
    fadeOut: 'animate-out fade-out duration-150',
    slideOut: 'animate-out slide-out-to-bottom-4 duration-200',
    slideDown: 'animate-out slide-out-to-top-4 duration-200',
    scaleOut: 'animate-out zoom-out-95 duration-150'
  }
} as const;

// =============================================================================
// FOCUS AND ACCESSIBILITY
// =============================================================================

/**
 * Focus and accessibility utilities
 * Ensures consistent focus states and accessibility patterns
 */
export const a11y = {
  // Focus styles
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    within: 'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
  },

  // Screen reader utilities
  sr: {
    only: 'sr-only',
    focusable: 'sr-only focus:not-sr-only focus:absolute focus:left-1 focus:top-1 focus:z-10 focus:p-2 focus:bg-background focus:text-foreground focus:rounded-md'
  },

  // High contrast support
  contrast: {
    border: 'border border-border',
    outline: 'outline outline-1 outline-border',
    shadow: 'shadow-sm border border-border'
  }
} as const;

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Theme-specific utilities
 * Helpers for working with light/dark themes
 */
export const theme = {
  // Theme-aware classes
  bg: {
    adaptive: 'bg-background text-foreground',
    card: 'bg-card text-card-foreground',
    muted: 'bg-muted text-muted-foreground',
    accent: 'bg-accent text-accent-foreground'
  },

  // Dark mode utilities
  dark: {
    only: 'dark:block hidden',
    hidden: 'dark:hidden block'
  },

  // Brand color utilities
  brand: {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground'
  }
} as const;

// =============================================================================
// HEALTHCARE-SPECIFIC UTILITIES
// =============================================================================

/**
 * Healthcare and rehabilitation-specific style utilities
 * Patterns common in medical/healthcare applications
 */
export const healthcare = {
  // Patient information display
  patient: {
    header: 'border-b border-border pb-4 mb-6',
    info: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    vital: 'flex items-center justify-between p-3 bg-muted/50 rounded-md'
  },

  // Schedule and appointment patterns
  schedule: {
    slot: 'p-3 border border-border rounded-md hover:bg-accent/50 transition-colors cursor-pointer',
    time: 'text-sm font-mono text-muted-foreground',
    occupied: 'bg-primary/10 border-primary/20 text-primary',
    available: 'hover:bg-accent/50'
  },

  // Medical form patterns
  form: {
    section: 'space-y-6',
    fieldset: 'space-y-4 p-4 border border-border rounded-md',
    legend: 'text-sm font-medium text-foreground px-2 -ml-2',
    required: 'after:content-["*"] after:text-destructive after:ml-1'
  },

  // Status indicators for medical context
  status: {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get responsive classes for a given base class
 */
export function getResponsiveClasses(
  mobile: string,
  tablet?: string,
  desktop?: string
): string {
  const classes = [mobile];
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  return classes.join(' ');
}

/**
 * Create a style variant function (useful for components)
 */
export function createStyleVariant<T extends Record<string, string>>(
  variants: T,
  defaultVariant: keyof T
) {
  return (variant?: keyof T) => variants[variant ?? defaultVariant];
}

/**
 * Conditionally apply classes based on state
 */
export function conditionalClasses(
  baseClasses: string,
  conditionalClasses: Record<string, boolean>
): string {
  const active = Object.entries(conditionalClasses)
    .filter(([, condition]) => condition)
    .map(([classes]) => classes);

  return cn(baseClasses, ...active);
}

// =============================================================================
// EXPORTS
// =============================================================================

export { clsx, twMerge };

export const styleUtils = {
  patterns: stylePatterns,
  responsive,
  animations,
  a11y,
  theme,
  healthcare
} as const;

export default styleUtils;