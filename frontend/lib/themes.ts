// ============================================================================
// THEME TYPES & CONSTANTS
// ============================================================================

export type Theme = "light" | "dark" | "orange"

export const AVAILABLE_THEMES: Array<{ value: Theme; label: string; color: string }> = [
  { value: "light", label: "Light", color: "bg-white" },
  { value: "dark", label: "Dark", color: "bg-gray-900" },
  { value: "orange", label: "Orange", color: "bg-orange-300" },
]

// ============================================================================
// THEME COLOR PALETTES
// ============================================================================

export const THEME_COLORS: Record<Theme, { primary: string; secondary: string }> = {
  light: { primary: '#FFB3D9', secondary: '#FFC9E3' },
  dark: { primary: '#B380FF', secondary: '#C99EFF' },
  orange: { primary: '#FFB380', secondary: '#FFC99E' },
}

// ============================================================================
// THEME STYLE CONFIGURATIONS
// ============================================================================

const BUTTON_BASE_STYLES = 'font-bold text-base shadow-lg'
const BUTTON_ROUNDED = 'rounded-full'
const CARD_ROUNDED = 'rounded-2xl'

export const THEME_BUTTON_STYLES = {
  light: {
    logout: 'bg-gradient-to-r from-[#FFB3D9] to-[#FFC9E3] hover:from-[#FFC9E3] hover:to-[#FFB3D9] shadow-[#FFB3D9]/30 hover:shadow-[#FFB3D9]/50',
    primary: 'bg-gradient-to-br from-[#FFB3D9] to-[#FFC9E3] text-white hover:from-[#FFA5D0] hover:to-[#FFBEDA]',
    secondary: 'bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] text-white',
    navIndicator: 'bg-gradient-to-r from-[#FFB3D9] to-[#FFC9E3]',
    outlined: 'bg-card border-2 border-[#FFB3D9] hover:border-[#FFC9E3] hover:bg-[#FFB3D9]/5',
    outlinedText: 'text-[#FFB3D9]',
    outlinedIcon: 'bg-gradient-to-br from-[#FFB3D9] to-[#FFC9E3]',
  },
  dark: {
    logout: 'bg-gradient-to-r from-[#9333EA] to-[#C084FC] hover:from-[#C084FC] hover:to-[#9333EA] shadow-purple-500/30 hover:shadow-purple-500/50',
    primary: 'bg-gradient-to-br from-[#9333EA] to-[#C084FC] text-white hover:from-[#A855F7] hover:to-[#D8B4FE]',
    secondary: 'bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white',
    navIndicator: 'bg-gradient-to-r from-[#9333EA] to-[#C084FC]',
    outlined: 'bg-card border-2 border-[#9333EA] hover:border-[#C084FC] hover:bg-[#9333EA]/5',
    outlinedText: 'text-[#C084FC]',
    outlinedIcon: 'bg-gradient-to-br from-[#9333EA] to-[#C084FC]',
  },
  orange: {
    logout: 'bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#FB923C] hover:to-[#F97316] shadow-orange-500/30 hover:shadow-orange-500/50',
    primary: 'bg-gradient-to-br from-[#F97316] to-[#FB923C] text-white hover:from-[#FB923C] hover:to-[#FDBA74]',
    secondary: 'bg-gradient-to-br from-[#EA580C] to-[#F97316] text-white',
    navIndicator: 'bg-gradient-to-r from-[#F97316] to-[#FB923C]',
    outlined: 'bg-card border-2 border-[#F97316] hover:border-[#FB923C] hover:bg-[#F97316]/5',
    outlinedText: 'text-[#F97316]',
    outlinedIcon: 'bg-gradient-to-br from-[#F97316] to-[#FB923C]',
  },
} as const

// ============================================================================
// THEME UTILITY FUNCTIONS
// ============================================================================

/**
 * Get theme color palette (primary & secondary colors)
 */
export function getThemeColors(theme: Theme) {
  return THEME_COLORS[theme] || THEME_COLORS.light
}

/**
 * Get theme-specific button style by type
 */
export function getThemeButtonStyle(theme: Theme, buttonType: keyof typeof THEME_BUTTON_STYLES.light): string {
  return THEME_BUTTON_STYLES[theme][buttonType]
}

/**
 * Get dynamic button styles based on theme (legacy support)
 */
export function getButtonStyle(theme: Theme): string {
  const colors = THEME_COLORS[theme] || THEME_COLORS.light
  return `bg-gradient-to-r from-[${colors.primary}] to-[${colors.secondary}] hover:from-[${colors.secondary}] hover:to-[${colors.primary}] text-gray-900 ${BUTTON_BASE_STYLES} ${BUTTON_ROUNDED} shadow-[${colors.primary}]/30 hover:shadow-[${colors.primary}]/50`
}

/**
 * Get dynamic card styles based on theme (legacy support)
 */
export function getCardStyle(theme: Theme): string {
  const colors = THEME_COLORS[theme] || THEME_COLORS.light
  return `bg-gradient-to-r from-[${colors.primary}] to-[${colors.secondary}] hover:from-[${colors.secondary}] hover:to-[${colors.primary}] text-gray-900 ${BUTTON_BASE_STYLES} ${CARD_ROUNDED} shadow-[${colors.primary}]/30 hover:shadow-[${colors.primary}]/50`
}