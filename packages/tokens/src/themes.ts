/**
 * Theme tokens
 */
import { colors } from './colors';

/**
 * Game-specific themes
 */
export const themes = {
  // Default dark theme
  dark: {
    background: colors.neutral[900],
    foreground: colors.neutral[100],
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    accent: colors.accent[500],
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  },
  
  // Light theme
  light: {
    background: colors.neutral[100],
    foreground: colors.neutral[900],
    primary: colors.primary[600],
    secondary: colors.secondary[600],
    accent: colors.accent[600],
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  },
  
  // Cyberpunk theme
  cyberpunk: {
    background: '#0c0c14',
    foreground: '#e8f0ff',
    primary: '#00f0ff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    success: '#00ff9f',
    warning: '#ff9f00',
    error: '#ff0050',
    info: '#0090ff',
  },
  
  // Retro theme
  retro: {
    background: '#222222',
    foreground: '#f0f0f0',
    primary: '#ff5555',
    secondary: '#55ff55',
    accent: '#5555ff',
    success: '#55ff55',
    warning: '#ffff55',
    error: '#ff5555',
    info: '#55ffff',
  },
  
  // Fantasy theme
  fantasy: {
    background: '#1a0d2c',
    foreground: '#f0e6ff',
    primary: '#9c59d1',
    secondary: '#2c698d',
    accent: '#d1a459',
    success: '#59d17f',
    warning: '#d1b359',
    error: '#d15959',
    info: '#5987d1',
  },
} as const;