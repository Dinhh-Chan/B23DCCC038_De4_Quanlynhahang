import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartBar from '../components/CartBar';
import EmptyState from '../components/EmptyState';
import OrderDishRow from '../components/OrderDishRow';
import ScreenHeader from '../components/ScreenHeader';
import SectionHeader from '../components/SectionHeader';
import { useRestaurant } from '../context/RestaurantContext';
import { RootStackParamList } from '../navigation/types';
import { colors, fontSizes, radius, spacing } from '../theme/colors';
import {
  calcSubtotal,
  countItems,
  groupDishesByCategory,
} from '../utils/order';

type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;

export default function OrderScreen({ route, navigation }: Props) {
  const { tableNumber } = route.params;
  const { dishes, getServingOrder, changeItemQuantity } = useRestaurant();

  // Bàn đã có hoá đơn "Đang phục vụ" thì load lại đúng hoá đơn đó
  const order = getServingOrder(tableNumber);
  const sections = useMemo(() => groupDishesByCategory(dishes), [dishes]);

  const quantities = useMemo(() => {
    const map: Record<string, number> = {};
    order?.items.forEach(item => {
      map[item.dishId] = item.quantity;
    });
    return map;
  }, [order]);

  const items = order?.items ?? [];
  const subtotal = calcSubtotal(items, dishes);
  const summary = items
    .map(item => {
      const dish = dishes.find(d => d.id === item.dishId);
      return dish ? `${dish.name} x${item.quantity}` : '';
    })
    .filter(Boolean)
    .join(', ');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScreenHeader
        eyebrow="Gọi món"
        title={`Bàn ${tableNumber}`}
        onBack={() => navigation.goBack()}
      >
        <View style={styles.infoRow}>
          <Text
            style={[
              styles.statusTag,
              order ? styles.statusServing : styles.statusEmpty,
            ]}
          >
            {order ? 'Đang phục vụ' : 'Bàn trống'}
          </Text>
          {order ? (
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.textSecondary}
              style={styles.timeIcon}
            />
          ) : null}
          <Text style={styles.infoText} numberOfLines={1}>
            {order
              ? `Vào lúc ${order.createdAt}`
              : 'Chọn món để mở hoá đơn mới'}
          </Text>
        </View>
      </ScreenHeader>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} />
        )}
        renderItem={({ item }) => (
          <OrderDishRow
            dish={item}
            quantity={quantities[item.id] ?? 0}
            onIncrease={() => changeItemQuantity(tableNumber, item.id, 1)}
            onDecrease={() => changeItemQuantity(tableNumber, item.id, -1)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Thực đơn chưa có món nào"
            message="Hãy thêm món ở tab Thực đơn trước"
          />
        }
      />

      <CartBar
        tableNumber={tableNumber}
        itemCount={countItems(items)}
        summary={summary}
        subtotal={subtotal}
        disabled={items.length === 0}
        onCheckout={() => {
          if (order) {
            navigation.navigate('Payment', { orderId: order.id });
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statusTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  statusServing: {
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
  },
  statusEmpty: {
    backgroundColor: colors.successLight,
    color: colors.success,
  },
  timeIcon: {
    marginLeft: spacing.sm,
  },
  infoText: {
    flex: 1,
    marginLeft: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
});
