import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontSizes, radius, spacing } from '../theme/colors';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  icon?: string;
  suffix?: string;
}

export default function FormInput({
  label,
  error,
  hint,
  icon,
  suffix,
  ...inputProps
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          style={[
            styles.input,
            icon ? styles.inputWithIcon : null,
            suffix ? styles.inputWithSuffix : null,
            error ? styles.inputError : null,
          ]}
          placeholderTextColor={colors.textMuted}
          {...inputProps}
        />
        {icon ? (
          <View style={styles.iconBox} pointerEvents="none">
            <Ionicons
              name={icon}
              size={18}
              color={error ? colors.danger : colors.textSecondary}
            />
          </View>
        ) : null}
        {suffix ? (
          <View style={styles.suffixBox} pointerEvents="none">
            <Text style={styles.suffix}>{suffix}</Text>
          </View>
        ) : null}
      </View>
      {error ? (
        <View style={styles.messageRow}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    backgroundColor: colors.inputBackground,
  },
  inputWithIcon: {
    paddingLeft: 44,
  },
  inputWithSuffix: {
    paddingRight: 56,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  iconBox: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suffixBox: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: spacing.lg,
    justifyContent: 'center',
  },
  suffix: {
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  errorText: {
    flex: 1,
    marginLeft: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.danger,
  },
  hint: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
});
