import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontSizes, radius, spacing } from '../theme/colors';

interface Props {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export default function Badge({ label, style }: Props) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.danger,
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  text: {
    color: colors.textOnPrimary,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
});
