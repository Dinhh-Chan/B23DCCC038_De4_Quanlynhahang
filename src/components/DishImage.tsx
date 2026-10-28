import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CATEGORY_ICON } from '../constants';
import { colors, radius } from '../theme/colors';
import { Category } from '../types';
import { getDishPhoto } from '../utils/dish';

interface Props {
  name: string;
  category: Category | null;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}

// Ảnh chụp món ăn; món chưa có ảnh thì hiện khung xám + icon loại món
export default function DishImage({
  name,
  category,
  iconSize = 28,
  style,
}: Props) {
  const photo = getDishPhoto(name);

  return (
    <View style={[styles.box, style]}>
      {photo ? (
        <Image source={photo} style={styles.photo} resizeMode="cover" />
      ) : (
        <Ionicons
          name={category ? CATEGORY_ICON[category] : 'restaurant-outline'}
          size={iconSize}
          color={colors.textMuted}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
