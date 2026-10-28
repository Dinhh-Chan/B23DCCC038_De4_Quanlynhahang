import { ReactNode, useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  cardShadow,
  colors,
  fontSizes,
  radius,
  spacing,
} from '../theme/colors';

interface Props {
  eyebrow?: string;
  title: string;
  onBack?: () => void;
  showActions?: boolean;
  children?: ReactNode;
}

// Header: dòng nhỏ chữ đỏ in hoa + tiêu đề lớn; tuỳ chọn nút quay lại, chuông, avatar
export default function ScreenHeader({
  eyebrow = 'Quản lý nhà hàng',
  title,
  onBack,
  showActions = false,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const topPadding = useMemo(
    () => ({ paddingTop: insets.top + spacing.md }),
    [insets.top],
  );

  return (
    <View style={[styles.container, topPadding]}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            hitSlop={8}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        ) : null}
        <View style={styles.titles}>
          <Text style={styles.eyebrow} numberOfLines={1}>
            {eyebrow.toUpperCase()}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        {showActions ? (
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => Alert.alert('Thông báo', 'Chưa có thông báo mới.')}
              style={styles.iconButton}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert('Tài khoản', 'Đang đăng nhập: Quản lý nhà hàng')
              }
              style={styles.avatar}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.textOnPrimary}
              />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    ...cardShadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titles: {
    flex: 1,
  },
  eyebrow: {
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: colors.primary,
  },
  title: {
    marginTop: 2,
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
