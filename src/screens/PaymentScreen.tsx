import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComponentRef, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import FormInput from '../components/FormInput';
import InvoiceItemCard from '../components/InvoiceItemCard';
import ScreenHeader from '../components/ScreenHeader';
import { ORDER_STATUS } from '../constants';
import { useRestaurant } from '../context/RestaurantContext';
import { RootStackParamList } from '../navigation/types';
import { cardBase, colors, fontSizes, radius, spacing } from '../theme/colors';
import { formatPrice, onlyDigits } from '../utils/format';
import { calcVat } from '../utils/order';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

// Gợi ý nhanh số tiền khách đưa: vừa đủ, làm tròn lên 50k / 100k / 500k
function getSuggestions(total: number): number[] {
  if (total <= 0) {
    return [];
  }
  const values = [
    total,
    Math.ceil(total / 50000) * 50000,
    Math.ceil(total / 100000) * 100000,
    Math.ceil(total / 500000) * 500000,
  ];
  return Array.from(new Set(values));
}

export default function PaymentScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const { orders, dishes, payOrder } = useRestaurant();
  const [paidText, setPaidText] = useState('');
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  const order = orders.find(
    o => o.id === orderId && o.status === ORDER_STATUS.SERVING,
  );

  const lines = useMemo(
    () =>
      (order?.items ?? []).map(item => {
        const dish = dishes.find(d => d.id === item.dishId);
        return {
          dishId: item.dishId,
          category: dish?.category ?? null,
          name: dish?.name ?? 'Món không còn trong thực đơn',
          quantity: item.quantity,
          unitPrice: dish?.price ?? 0,
        };
      }),
    [order, dishes],
  );

  // Tạm tính, VAT 8%, Tổng cộng
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
  const vat = calcVat(subtotal);
  const total = subtotal + vat;

  // Tiền thừa = Tiền khách đưa - Tổng cộng (chỉ hiển thị khi >= 0)
  const hasInput = paidText.length > 0;
  const paid = hasInput ? Number(paidText) : 0;
  const isEnough = hasInput && paid >= total;
  const change = isEnough ? paid - total : 0;
  const paidError =
    hasInput && !isEnough
      ? `Số tiền khách đưa chưa đủ (thiếu ${formatPrice(total - paid)})`
      : undefined;
  const canPay = lines.length > 0 && isEnough;

  const handleConfirm = async () => {
    if (!order || !canPay) {
      return;
    }
    const success = await payOrder(order.id);
    if (!success) {
      Alert.alert('Lỗi', 'Không thể thanh toán hoá đơn này.');
      return;
    }
    navigation.popToTop();
    Alert.alert(
      'Thanh toán thành công',
      `Bàn ${order.tableNumber} đã thanh toán ${formatPrice(
        total,
      )}.\nTiền thừa trả khách: ${formatPrice(change)}`,
    );
  };

  const scrollToEnd = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250);

  if (!order) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <ScreenHeader
          eyebrow="Thanh toán"
          title="Hoá đơn"
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          title="Không tìm thấy hoá đơn"
          message="Hoá đơn có thể đã được thanh toán"
        />
      </SafeAreaView>
    );
  }

  const [startTime, startDate] = order.createdAt.split(' ');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScreenHeader
        eyebrow="Thanh toán"
        title="Thanh toán hoá đơn"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.tableCard}>
            <View style={styles.tableIcon}>
              <Ionicons name="restaurant" size={20} color={colors.primary} />
            </View>
            <View style={styles.tableInfo}>
              <Text style={styles.tableTitle}>Bàn số {order.tableNumber}</Text>
              <Text style={styles.statusTag}>{order.status}</Text>
            </View>
            <View style={styles.timeBox}>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.timeText}>{startTime}</Text>
              <Text style={styles.dateText}>{startDate}</Text>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <Ionicons name="receipt-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Chi tiết món đã gọi</Text>
            <Text style={styles.countPill}>{lines.length} món</Text>
          </View>
          {lines.length === 0 ? (
            <EmptyState title="Hoá đơn chưa có món nào" />
          ) : (
            lines.map(line => (
              <InvoiceItemCard
                key={line.dishId}
                category={line.category}
                name={line.name}
                quantity={line.quantity}
                unitPrice={line.unitPrice}
              />
            ))
          )}

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Tạm tính</Text>
              <Text style={styles.rowValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>VAT (8%)</Text>
              <Text style={styles.rowValue}>{formatPrice(vat)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <FormInput
              label="Tiền khách đưa"
              placeholder="Nhập số tiền khách đưa"
              icon="wallet-outline"
              suffix="VNĐ"
              value={paidText}
              onChangeText={text => setPaidText(onlyDigits(text))}
              onFocus={scrollToEnd}
              keyboardType="numeric"
              error={paidError}
              hint={hasInput ? `= ${formatPrice(paid)}` : undefined}
            />
            <View style={styles.suggestions}>
              {getSuggestions(total).map(value => {
                const selected = paidText === String(value);
                return (
                  <TouchableOpacity
                    key={value}
                    activeOpacity={0.7}
                    onPress={() => setPaidText(String(value))}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {formatPrice(value)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={[
                styles.changeBanner,
                isEnough ? styles.changeBannerOk : styles.changeBannerIdle,
              ]}
            >
              <Ionicons
                name={isEnough ? 'checkmark-circle' : 'time-outline'}
                size={18}
                color={isEnough ? colors.success : colors.textMuted}
              />
              <Text
                style={[styles.changeLabel, isEnough && styles.changeLabelOk]}
              >
                Tiền thừa trả khách:
              </Text>
              <Text
                style={[styles.changeValue, isEnough && styles.changeValueOk]}
              >
                {isEnough ? formatPrice(change) : '—'}
              </Text>
            </View>
          </View>

          <AppButton
            title="Xác nhận thanh toán"
            icon="checkmark-done-outline"
            disabled={!canPay}
            onPress={handleConfirm}
            style={styles.confirmButton}
          />
          <AppButton
            title="Quay lại gọi món"
            icon="arrow-back"
            variant="light"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  tableCard: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  tableInfo: {
    flex: 1,
  },
  tableTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusTag: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.successLight,
    color: colors.success,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  timeBox: {
    alignItems: 'flex-end',
  },
  timeText: {
    marginTop: 2,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  countPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.round,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  card: {
    ...cardBase,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  rowLabel: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: colors.primary,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.primary,
  },
  changeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  changeBannerIdle: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  changeBannerOk: {
    backgroundColor: colors.successLight,
    borderColor: colors.successBorder,
  },
  changeLabel: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  changeLabelOk: {
    color: colors.success,
    fontWeight: '600',
  },
  changeValue: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  changeValueOk: {
    color: colors.success,
  },
  confirmButton: {
    marginTop: spacing.xl,
  },
  backButton: {
    marginTop: spacing.md,
  },
});
