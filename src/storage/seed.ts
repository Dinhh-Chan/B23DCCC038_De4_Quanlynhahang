import { ORDER_STATUS } from '../constants';
import { Dish, Order } from '../types';
import { formatDateTime } from '../utils/format';

// Dữ liệu mẫu nạp khi mở app lần đầu: 11 món trải đủ 4 loại
export const SEED_DISHES: Dish[] = [
  {
    id: 'd1',
    name: 'Gỏi cuốn tôm thịt',
    category: 'Khai vị',
    price: 45000,
    available: true,
  },
  {
    id: 'd2',
    name: 'Chả giò rế',
    category: 'Khai vị',
    price: 55000,
    available: true,
  },
  {
    id: 'd3',
    name: 'Súp cua',
    category: 'Khai vị',
    price: 40000,
    available: false,
  },
  {
    id: 'd4',
    name: 'Phở bò tái',
    category: 'Món chính',
    price: 65000,
    available: true,
  },
  {
    id: 'd5',
    name: 'Cơm tấm sườn bì',
    category: 'Món chính',
    price: 60000,
    available: true,
  },
  {
    id: 'd6',
    name: 'Bún chả Hà Nội',
    category: 'Món chính',
    price: 55000,
    available: true,
  },
  {
    id: 'd7',
    name: 'Chè khúc bạch',
    category: 'Tráng miệng',
    price: 30000,
    available: true,
  },
  {
    id: 'd8',
    name: 'Bánh flan',
    category: 'Tráng miệng',
    price: 20000,
    available: true,
  },
  {
    id: 'd9',
    name: 'Trà đá',
    category: 'Đồ uống',
    price: 5000,
    available: true,
  },
  {
    id: 'd10',
    name: 'Cà phê sữa đá',
    category: 'Đồ uống',
    price: 25000,
    available: true,
  },
  {
    id: 'd11',
    name: 'Nước cam ép',
    category: 'Đồ uống',
    price: 35000,
    available: true,
  },
];

export function createSeedOrders(): Order[] {
  return [
    {
      id: 'o1',
      tableNumber: 3,
      items: [
        { dishId: 'd4', quantity: 2 },
        { dishId: 'd1', quantity: 1 },
        { dishId: 'd9', quantity: 2 },
      ],
      status: ORDER_STATUS.SERVING,
      createdAt: formatDateTime(new Date()),
    },
  ];
}
