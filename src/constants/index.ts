import { Category, OrderStatus } from '../types';

export const CATEGORIES: Category[] = [
  'Khai vị',
  'Món chính',
  'Tráng miệng',
  'Đồ uống',
];

// Tên icon (Ionicons) cho từng loại món
export const CATEGORY_ICON: Record<Category, string> = {
  'Khai vị': 'leaf-outline',
  'Món chính': 'restaurant-outline',
  'Tráng miệng': 'ice-cream-outline',
  'Đồ uống': 'cafe-outline',
};

export const ORDER_STATUS: { SERVING: OrderStatus; PAID: OrderStatus } = {
  SERVING: 'Đang phục vụ',
  PAID: 'Đã thanh toán',
};

export const TABLE_COUNT = 10;

export const VAT_RATE = 0.08;

export const STORAGE_KEYS = {
  DISHES: '@dishes',
  ORDERS: '@orders',
};
