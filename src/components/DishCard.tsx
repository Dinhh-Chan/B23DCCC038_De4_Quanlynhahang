import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { cardBase, colors, fontSizes, radius, spacing } from '../theme/colors';
import { Dish } from '../types';
import { formatPrice } from '../utils/format';
import Badge from './Badge';
import DishImage from './DishImage';

interface Props {
  dish: Dish;
  onPress: () => void;
  onLongPress: () => void;
  onToggleAvailable: (available: boolean) => void;
}

// 1 dòng món ăn: ảnh, tên, giá, loại món; Switch bên phải bật/tắt còn món
export default function DishCard({
  dish,
  onPress,
  onLongPress,
  onToggleAvailable,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={[styles.card, !dish.available && styles.cardUnavailable]}
    >
      <DishImage
        name={dish.name}
        category={dish.category}
        iconSize={24}
        style={styles.thumb}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {dish.name}
        </Text>
        <Text style={styles.price}>{formatPrice(dish.price)}</Text>
        <View style={styles.tags}>
          <Text style={styles.categoryTag}>{dish.category}</Text>
          {!dish.available && <Badge label="Hết món" style={styles.badge} />}
        </View>
      </View>
      <View style={styles.switchBox}>
        <Switch
          value={dish.available}
          onValueChange={onToggleAvailable}
          trackColor={{ false: colors.disabled, true: colors.success }}
          thumbColor={colors.card}
        />
        <Text
          style={[
            styles.status,
            dish.available ? styles.statusOn : styles.statusOff,
          ]}
        >
          {dish.available ? 'Còn món' : 'Hết món'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardUnavailable: {
    opacity: 0.5,
  },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: radius.sm,
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  price: {
    marginTop: 2,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  categoryTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.round,
    overflow: 'hidden',
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  badge: {
    marginLeft: spacing.xs,
  },
  switchBox: {
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  status: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  statusOn: {
    color: colors.success,
  },
  statusOff: {
    color: colors.textMuted,
  },
});
