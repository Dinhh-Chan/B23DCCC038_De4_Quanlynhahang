import { StyleSheet, Text, View } from 'react-native';
import { cardBase, colors, fontSizes, radius, spacing } from '../theme/colors';
import { Dish } from '../types';
import { formatPrice } from '../utils/format';
import DishImage from './DishImage';
import QuantityControl from './QuantityControl';

interface Props {
  dish: Dish;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

// 1 dòng món trong màn Gọi món; món hết bị làm mờ và khoá nút [+]
export default function OrderDishRow({
  dish,
  quantity,
  onIncrease,
  onDecrease,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        quantity > 0 && styles.cardSelected,
        !dish.available && styles.cardUnavailable,
      ]}
    >
      <View>
        <DishImage
          name={dish.name}
          category={dish.category}
          iconSize={22}
          style={styles.thumb}
        />
        {!dish.available && (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>HẾT</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text
          style={[styles.name, !dish.available && styles.nameUnavailable]}
          numberOfLines={1}
        >
          {dish.name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {dish.available ? dish.category : 'Tạm hết món'}
        </Text>
        <Text style={styles.price}>{formatPrice(dish.price)}</Text>
      </View>
      <QuantityControl
        quantity={quantity}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        increaseDisabled={!dish.available}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1.5,
  },
  cardSelected: {
    borderColor: colors.primaryBorder,
  },
  cardUnavailable: {
    opacity: 0.55,
    backgroundColor: colors.surface,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
  },
  soldOut: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.sm,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: colors.textOnPrimary,
  },
  info: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  nameUnavailable: {
    textDecorationLine: 'line-through',
  },
  sub: {
    marginTop: 2,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  price: {
    marginTop: 2,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
