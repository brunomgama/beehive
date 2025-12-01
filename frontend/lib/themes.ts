export type Theme = "light" | "dark" | "orange";

export const themes: Array<{ value: Theme; label: string; color: string }> = [
    { value: "light", label: "Light", color: "bg-white" },
    { value: "dark", label: "Dark", color: "bg-gray-900" },
    { value: "orange", label: "Orange", color: "bg-orange-300" },
];

/**
 * Get dynamic button styles based on the current theme
 */
export const getButtonStyle = (theme: Theme): string => {
  switch (theme) {
    case 'light':
      return 'bg-gradient-to-r from-[#FFB3D9] to-[#FFC9E3] hover:from-[#FFC9E3] hover:to-[#FFB3D9] text-gray-900 font-bold text-base rounded-full shadow-lg shadow-[#FFB3D9]/30 hover:shadow-[#FFB3D9]/50';
    case 'dark':
      return 'bg-gradient-to-r from-[#B380FF] to-[#C99EFF] hover:from-[#C99EFF] hover:to-[#B380FF] text-white font-bold text-base rounded-full shadow-lg shadow-[#B380FF]/30 hover:shadow-[#B380FF]/50';
    case 'orange':
      return 'bg-gradient-to-r from-[#FFB380] to-[#FFC99E] hover:from-[#FFC99E] hover:to-[#FFB380] text-white font-bold text-base rounded-full shadow-lg shadow-[#FFB380]/30 hover:shadow-[#FFB380]/50';
    default:
      return 'bg-gradient-to-r from-[#FFB3D9] to-[#FFC9E3] hover:from-[#FFC9E3] hover:to-[#FFB3D9] text-white font-bold text-base rounded-full shadow-lg shadow-[#FFB3D9]/30 hover:shadow-[#FFB3D9]/50';
  }
};

/**
 * Get dynamic button styles based on the current theme
 */
export const getCardStyle = (theme: Theme): string => {
  switch (theme) {
    case 'light':
      return 'bg-gradient-to-r from-[#FFB3D9] to-[#FFC9E3] hover:from-[#FFC9E3] hover:to-[#FFB3D9] text-gray-900 font-bold text-base rounded-2xl shadow-lg shadow-[#FFB3D9]/30 hover:shadow-[#FFB3D9]/50';
    case 'dark':
      return 'bg-gradient-to-r from-[#B380FF] to-[#C99EFF] hover:from-[#C99EFF] hover:to-[#B380FF] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#B380FF]/30 hover:shadow-[#B380FF]/50';
    case 'orange':
      return 'bg-gradient-to-r from-[#FFB380] to-[#FFC99E] hover:from-[#FFC99E] hover:to-[#FFB380] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#FFB380]/30 hover:shadow-[#FFB380]/50';
    default:
      return 'bg-gradient-to-r from-[#FFB3D9] to-[#FFC9E3] hover:from-[#FFC9E3] hover:to-[#FFB3D9] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#FFB3D9]/30 hover:shadow-[#FFB3D9]/50';
  }
};

/**
 * Get theme primary color for charts and other elements
 */
export function getThemeColors(theme: Theme) {
  const colors: Record<Theme, { primary: string; secondary: string }> = {
    light: { primary: '#FFB3D9', secondary: '#FFC9E3' },
    dark: { primary: '#B380FF', secondary: '#C99EFF' },
    orange: { primary: '#FFB380', secondary: '#FFC99E' },
  }
  return colors[theme] || colors.light
}

/**
 * Theme-specific button style configurations
 */
export const themeButtonStyles = {
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

/**
 * Get theme-specific button style by type
 */
export const getThemeButtonStyle = (theme: Theme, buttonType: keyof typeof themeButtonStyles.light): string => {
  return themeButtonStyles[theme][buttonType];
};