import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontSizes, spacing } from '../theme/colors';

interface TabItem<K extends string> {
  key: K;
  label: string;
  icon: string;
}

interface Props<K extends string> {
  tabs: TabItem<K>[];
  activeKey: K;
  onChange: (key: K) => void;
}

// Thanh chuyển tab tự code (Thực đơn / Sơ đồ bàn)
export default function BottomTabBar<K extends string>({
  tabs,
  activeKey,
  onChange,
}: Props<K>) {
  return (
    <View style={styles.bar}>
      {tabs.map(tab => {
        const active = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => onChange(tab.key)}
            style={styles.item}
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={active ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
            <View
              style={[styles.indicator, active && styles.indicatorActive]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  label: {
    marginTop: 2,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  indicator: {
    width: 20,
    height: 3,
    marginTop: spacing.xs,
    borderRadius: 2,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
  },
});
