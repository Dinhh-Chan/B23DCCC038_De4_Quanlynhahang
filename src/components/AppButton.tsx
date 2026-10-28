import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontSizes, radius, spacing } from '../theme/colors';

type Variant = 'primary' | 'outline' | 'light';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
}

export default function AppButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  style,
}: Props) {
  const textColor = disabled
    ? colors.disabledText
    : variant === 'primary'
    ? colors.textOnPrimary
    : variant === 'light'
    ? colors.primary
    : colors.textPrimary;

  const iconElement = icon ? (
    <Ionicons
      name={icon}
      size={18}
      color={textColor}
      style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
    />
  ) : null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={[styles.base, disabled ? styles.disabled : styles[variant], style]}
    >
      {iconPosition === 'left' && iconElement}
      <Text
        style={[
          styles.text,
          variant === 'outline' && styles.textOutline,
          variant === 'light' && styles.textLight,
          disabled && styles.textDisabled,
        ]}
      >
        {title}
      </Text>
      {iconPosition === 'right' && iconElement}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  light: {
    backgroundColor: colors.surfaceAccent,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  text: {
    color: colors.textOnPrimary,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  textOutline: {
    color: colors.textPrimary,
  },
  textLight: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.disabledText,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
