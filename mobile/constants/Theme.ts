export const Palette = {
  primary: '#D97706',
  primarySoft: '#F59E0B',
  cream: '#FFF7ED',
  sand: '#F5E6D3',
  surface: '#FFFBF5',
  surfaceAlt: '#FFF1E6',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E7D7C8',
  
  // Semantic
  success: '#059669',
  warning: '#D97706',
  danger: '#E11D48',
  info: '#0284C7',
  white: '#FFFFFF',
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 64,
};

export const Radius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const Typography = {
  display: {
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: 44,
    letterSpacing: -0.5,
    color: Palette.text,
  },
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 36,
    letterSpacing: -0.2,
    color: Palette.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 30,
    color: Palette.text,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 26,
    color: Palette.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
    color: Palette.text,
  },
  caption: {
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
    color: Palette.muted,
  },
  label: {
    fontSize: 11,
    fontWeight: '800' as const,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    color: Palette.muted,
  },
};

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  premium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
  }
};
