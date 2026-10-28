import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { cardBase, colors, fontSizes, radius, spacing } from '../theme/colors';
import { Order } from '../types';
import { formatPrice } from '../utils/format';
import { countItems } from '../utils/order';

interface Props {
  tableNumber: number;
  order?: Order;
  subtotal: number;
  onPress: () => void;
}

// Bàn trống: nền trắng viền xanh lá; Bàn có khách: nền đỏ nhạt viền đỏ
export default function TableCard({
  tableNumber,
  order,
  subtotal,
  onPress,
}: Props) {
  const occupied = !!order;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.card, occupied ? styles.cardOccupied : styles.cardEmpty]}
    >
      <View style={styles.topRow}>
        <Text style={styles.name}>Bàn {tableNumber}</Text>
        <Ionicons
          name={occupied ? 'restaurant' : 'checkmark-circle-outline'}
          size={16}
          color={occupied ? colors.primary : colors.success}
        />
      </View>
      <Text
        style={[styles.tag, occupied ? styles.tagOccupied : styles.tagEmpty]}
      >
        {occupied ? 'Phục vụ' : 'Trống'}
      </Text>
      {order ? (
        <>
          <Text style={styles.amount}>{formatPrice(subtotal)}</Text>
          <Text style={styles.sub}>
            {countItems(order.items)} món · {order.createdAt.split(' ')[0]}
          </Text>
        </>
      ) : (
        <Text style={styles.empty}>--</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardBase,
    flex: 1,
    minHeight: 104,
    margin: spacing.xs,
    padding: spacing.md,
    borderWidth: 1.5,
  },
  cardEmpty: {
    borderColor: colors.successBorder,
  },
  cardOccupied: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tag: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  tagEmpty: {
    backgroundColor: colors.successLight,
    color: colors.success,
  },
  tagOccupied: {
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
  },
  amount: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sub: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  empty: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.textMuted,
  },
});
