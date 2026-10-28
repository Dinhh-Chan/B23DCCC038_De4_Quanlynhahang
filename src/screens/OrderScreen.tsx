import { usePreventRemove } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Alert, SectionList, StyleSheet, Text, View } from 'react-native';
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
import { Dish, OrderItem } from '../types';
import {
  calcSubtotal,
  changeQuantity,
  countItems,
  groupDishesByCategory,
  isSameItems,
} from '../utils/order';

type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;

export default function OrderScreen({ route, navigation }: Props) {
  const { tableNumber } = route.params;
  const { dishes, getServingOrder, saveOrderItems } = useRestaurant();

  // Bàn đã có hoá đơn "Đang phục vụ" thì load lại đúng items của hoá đơn đó
  const order = getServingOrder(tableNumber);
  const [draftItems, setDraftItems] = useState<OrderItem[]>(
    () => order?.items ?? [],
  );
  // Giỏ đã lưu gần nhất, dùng để biết có thay đổi chưa xác nhận hay không
  const [savedItems, setSavedItems] = useState<OrderItem[]>(
    () => order?.items ?? [],
  );
  const [leaving, setLeaving] = useState(false);
  const dirty = !isSameItems(draftItems, savedItems);

  const sections = useMemo(() => groupDishesByCategory(dishes), [dishes]);
  const quantities = useMemo(() => {
    const map: Record<string, number> = {};
    draftItems.forEach(item => {
      map[item.dishId] = item.quantity;
    });
    return map;
  }, [draftItems]);

  const subtotal = calcSubtotal(draftItems, dishes);
  const summary = draftItems
    .map(item => {
      const dish = dishes.find(d => d.id === item.dishId);
      return dish ? `${dish.name} x${item.quantity}` : '';
    })
    .filter(Boolean)
    .join(', ');

  // Rời màn hình khi còn món chưa xác nhận -> hỏi lại
  usePreventRemove(dirty && !leaving, ({ data }) => {
    Alert.alert(
      'Bỏ thay đổi?',
      'Các món vừa chọn chưa được xác nhận. Bạn có muốn bỏ thay đổi?',
      [
        { text: 'Ở lại', style: 'cancel' },
        {
          text: 'Bỏ thay đổi',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });

  // Sau khi xác nhận xong thì quay về Sơ đồ bàn
  useEffect(() => {
    if (leaving) {
      navigation.goBack();
    }
  }, [leaving, navigation]);

  const handleChange = (dish: Dish, delta: 1 | -1) => {
    if (delta > 0 && !dish.available) {
      return;
    }
    setDraftItems(prev => changeQuantity(prev, dish.id, delta));
  };

  const commit = async () => {
    const orderId = await saveOrderItems(tableNumber, draftItems);
    setSavedItems(draftItems);
    return orderId;
  };

  const handleConfirm = () => {
    if (!dirty) {
      return;
    }
    if (draftItems.length === 0) {
      Alert.alert(
        'Huỷ hoá đơn?',
        `Bàn ${tableNumber} không còn món nào. Hoá đơn sẽ bị huỷ và bàn trở về trạng thái trống.`,
        [
          { text: 'Không', style: 'cancel' },
          {
            text: 'Huỷ hoá đơn',
            style: 'destructive',
            onPress: async () => {
              await commit();
              setLeaving(true);
            },
          },
        ],
      );
      return;
    }
    commit().then(() => setLeaving(true));
  };

  const handleCheckout = async () => {
    if (draftItems.length === 0) {
      return;
    }
    const orderId = dirty ? await commit() : order?.id ?? null;
    if (orderId) {
      navigation.navigate('Payment', { orderId });
    }
  };

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
              : 'Chọn món rồi bấm Xác nhận đặt món'}
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
            onIncrease={() => handleChange(item, 1)}
            onDecrease={() => handleChange(item, -1)}
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
        itemCount={countItems(draftItems)}
        summary={summary}
        subtotal={subtotal}
        dirty={dirty}
        confirmDisabled={!dirty}
        checkoutDisabled={draftItems.length === 0}
        onConfirm={handleConfirm}
        onCheckout={handleCheckout}
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
