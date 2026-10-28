export type Category = 'Khai vị' | 'Món chính' | 'Tráng miệng' | 'Đồ uống';

export type OrderStatus = 'Đang phục vụ' | 'Đã thanh toán';

export interface Dish {
  id: string;
  name: string;
  category: Category;
  price: number;
  available: boolean;
}

export interface OrderItem {
  dishId: string;
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string; // hh:mm dd/mm/yyyy
}

export type DishInput = Pick<Dish, 'name' | 'category' | 'price'>;
