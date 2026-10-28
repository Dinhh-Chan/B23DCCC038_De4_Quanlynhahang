import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, radius, spacing } from '../theme/colors';

interface Props {
  title: string;
  count?: number;
}

// Tiêu đề nhóm món: vạch đỏ + tên nhóm + số món
export default function SectionHeader({ title, count }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.bar} />
      <Text style={styles.title}>{title}</Text>
      {count !== undefined ? (
        <View style={styles.countPill}>
          <Text style={styles.countText}>{count} món</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  bar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  countPill: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
  },
  countText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
