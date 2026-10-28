import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontSizes, radius, spacing } from '../theme/colors';
import { formatPrice } from '../utils/format';

interface Props {
  dishCount: number;
  availableCount: number;
  occupiedCount: number;
  tableCount: number;
  servingTotal: number;
}

// Thẻ thống kê đầu màn Thực đơn: "12 món · 3/10 bàn có khách"
export default function SummaryCard({
  dishCount,
  availableCount,
  occupiedCount,
  tableCount,
  servingTotal,
}: Props) {
  const stats = [
    {
      icon: 'checkmark-circle-outline',
      color: colors.success,
      label: `${availableCount} Còn món`,
    },
    {
      icon: 'close-circle-outline',
      color: colors.primary,
      label: `${dishCount - availableCount} Hết món`,
    },
    {
      icon: 'people-outline',
      color: colors.textSecondary,
      label: `${tableCount - occupiedCount} Bàn trống`,
    },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.liveDot} />
        <Text style={styles.title}>Ca làm việc đang hoạt động</Text>
      </View>
      <View style={styles.mainRow}>
        <Text style={styles.summary}>
          {`${dishCount} món · ${occupiedCount}/${tableCount} bàn có khách`}
        </Text>
        <View style={styles.revenue}>
          <Text style={styles.revenueLabel}>Đang phục vụ</Text>
          <Text style={styles.revenueValue}>{formatPrice(servingTotal)}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        {stats.map(stat => (
          <View key={stat.label} style={styles.stat}>
            <Ionicons name={stat.icon} size={16} color={stat.color} />
            <Text style={styles.statText}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAccent,
    marginTop: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: radius.round,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  summary: {
    flex: 1,
    marginRight: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  revenue: {
    alignItems: 'flex-end',
  },
  revenueLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  revenueValue: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statText: {
    marginLeft: spacing.xs,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
