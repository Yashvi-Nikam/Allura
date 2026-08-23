import { Platform } from 'react-native';

// ── Allura Color System ───────────────────────────────────────
export const Colors = {
  dark: {
    // Backgrounds
    background:         '#13111A',  // Obsidian
    surface:            '#1E1A2E',  // Midnight Plum
    surfaceElevated:    '#2A2438',  // Deep Violet

    // Text
    text:               '#F0ECE4',  // Warm White
    textSecondary:      '#C8C0B4',  // Warm Sand
    textMuted:          '#5A5650',  // Stone

    // Accents
    gold:               '#C9AB85',  // Champagne Gold
    goldDim:            'rgba(201,171,133,0.18)',
    goldGlow:           'rgba(201,171,133,0.08)',
    mauve:              '#9B7FA6',  // Dusty Mauve
    rose:               '#C97A8A',  // Rose Quartz

    // Borders
    border:             'rgba(201,171,133,0.12)',
    borderFocus:        'rgba(201,171,133,0.4)',

    // Status
    success:            '#9fe1cb',
    error:              '#F0997B',
  },
  light: {
    // Backgrounds
    background:         '#FDF0F5',  // Blush Rose
    surface:            '#FFFFFF',
    surfaceElevated:    '#F7E8F0',

    // Text
    text:               '#2A1F35',  // Deep Plum
    textSecondary:      '#6B5B7A',
    textMuted:          '#A89AB5',

    // Accents — same as dark
    gold:               '#C9AB85',
    goldDim:            'rgba(201,171,133,0.18)',
    goldGlow:           'rgba(201,171,133,0.08)',
    mauve:              '#9B7FA6',
    rose:               '#C97A8A',

    // Borders
    border:             'rgba(155,127,166,0.2)',
    borderFocus:        'rgba(155,127,166,0.5)',

    // Status
    success:            '#3B6D11',
    error:              '#993C1D',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ── Allura Typography ─────────────────────────────────────────
export const Fonts = {
  dancing:    'DancingScript',      // Logo, hero headlines
  cormorant:  'CormorantGaramond',  // Section headlines
  raleway:    'Raleway',            // Labels, buttons, nav
  jost:       'Jost',               // Body text, UI
};

// ── Spacing Scale ─────────────────────────────────────────────
export const Spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
} as const;

// ── Border Radius ─────────────────────────────────────────────
export const Radius = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  xxl:  20,
  full: 999,
} as const;

// ── Platform helpers ──────────────────────────────────────────
export const BottomTabInset = Platform.select({ 
  ios: 50, 
  android: 80 
}) ?? 0;

export const MaxContentWidth = 428; // iPhone 14 Pro Max width