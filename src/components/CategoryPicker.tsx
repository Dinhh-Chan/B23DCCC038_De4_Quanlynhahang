import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CATEGORIES, CATEGORY_ICON } from '../constants';
import { colors, fontSizes, radius, spacing } from '../theme/colors';
import { Category } from '../types';

interface Props {
  value: Category | null;
  onChange: (category: Category) => void;
  error?: string;
}

// 4 nút chọn loại món: nút đang chọn tô màu nhấn, còn lại nền nhạt
export default function CategoryPicker({ value, onChange, error }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Loại món *</Text>
      <View style={styles.options}>
        {CATEGORIES.map(category => {
          const selected = category === value;
          return (
            <TouchableOpacity
              key={category}
              activeOpacity={0.7}
              onPress={() => onChange(category)}
              style={[
                styles.option,
                selected && styles.optionSelected,
                error ? styles.optionError : null,
              ]}
            >
              <Ionicons
                name={CATEGORY_ICON[category]}
                size={18}
                color={selected ? colors.textOnPrimary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.optionText,
                  selected && styles.optionTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    flexGrow: 1,
    flexBasis: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionError: {
    borderColor: colors.danger,
  },
  optionText: {
    marginLeft: spacing.sm,
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionTextSelected: {
    color: colors.textOnPrimary,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.danger,
  },
});
