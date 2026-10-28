import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../components/BottomTabBar';
import ScreenHeader from '../components/ScreenHeader';
import { useRestaurant } from '../context/RestaurantContext';
import { colors, fontSizes, spacing } from '../theme/colors';
import MenuScreen from './MenuScreen';
import TablesScreen from './TablesScreen';

type TabKey = 'menu' | 'tables';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'menu', label: 'Thực đơn', icon: 'restaurant-outline' },
  { key: 'tables', label: 'Sơ đồ bàn', icon: 'grid-outline' },
];

const TITLES: Record<TabKey, string> = {
  menu: 'Thực Đơn',
  tables: 'Sơ Đồ Bàn',
};

// Màn hình chính: header + nội dung tab (Thực đơn / Sơ đồ bàn) + thanh tab
export default function MainScreen() {
  const { loading } = useRestaurant();
  const [activeTab, setActiveTab] = useState<TabKey>('menu');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScreenHeader title={TITLES[activeTab]} showActions />
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : activeTab === 'menu' ? (
          <MenuScreen />
        ) : (
          <TablesScreen />
        )}
      </View>
      <BottomTabBar tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
});
