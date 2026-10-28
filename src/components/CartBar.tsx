import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, radius, spacing } from '../theme/colors';
import { formatPrice } from '../utils/format';
import AppButton from './AppButton';

interface Props {
  tableNumber: number;
  itemCount: number;
  summary: string;
  subtotal: number;
  disabled: boolean;
  onCheckout: () => void;
}

// Khung cuối màn Gọi món: tạm tính real-time + nút sang Thanh toán
export default function CartBar({
  tableNumber,
  itemCount,
  summary,
  subtotal,
  disabled,
  onCheckout,
}: Props) {
  return (
    <View style={styles.bar}>
      <Text style={styles.label}>
        {`TẠM TÍNH (${itemCount} MÓN · BÀN ${tableNumber})`}
      </Text>
      <Text style={styles.amount}>{formatPrice(subtotal)}</Text>
      <Text style={styles.summary} numberOfLines={1}>
        {summary || 'Nhấn + để thêm món vào hoá đơn'}
      </Text>
      <AppButton
        title="Thanh toán hoá đơn"
        icon="arrow-forward"
        iconPosition="right"
        disabled={disabled}
        onPress={onCheckout}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    elevation: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: colors.primary,
  },
  amount: {
    marginTop: 2,
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: colors.primary,
  },
  summary: {
    marginTop: 2,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  button: {
    marginTop: spacing.md,
  },
});
