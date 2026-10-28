import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComponentRef, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import CategoryPicker from '../components/CategoryPicker';
import DishImage from '../components/DishImage';
import EmptyState from '../components/EmptyState';
import FormInput from '../components/FormInput';
import ScreenHeader from '../components/ScreenHeader';
import { useRestaurant } from '../context/RestaurantContext';
import { RootStackParamList } from '../navigation/types';
import { cardBase, colors, fontSizes, radius, spacing } from '../theme/colors';
import { Category } from '../types';
import { formatPrice } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'DishForm'>;

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
}

function validatePrice(priceText: string): string | undefined {
  const trimmed = priceText.trim();
  if (!trimmed) {
    return 'Vui lòng nhập giá bán';
  }
  const price = Number(trimmed);
  if (isNaN(price)) {
    return 'Giá bán phải là số hợp lệ';
  }
  if (price <= 0) {
    return 'Giá bán phải lớn hơn 0';
  }
  if (price % 1000 !== 0) {
    return 'Giá bán phải là bội số của 1.000 (VD: 45000)';
  }
  return undefined;
}

export default function DishFormScreen({ route, navigation }: Props) {
  const dishId = route.params?.dishId;
  const { dishes, addDish, updateDish, isDishNameTaken } = useRestaurant();
  const editingDish = dishId ? dishes.find(d => d.id === dishId) : undefined;
  const isEdit = !!dishId;
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  // Chế độ Sửa: điền sẵn dữ liệu cũ
  const [name, setName] = useState(editingDish?.name ?? '');
  const [category, setCategory] = useState<Category | null>(
    editingDish?.category ?? null,
  );
  const [priceText, setPriceText] = useState(
    editingDish ? String(editingDish.price) : '',
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const title = isEdit ? 'Sửa món ăn' : 'Thêm món mới';

  if (isEdit && !editingDish) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <ScreenHeader
          eyebrow="Thực đơn"
          title={title}
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          title="Không tìm thấy món ăn"
          message="Món này có thể đã bị xoá"
        />
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!name.trim()) {
      nextErrors.name = 'Vui lòng nhập tên món';
    } else if (isDishNameTaken(name, dishId)) {
      nextErrors.name = 'Tên món đã tồn tại, vui lòng chọn tên khác';
    }
    if (!category) {
      nextErrors.category = 'Vui lòng chọn loại món';
    }
    const priceError = validatePrice(priceText);
    if (priceError) {
      nextErrors.price = priceError;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !category) {
      return;
    }
    const input = {
      name: name.trim(),
      category,
      price: Number(priceText.trim()),
    };
    if (isEdit && dishId) {
      await updateDish(dishId, input);
    } else {
      await addDish(input);
    }
    navigation.goBack();
  };

  const priceValid = priceText.trim() !== '' && !validatePrice(priceText);
  const scrollToEnd = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScreenHeader
        eyebrow="Thực đơn"
        title={title}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.preview}>
            <DishImage
              name={name}
              category={category}
              iconSize={28}
              style={styles.previewImage}
            />
            <View style={styles.previewInfo}>
              <Text style={styles.previewLabel}>Xem trước món</Text>
              <Text style={styles.previewName} numberOfLines={1}>
                {name.trim() || 'Tên món'}
              </Text>
              <Text style={styles.previewMeta}>
                {category ?? 'Chưa chọn loại'}
                {priceValid
                  ? ` · ${formatPrice(Number(priceText.trim()))}`
                  : ''}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <FormInput
              label="Tên món ăn *"
              placeholder="VD: Phở bò tái"
              icon="fast-food-outline"
              value={name}
              onChangeText={text => {
                setName(text);
                setErrors(prev => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              autoCapitalize="sentences"
            />
            <CategoryPicker
              value={category}
              onChange={value => {
                setCategory(value);
                setErrors(prev => ({ ...prev, category: undefined }));
              }}
              error={errors.category}
            />
            <FormInput
              label="Giá bán (VNĐ) *"
              placeholder="VD: 45000"
              icon="cash-outline"
              suffix="VNĐ"
              value={priceText}
              onChangeText={text => {
                setPriceText(text);
                setErrors(prev => ({ ...prev, price: undefined }));
              }}
              onFocus={scrollToEnd}
              keyboardType="numeric"
              error={errors.price}
              hint={
                priceValid
                  ? `Hiển thị: ${formatPrice(Number(priceText.trim()))}`
                  : 'Quy tắc: lớn hơn 0 và là bội số của 1.000'
              }
            />
          </View>

          <AppButton
            title={isEdit ? 'Lưu thay đổi' : 'Thêm món'}
            icon="save-outline"
            onPress={handleSave}
            style={styles.saveButton}
          />
          <AppButton
            title="Huỷ / Quay lại"
            icon="close"
            variant="light"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  preview: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  previewImage: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    marginRight: spacing.md,
  },
  previewInfo: {
    flex: 1,
  },
  previewLabel: {
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
    color: colors.primary,
  },
  previewName: {
    marginTop: 2,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  previewMeta: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  card: {
    ...cardBase,
    padding: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
  cancelButton: {
    marginTop: spacing.md,
  },
});
