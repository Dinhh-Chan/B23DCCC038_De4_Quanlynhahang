import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fontSizes, radius, spacing } from '../theme/colors';

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  increaseDisabled?: boolean;
}

// Cụm nút [-] Số lượng [+]
export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  increaseDisabled = false,
}: Props) {
  const decreaseDisabled = quantity <= 0;

  return (
    <View style={styles.row}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrease}
        disabled={decreaseDisabled}
        hitSlop={6}
        style={[
          styles.button,
          decreaseDisabled ? styles.buttonDisabled : styles.buttonMinus,
        ]}
      >
        <Ionicons
          name="remove"
          size={18}
          color={decreaseDisabled ? colors.disabledText : colors.textPrimary}
        />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrease}
        disabled={increaseDisabled}
        hitSlop={6}
        style={[
          styles.button,
          increaseDisabled ? styles.buttonDisabled : styles.buttonPlus,
        ]}
      >
        <Ionicons
          name="add"
          size={18}
          color={increaseDisabled ? colors.disabledText : colors.textOnPrimary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMinus: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPlus: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  quantity: {
    minWidth: 28,
    marginHorizontal: spacing.xs,
    textAlign: 'center',
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
});
