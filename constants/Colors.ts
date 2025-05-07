/**
 * Dolla App Color Palette
 * A nature-inspired palette with forest greens and gold accents representing growth and prosperity
 */

// Primary and secondary colors
const primaryLight = '#2D6A4F';    // Medium forest green
const primaryDark = '#1B4332';     // Dark forest green
const secondaryLight = '#C9A227';  // Gold/amber
const secondaryDark = '#A47E1B';   // Darker gold/bronze

export const Colors = {
  light: {
    // Core UI colors
    primary: primaryLight,
    secondary: secondaryLight,
    background: '#FFFFFF',
    card: '#F9FBF9',
    text: '#081C15',          // Very dark green for text
    border: '#D8F3DC',        // Light mint for borders

    // Semantic colors
    success: '#2D6A4F',       // Medium forest green
    warning: '#C9A227',       // Gold/amber
    error: '#E63946',         // A red that works with the palette

    // Tab navigation
    tint: primaryLight,
    tabIconDefault: '#687076',
    tabIconSelected: primaryLight,

    // Misc
    accent: '#D8F3DC',        // Light mint green as accent
    cardAlt: '#F0F9F1',       // Slightly greener card alt
    textSecondary: '#2D6A4F',
    incomeGreen: '#2D6A4F',   // For income amounts
    expenseRed: '#E63946',    // For expenses
  },
  dark: {
    // Core UI colors
    primary: primaryDark,
    secondary: secondaryDark,
    background: '#081C15',    // Very dark green background
    card: '#0D2818',
    text: '#ECEDEE',          // Off-white for text
    border: '#1B4332',        // Dark forest green for borders

    // Semantic colors  
    success: '#42996C',       // Lighter green for dark mode
    warning: '#D9B44A',       // Lighter gold for dark mode
    error: '#FF6B6B',         // Brighter red for dark mode

    // Tab navigation
    tint: '#D8F3DC',          // Light mint stands out in dark mode
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#D8F3DC',

    // Misc
    accent: '#2D6A4F',        // Medium forest green as accent
    cardAlt: '#14352A',       // Darker alt card color
    textSecondary: '#D8F3DC', // Light mint for secondary text
    incomeGreen: '#42996C',   // For income amounts
    expenseRed: '#FF6B6B',    // For expenses
  },
};