import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontSizes, radius, spacing } from '../theme/colors';
import { Order } from '../types';
import { formatPrice } from '../utils/format';
import { countItems } from '../utils/order';
import AppButton from './AppButton';

interface Props {
  order?: Order;
  subtotal: number;
  onClose: () => void;
  onAddDishes: () => void;
  onCheckout: () => void;
}

// Bảng chọn khi nhấn vào bàn đang phục vụ: Thêm món hoặc Thanh toán hoá đơn
export default function TableActionSheet({
  order,
  subtotal,
  onClose,
  onAddDishes,
  onCheckout,
}: Props) {
  const insets = useSafeAreaInsets();
  const bottomPadding = useMemo(
    () => ({ paddingBottom: insets.bottom + spacing.lg }),
    [insets.bottom],
  );

  return (
    <Modal
      visible={!!order}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        {order ? (
          <View style={[styles.sheet, bottomPadding]}>
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              <View style={styles.iconBox}>
                <Ionicons name="restaurant" size={22} color={colors.primary} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Bàn {order.tableNumber}</Text>
                <Text style={styles.sub}>Vào lúc {order.createdAt}</Text>
              </View>
              <Text style={styles.tag}>{order.status}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Số món</Text>
                <Text style={styles.statValue}>{countItems(order.items)}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Tạm tính</Text>
                <Text style={[styles.statValue, styles.statMoney]}>
                  {formatPrice(subtotal)}
                </Text>
              </View>
            </View>

            <Text style={styles.question}>Bạn muốn làm gì với bàn này?</Text>
            <AppButton
              title="Thêm món"
              icon="add-circle-outline"
              variant="light"
              onPress={onAddDishes}
            />
            <AppButton
              title="Thanh toán hoá đơn"
              icon="card-outline"
              onPress={onCheckout}
              style={styles.checkoutButton}
            />
            <AppButton
              title="Đóng"
              variant="outline"
              onPress={onClose}
              style={styles.closeButton}
            />
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  sub: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  stat: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  statValue: {
    marginTop: 2,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statMoney: {
    color: colors.primary,
  },
  question: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  checkoutButton: {
    marginTop: spacing.sm,
  },
  closeButton: {
    marginTop: spacing.sm,
  },
});
