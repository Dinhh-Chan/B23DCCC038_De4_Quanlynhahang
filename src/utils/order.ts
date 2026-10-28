import { CATEGORIES, VAT_RATE } from '../constants';
import { Category, Dish, OrderItem } from '../types';

// Tạm tính = Σ (đơn giá × số lượng)
export function calcSubtotal(items: OrderItem[], dishes: Dish[]): number {
  return items.reduce((sum, item) => {
    const dish = dishes.find(d => d.id === item.dishId);
    return sum + (dish ? dish.price * item.quantity : 0);
  }, 0);
}

export function calcVat(subtotal: number): number {
  return Math.round(subtotal * VAT_RATE);
}

export function countItems(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

// [+]: tăng 1 (chưa có thì thêm mới quantity = 1)
// [-]: giảm 1, về 0 thì bỏ món khỏi danh sách
export function changeQuantity(
  items: OrderItem[],
  dishId: string,
  delta: 1 | -1,
): OrderItem[] {
  const target = items.find(item => item.dishId === dishId);
  if (!target) {
    return delta > 0 ? [...items, { dishId, quantity: 1 }] : items;
  }
  const quantity = target.quantity + delta;
  if (quantity <= 0) {
    return items.filter(item => item.dishId !== dishId);
  }
  return items.map(item =>
    item.dishId === dishId ? { ...item, quantity } : item,
  );
}

// So sánh 2 giỏ món (bỏ qua thứ tự) để biết có thay đổi chưa lưu không
export function isSameItems(a: OrderItem[], b: OrderItem[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every(item =>
    b.some(
      other => other.dishId === item.dishId && other.quantity === item.quantity,
    ),
  );
}

export interface DishSection {
  title: Category;
  data: Dish[];
}

// Nhóm món theo loại cho SectionList (bỏ các nhóm rỗng)
export function groupDishesByCategory(dishes: Dish[]): DishSection[] {
  return CATEGORIES.map(category => ({
    title: category,
    data: dishes.filter(d => d.category === category),
  })).filter(section => section.data.length > 0);
}
