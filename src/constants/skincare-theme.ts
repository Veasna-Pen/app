export const SkincareColors = {
  // Brand blue: fills for primary actions and selected states
  primary: '#00AEEF',
  primaryPressed: '#0099D4',
  // Dark enough for small blue text and icons on white (4.6:1)
  primaryDeep: '#007DB0',
  primarySoft: '#E3F5FD',
  primaryBorder: '#BDE8FA',
  // Text and icons on a primary fill; white on #00AEEF is only 2.5:1
  onPrimary: '#06283D',

  background: '#F6FAFC',
  white: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSubtle: '#EDF5F9',
  // Navy ink for text and dark surfaces (toast, promo ticker)
  primaryDark: '#0B2231',
  primaryDarkHover: '#16374B',
  textPrimary: '#0B2231',
  textSecondary: '#5A6E7A',
  textMuted: '#93A4AE',
  border: '#DCE9F0',
  borderLight: '#EAF2F6',
  saleRed: '#E54848',
  saleRedSubtle: '#FFF1F1',
  ratingGold: '#F5A623',

  // Tints behind product photos; they follow the product, not the brand
  pastelLavender: '#EFEBF8',
  pastelMint: '#E9F3ED',
  pastelPeach: '#FAEDE4',
  pastelBlue: '#E8F0F8',

  bannerStart: '#E9F7FE',
  bannerEnd: '#C6EBFB',

  avatarBorder: '#FFFFFF',
  badgeDark: '#0B2231',
  badgeDarkText: '#FFFFFF',
};

export const SkincareSpacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
};

export const SkincareRadius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 9999,
};

export const SkincareShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: '#0B2231',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  soft: {
    shadowColor: '#0B2231',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#0B2231',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
};
