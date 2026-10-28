import { StyleSheet, Text, View } from 'react-native';
import { cardBase, colors, fontSizes, radius, spacing } from '../theme/colors';
import { Category } from '../types';
import { formatPrice } from '../utils/format';
import DishImage from './DishImage';

interface Props {
  name: string;
  category: Category | null;
  quantity: number;
  unitPrice: number;
}

// 1 dòng hoá đơn: Tên món, Số lượng, Đơn giá, Thành tiền
export default function InvoiceItemCard({
  name,
  category,
  quantity,
  unitPrice,
}: Props) {
  return (
    <View style={styles.card}>
      <DishImage
        name={name}
        category={category}
        iconSize={20}
        style={styles.thumb}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.detailRow}>
          <Text style={styles.qty}>x{quantity}</Text>
          <Text style={styles.detail}>Đơn giá: {formatPrice(unitPrice)}</Text>
        </View>
      </View>
      <Text style={styles.total}>{formatPrice(quantity * unitPrice)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  qty: {
    marginRight: spacing.sm,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  total: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
});
