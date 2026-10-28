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
