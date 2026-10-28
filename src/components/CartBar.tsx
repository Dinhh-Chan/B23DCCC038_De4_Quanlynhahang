import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, radius, spacing } from '../theme/colors';
import { formatPrice } from '../utils/format';
import AppButton from './AppButton';

interface Props {
  tableNumber: number;
  itemCount: number;
  summary: string;
  subtotal: number;
  dirty: boolean;
  confirmDisabled: boolean;
  checkoutDisabled: boolean;
  onConfirm: () => void;
  onCheckout: () => void;
}

// Khung cuối màn Gọi món: tạm tính real-time + Xác nhận đặt món / Thanh toán
export default function CartBar({
  tableNumber,
  itemCount,
  summary,
  subtotal,
  dirty,
  confirmDisabled,
  checkoutDisabled,
  onConfirm,
  onCheckout,
}: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {`TẠM TÍNH (${itemCount} MÓN · BÀN ${tableNumber})`}
        </Text>
        {dirty ? <Text style={styles.dirtyTag}>Chưa xác nhận</Text> : null}
      </View>
      <Text style={styles.amount}>{formatPrice(subtotal)}</Text>
      <Text style={styles.summary} numberOfLines={1}>
        {summary || 'Nhấn + để thêm món vào hoá đơn'}
      </Text>
      <View style={styles.buttons}>
        <AppButton
          title="Thanh toán"
          icon="card-outline"
          variant="light"
          disabled={checkoutDisabled}
          onPress={onCheckout}
          style={styles.checkoutButton}
        />
        <AppButton
          title="Xác nhận đặt món"
          icon="checkmark-circle-outline"
          disabled={confirmDisabled}
          onPress={onConfirm}
          style={styles.confirmButton}
        />
      </View>
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: colors.primary,
  },
  dirtyTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
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
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  checkoutButton: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  confirmButton: {
    flex: 1.6,
    paddingHorizontal: spacing.md,
  },
});
