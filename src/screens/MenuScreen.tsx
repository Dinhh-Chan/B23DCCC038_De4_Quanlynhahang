import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Alert, SectionList, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../components/AppButton';
import DishCard from '../components/DishCard';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';
import SummaryCard from '../components/SummaryCard';
import { TABLE_COUNT } from '../constants';
import { useRestaurant } from '../context/RestaurantContext';
import { RootNavigation } from '../navigation/types';
import { colors, fontSizes, radius, spacing } from '../theme/colors';
import { Dish } from '../types';
import { calcSubtotal, groupDishesByCategory } from '../utils/order';

export default function MenuScreen() {
  const navigation = useNavigation<RootNavigation>();
  const {
    dishes,
    servingOrders,
    setDishAvailable,
    deleteDish,
    isDishInServingOrder,
  } = useRestaurant();

  const sections = useMemo(() => groupDishesByCategory(dishes), [dishes]);
  const occupiedCount = useMemo(
    () => new Set(servingOrders.map(o => o.tableNumber)).size,
    [servingOrders],
  );
  const servingTotal = useMemo(
    () =>
      servingOrders.reduce((sum, o) => sum + calcSubtotal(o.items, dishes), 0),
    [servingOrders, dishes],
  );
  const availableCount = dishes.filter(d => d.available).length;

  // Nhấn giữ để xoá: chặn nếu món đang nằm trong hoá đơn "Đang phục vụ"
  const handleDelete = (dish: Dish) => {
    if (isDishInServingOrder(dish.id)) {
      Alert.alert(
        'Không thể xoá',
        `Không thể xoá món "${dish.name}" vì đang được phục vụ tại bàn!`,
      );
      return;
    }
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá món "${dish.name}"?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const deleted = await deleteDish(dish.id);
            if (!deleted) {
              Alert.alert(
                'Không thể xoá',
                'Không thể xoá món đang được phục vụ tại bàn!',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <SummaryCard
              dishCount={dishes.length}
              availableCount={availableCount}
              occupiedCount={occupiedCount}
              tableCount={TABLE_COUNT}
              servingTotal={servingTotal}
            />
            {dishes.length > 0 ? (
              <View style={styles.hintRow}>
                <Ionicons
                  name="hand-left-outline"
                  size={14}
                  color={colors.textMuted}
                />
                <Text style={styles.hint}>Chạm để sửa · Nhấn giữ để xoá</Text>
              </View>
            ) : null}
          </>
        }
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} count={section.data.length} />
        )}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onPress={() => navigation.navigate('DishForm', { dishId: item.id })}
            onLongPress={() => handleDelete(item)}
            onToggleAvailable={value => setDishAvailable(item.id, value)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có món ăn nào"
            message='Nhấn "+ Thêm món mới" để tạo món đầu tiên'
          />
        }
      />
      <AppButton
        title="+ Thêm món mới"
        onPress={() => navigation.navigate('DishForm')}
        style={styles.fab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 96, // chừa chỗ cho nút nổi "+ Thêm món mới"
    flexGrow: 1,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  hint: {
    marginLeft: spacing.xs,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    borderRadius: radius.round,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
