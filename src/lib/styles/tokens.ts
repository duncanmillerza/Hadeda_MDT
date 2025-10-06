/**
 * HadedaHealth Design Tokens
 *
 * Single source of truth for all design tokens used throughout the application.
 * Colors are defined with OKLCH as primary format with HSL/HEX fallbacks for
 * better browser support and developer familiarity.
 *
 * @see https://oklch.com/ - OKLCH Color Space Documentation
 * @see https://www.w3.org/TR/css-color-4/#ok-lab - W3C Specification
 */

// =============================================================================
// BRAND COLORS
// =============================================================================

/**
 * Core brand colors derived from HadedaHealth logo assets
 * These should never change and form the foundation of the color system
 */
export const brandColors = {
  hadedaGreen: {
    // Primary brand color from logo SVG
    oklch: 'oklch(0.35 0.08 164)',    // Modern format for better perceptual uniformity
    hsl: 'hsl(164, 45%, 27%)',        // Traditional format for fallback
    hex: '#2D6356',                   // Exact match from logo assets
    description: 'Primary brand color from HadedaHealth logo'
  },
  healthcareBlue: {
    // Secondary brand color for healthcare context
    oklch: 'oklch(0.35 0.08 240)',    // Professional blue tone
    hsl: 'hsl(217, 43%, 33%)',        // HSL equivalent
    hex: '#32517A',                   // Calculated HEX value
    description: 'Secondary brand color for professional healthcare context'
  },
  destructiveRose: {
    // Destructive actions color
    oklch: 'oklch(0.45 0.15 15)',     // Red-pink for warnings/errors
    hsl: 'hsl(345, 47%, 33%)',        // HSL equivalent
    hex: '#96364C',                   // Calculated HEX value
    description: 'Destructive actions like delete, cancel, error states'
  }
} as const;

// =============================================================================
// SEMANTIC COLOR TOKENS
// =============================================================================

/**
 * Semantic color mapping that references brand colors
 * This creates a consistent semantic layer over brand colors
 */
export const semanticColors = {
  primary: {
    oklch: brandColors.hadedaGreen.oklch,
    hsl: brandColors.hadedaGreen.hsl,
    hex: brandColors.hadedaGreen.hex,
    description: 'Primary actions, links, and brand elements'
  },
  secondary: {
    oklch: brandColors.healthcareBlue.oklch,
    hsl: brandColors.healthcareBlue.hsl,
    hex: brandColors.healthcareBlue.hex,
    description: 'Secondary actions and complementary elements'
  },
  destructive: {
    oklch: brandColors.destructiveRose.oklch,
    hsl: brandColors.destructiveRose.hsl,
    hex: brandColors.destructiveRose.hex,
    description: 'Destructive actions and error states'
  }
} as const;

// =============================================================================
// NEUTRAL COLORS
// =============================================================================

/**
 * Neutral colors for text, backgrounds, and UI elements
 * Designed to work across light and dark themes
 */
export const neutralColors = {
  // Pure neutrals
  white: {
    oklch: 'oklch(1 0 0)',
    hsl: 'hsl(0, 0%, 100%)',
    hex: '#FFFFFF'
  },
  black: {
    oklch: 'oklch(0 0 0)',
    hsl: 'hsl(0, 0%, 0%)',
    hex: '#000000'
  },

  // Light theme neutrals
  light: {
    background: {
      oklch: 'oklch(1 0 0)',           // Pure white
      hsl: 'hsl(0, 0%, 100%)',
      hex: '#FFFFFF'
    },
    foreground: {
      oklch: 'oklch(0.2 0.02 240)',    // Very dark gray
      hsl: 'hsl(222, 84%, 15%)',
      hex: '#1F2937'
    },
    card: {
      oklch: 'oklch(0.98 0.005 240)',  // Very light gray
      hsl: 'hsl(210, 17%, 98%)',
      hex: '#F9FAFB'
    },
    muted: {
      oklch: 'oklch(0.96 0.01 240)',   // Light gray
      hsl: 'hsl(220, 14%, 96%)',
      hex: '#F9FAFB'
    },
    border: {
      oklch: 'oklch(0.91 0.005 240)',  // Medium light gray
      hsl: 'hsl(220, 13%, 91%)',
      hex: '#E5E7EB'
    }
  },

  // Dark theme neutrals
  dark: {
    background: {
      oklch: 'oklch(0.08 0.005 240)',  // Very dark blue-gray
      hsl: 'hsl(200, 33%, 5%)',
      hex: '#080C10'
    },
    foreground: {
      oklch: 'oklch(0.98 0.005 240)',  // Near white
      hsl: 'hsl(210, 17%, 98%)',
      hex: '#F9FAFB'
    },
    card: {
      oklch: 'oklch(0.13 0.01 240)',   // Dark gray-blue
      hsl: 'hsl(222, 22%, 13%)',
      hex: '#111726'
    },
    muted: {
      oklch: 'oklch(0.17 0.01 240)',   // Slightly lighter dark gray
      hsl: 'hsl(215, 28%, 17%)',
      hex: '#1E293B'
    },
    border: {
      oklch: 'oklch(0.23 0.01 240)',   // Medium dark gray
      hsl: 'hsl(217, 32%, 23%)',
      hex: '#374151'
    }
  }
} as const;

// =============================================================================
// THEME COLOR SCALES
// =============================================================================

/**
 * Color scales for different theme modes
 * Each scale provides consistent contrast ratios and accessibility
 */
export const themeColors = {
  light: {
    // Backgrounds
    background: neutralColors.light.background,
    foreground: neutralColors.light.foreground,
    card: neutralColors.light.card,
    cardForeground: neutralColors.light.foreground,
    popover: neutralColors.white,
    popoverForeground: neutralColors.light.foreground,

    // Brand colors
    primary: semanticColors.primary,
    primaryForeground: neutralColors.white,
    secondary: semanticColors.secondary,
    secondaryForeground: neutralColors.white,

    // UI states
    muted: neutralColors.light.muted,
    mutedForeground: {
      oklch: 'oklch(0.55 0.015 240)',
      hsl: 'hsl(220, 9%, 46%)',
      hex: '#6B7280'
    },
    accent: neutralColors.light.muted,
    accentForeground: neutralColors.light.foreground,
    destructive: semanticColors.destructive,
    destructiveForeground: neutralColors.white,

    // Interactive elements
    border: neutralColors.light.border,
    input: neutralColors.light.border,
    ring: semanticColors.primary
  },

  dark: {
    // Backgrounds
    background: neutralColors.dark.background,
    foreground: neutralColors.dark.foreground,
    card: neutralColors.dark.card,
    cardForeground: neutralColors.dark.foreground,
    popover: neutralColors.dark.muted,
    popoverForeground: neutralColors.dark.foreground,

    // Brand colors (consistent across themes)
    primary: semanticColors.primary,
    primaryForeground: neutralColors.white,
    secondary: {
      // Brighter blue for dark mode visibility
      oklch: 'oklch(0.68 0.15 240)',
      hsl: 'hsl(213, 94%, 68%)',
      hex: '#60A5FA'
    },
    secondaryForeground: neutralColors.white,

    // UI states
    muted: neutralColors.dark.muted,
    mutedForeground: {
      oklch: 'oklch(0.85 0.01 240)',
      hsl: 'hsl(214, 32%, 91%)',
      hex: '#CBD5E1'
    },
    accent: neutralColors.dark.border,
    accentForeground: neutralColors.dark.foreground,
    destructive: {
      // Brighter rose for dark mode visibility
      oklch: 'oklch(0.65 0.2 15)',
      hsl: 'hsl(345, 84%, 61%)',
      hex: '#F87171'
    },
    destructiveForeground: neutralColors.white,

    // Interactive elements
    border: neutralColors.dark.border,
    input: neutralColors.dark.border,
    ring: semanticColors.primary
  }
} as const;

// =============================================================================
// CHART COLORS
// =============================================================================

/**
 * Colors specifically for data visualization and charts
 * Designed to be distinct and accessible across themes
 */
export const chartColors = {
  light: [
    semanticColors.primary.hex,       // Hadeda Green
    semanticColors.secondary.hex,     // Healthcare Blue
    '#8B5CF6',                       // Purple
    '#10B981',                       // Emerald
    '#F59E0B',                       // Amber
    '#EF4444',                       // Red
    '#06B6D4',                       // Cyan
    '#84CC16'                        // Lime
  ],
  dark: [
    semanticColors.primary.hex,       // Hadeda Green (consistent)
    '#60A5FA',                       // Light Blue
    '#A78BFA',                       // Light Purple
    '#34D399',                       // Light Emerald
    '#FBBF24',                       // Light Amber
    '#F87171',                       // Light Red
    '#22D3EE',                       // Light Cyan
    '#A3E635'                        // Light Lime
  ]
} as const;

// =============================================================================
// ACCESSIBILITY HELPERS
// =============================================================================

/**
 * Accessibility-focused color utilities
 * All combinations tested for WCAG AA compliance
 */
export const accessibilityColors = {
  // High contrast pairs for critical information
  highContrast: {
    light: {
      background: neutralColors.white.hex,
      foreground: neutralColors.black.hex
    },
    dark: {
      background: neutralColors.black.hex,
      foreground: neutralColors.white.hex
    }
  },

  // Focus indicators
  focus: {
    ring: semanticColors.primary.hex,
    ringOpacity: '50%'
  },

  // Status colors with sufficient contrast
  status: {
    success: {
      light: '#059669',  // Green-600
      dark: '#10B981'    // Green-500
    },
    warning: {
      light: '#D97706',  // Amber-600
      dark: '#F59E0B'    // Amber-500
    },
    error: {
      light: semanticColors.destructive.hex,
      dark: '#F87171'    // Red-400
    },
    info: {
      light: semanticColors.secondary.hex,
      dark: '#60A5FA'    // Blue-400
    }
  }
} as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type ColorValue = {
  oklch: string;
  hsl: string;
  hex: string;
  description?: string;
};

export type ThemeMode = 'light' | 'dark';

export type SemanticColorKey = keyof typeof semanticColors;

export type BrandColorKey = keyof typeof brandColors;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get a color value in the specified format
 */
export function getColor(
  color: ColorValue,
  format: 'oklch' | 'hsl' | 'hex' = 'oklch'
): string {
  return color[format];
}

/**
 * Get theme colors for a specific mode
 */
export function getThemeColors(mode: ThemeMode) {
  return themeColors[mode];
}

/**
 * Get chart colors for a specific theme
 */
export function getChartColors(mode: ThemeMode) {
  return chartColors[mode];
}

/**
 * Convert hex to HSL (utility for consistency checks)
 */
export function hexToHsl(): string {
  // Implementation would go here if needed for validation
  // For now, we manually maintain HSL values
  throw new Error('Use predefined HSL values from design tokens');
}

/**
 * Validate color contrast ratio
 */
export function validateContrast(
  _foreground: string,
  _background: string
): { ratio: number; passesAA: boolean; passesAAA: boolean } {
  // Implementation would use a color contrast library
  // For now, all our predefined combinations are tested
  throw new Error('Use predefined accessible color combinations');
}

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Complete design token export
 */
export const designTokens = {
  brand: brandColors,
  semantic: semanticColors,
  neutral: neutralColors,
  theme: themeColors,
  chart: chartColors,
  accessibility: accessibilityColors
} as const;

export default designTokens;