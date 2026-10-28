import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EmptyState from '../components/EmptyState';
import TableActionSheet from '../components/TableActionSheet';
import TableCard from '../components/TableCard';
import { TABLE_COUNT } from '../constants';
import { useRestaurant } from '../context/RestaurantContext';
import { RootNavigation } from '../navigation/types';
import { cardBase, colors, fontSizes, radius, spacing } from '../theme/colors';
import { calcSubtotal } from '../utils/order';

const TABLE_NUMBERS = Array.from({ length: TABLE_COUNT }, (_, i) => i + 1);

export default function TablesScreen() {
  const navigation = useNavigation<RootNavigation>();
  const { dishes, servingOrders, getServingOrder } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const occupiedCount = useMemo(
    () => new Set(servingOrders.map(o => o.tableNumber)).size,
    [servingOrders],
  );
  const selectedOrder =
    selectedTable !== null ? getServingOrder(selectedTable) : undefined;

  // Bàn trống -> vào Gọi món; Bàn đang phục vụ -> mở bảng chọn
  const handlePressTable = (tableNumber: number) => {
    if (getServingOrder(tableNumber)) {
      setSelectedTable(tableNumber);
    } else {
      navigation.navigate('Order', { tableNumber });
    }
  };

  const closeSheet = () => setSelectedTable(null);

  return (
    <>
      <FlatList
        data={TABLE_NUMBERS}
        numColumns={3}
        keyExtractor={item => String(item)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.areaRow}>
              <Ionicons name="grid-outline" size={16} color={colors.primary} />
              <Text style={styles.areaText}>
                Khu vực chính · {TABLE_COUNT} bàn
              </Text>
            </View>
            <View style={styles.chips}>
              <Text style={[styles.chip, styles.chipEmpty]}>
                {TABLE_COUNT - occupiedCount} Trống
              </Text>
              <Text style={[styles.chip, styles.chipOccupied]}>
                {occupiedCount} Có khách
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const order = getServingOrder(item);
          return (
            <TableCard
              tableNumber={item}
              order={order}
              subtotal={order ? calcSubtotal(order.items, dishes) : 0}
              onPress={() => handlePressTable(item)}
            />
          );
        }}
        ListFooterComponent={
          <Text style={styles.footerHint}>
            Bàn trống: chạm để gọi món · Bàn có khách: thêm món hoặc thanh toán
          </Text>
        }
        ListEmptyComponent={<EmptyState title="Chưa có bàn nào" />}
      />

      <TableActionSheet
        order={selectedOrder}
        subtotal={selectedOrder ? calcSubtotal(selectedOrder.items, dishes) : 0}
        onClose={closeSheet}
        onAddDishes={() => {
          if (selectedTable !== null) {
            navigation.navigate('Order', { tableNumber: selectedTable });
          }
          closeSheet();
        }}
        onCheckout={() => {
          if (selectedOrder) {
            navigation.navigate('Payment', { orderId: selectedOrder.id });
          }
          closeSheet();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  header: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  areaText: {
    marginLeft: spacing.xs,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.round,
    overflow: 'hidden',
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  chipEmpty: {
    backgroundColor: colors.successLight,
    color: colors.success,
  },
  chipOccupied: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
  footerHint: {
    marginTop: spacing.md,
    textAlign: 'center',
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
});
