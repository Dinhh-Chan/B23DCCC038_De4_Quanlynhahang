// Bảng màu: đỏ đô làm màu nhấn, nền xám ánh tím rất nhạt, chữ xanh than

export const colors = {
  primary: '#B91C1C',
  primaryDark: '#991B1B',
  primaryLight: '#FDE8E8',
  primarySoft: '#FEF4F4',
  primaryBorder: '#F5C2C2',
  background: '#F6F6FA',
  card: '#FFFFFF',
  surface: '#F1F1F6',
  surfaceAccent: '#EEF0FA',
  inputBackground: '#F7F7FB',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  border: '#E6E6EE',
  divider: '#EFEFF4',
  danger: '#DC2626',
  dangerLight: '#FEF2F2',
  success: '#15803D',
  successLight: '#DCFCE7',
  successBorder: '#BBF7D0',
  disabled: '#E5E7EB',
  disabledText: '#9CA3AF',
  overlay: 'rgba(15, 23, 42, 0.55)',
  shadow: '#0F172A',
};

export const fontSizes = {
  xs: 12,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  title: 26,
};

// Khoảng cách theo bội số của 4/8
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  round: 999,
};

// Đổ bóng nhẹ cho card: elevation (Android) + shadow* (iOS)
export const cardShadow = {
  elevation: 2,
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
};

export const cardBase = {
  backgroundColor: colors.card,
  borderRadius: radius.md,
  borderWidth: 1,
  borderColor: colors.divider,
  padding: spacing.md,
  ...cardShadow,
};
