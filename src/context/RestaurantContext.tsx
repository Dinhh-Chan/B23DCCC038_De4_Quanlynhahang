import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ORDER_STATUS } from '../constants';
import { loadData, saveDishes, saveOrders } from '../storage/storage';
import { Dish, DishInput, Order, OrderItem } from '../types';
import { formatDateTime, generateId } from '../utils/format';

interface RestaurantContextValue {
  dishes: Dish[];
  orders: Order[];
  loading: boolean;
  servingOrders: Order[];
  getServingOrder: (tableNumber: number) => Order | undefined;
  isDishInServingOrder: (dishId: string) => boolean;
  isDishNameTaken: (name: string, excludeId?: string) => boolean;
  addDish: (input: DishInput) => Promise<void>;
  updateDish: (id: string, input: DishInput) => Promise<void>;
  setDishAvailable: (id: string, available: boolean) => Promise<void>;
  deleteDish: (id: string) => Promise<boolean>;
  saveOrderItems: (
    tableNumber: number,
    items: OrderItem[],
  ) => Promise<string | null>;
  payOrder: (orderId: string) => Promise<boolean>;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

const isServing = (order: Order) => order.status === ORDER_STATUS.SERVING;

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Ref luôn giữ dữ liệu mới nhất, tránh mất cập nhật khi bấm liên tục
  const dishesRef = useRef<Dish[]>([]);
  const ordersRef = useRef<Order[]>([]);

  useEffect(() => {
    let mounted = true;
    loadData()
      .then(data => {
        if (!mounted) {
          return;
        }
        dishesRef.current = data.dishes;
        ordersRef.current = data.orders;
        setDishes(data.dishes);
        setOrders(data.orders);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const commitDishes = useCallback((next: Dish[]) => {
    dishesRef.current = next;
    setDishes(next);
    return saveDishes(next);
  }, []);

  const commitOrders = useCallback((next: Order[]) => {
    ordersRef.current = next;
    setOrders(next);
    return saveOrders(next);
  }, []);

  const servingOrders = useMemo(() => orders.filter(isServing), [orders]);

  const getServingOrder = useCallback(
    (tableNumber: number) =>
      servingOrders.find(o => o.tableNumber === tableNumber),
    [servingOrders],
  );

  const isDishInServingOrder = useCallback(
    (dishId: string) =>
      ordersRef.current.some(
        o => isServing(o) && o.items.some(item => item.dishId === dishId),
      ),
    [],
  );

  // So sánh không phân biệt hoa/thường, bỏ qua chính món đang sửa
  const isDishNameTaken = useCallback(
    (name: string, excludeId?: string) => {
      const key = name.trim().toLowerCase();
      return dishes.some(
        d => d.id !== excludeId && d.name.trim().toLowerCase() === key,
      );
    },
    [dishes],
  );

  const addDish = useCallback(
    (input: DishInput) => {
      const dish: Dish = { id: generateId(), ...input, available: true };
      return commitDishes([...dishesRef.current, dish]);
    },
    [commitDishes],
  );

  const updateDish = useCallback(
    (id: string, input: DishInput) =>
      commitDishes(
        dishesRef.current.map(d => (d.id === id ? { ...d, ...input } : d)),
      ),
    [commitDishes],
  );

  const setDishAvailable = useCallback(
    (id: string, available: boolean) =>
      commitDishes(
        dishesRef.current.map(d => (d.id === id ? { ...d, available } : d)),
      ),
    [commitDishes],
  );

  // Không cho xoá món đang nằm trong hoá đơn "Đang phục vụ"
  const deleteDish = useCallback(
    async (id: string) => {
      if (isDishInServingOrder(id)) {
        return false;
      }
      await commitDishes(dishesRef.current.filter(d => d.id !== id));
      return true;
    },
    [commitDishes, isDishInServingOrder],
  );

  // Lưu giỏ món khi bấm "Xác nhận đặt món". Mỗi bàn chỉ có 1 hoá đơn "Đang phục vụ":
  // - bàn trống + có món -> tạo hoá đơn mới (createdAt = thời điểm xác nhận)
  // - bàn đang phục vụ -> cập nhật items
  // - giỏ rỗng -> xoá hoá đơn, bàn về trạng thái trống
  // Trả về id hoá đơn (null nếu hoá đơn bị xoá / không tạo)
  const saveOrderItems = useCallback(
    async (tableNumber: number, items: OrderItem[]) => {
      const current = ordersRef.current;
      const existing = current.find(
        o => isServing(o) && o.tableNumber === tableNumber,
      );
      const cleaned = items.filter(item => item.quantity >= 1);

      if (cleaned.length === 0) {
        if (existing) {
          await commitOrders(current.filter(o => o.id !== existing.id));
        }
        return null;
      }

      if (existing) {
        await commitOrders(
          current.map(o =>
            o.id === existing.id ? { ...o, items: cleaned } : o,
          ),
        );
        return existing.id;
      }

      const newOrder: Order = {
        id: generateId(),
        tableNumber,
        items: cleaned,
        status: ORDER_STATUS.SERVING,
        createdAt: formatDateTime(new Date()),
      };
      await commitOrders([...current, newOrder]);
      return newOrder.id;
    },
    [commitOrders],
  );

  const payOrder = useCallback(
    async (orderId: string) => {
      const order = ordersRef.current.find(o => o.id === orderId);
      if (!order || !isServing(order) || order.items.length === 0) {
        return false;
      }
      await commitOrders(
        ordersRef.current.map(o =>
          o.id === orderId ? { ...o, status: ORDER_STATUS.PAID } : o,
        ),
      );
      return true;
    },
    [commitOrders],
  );

  const value = useMemo(
    () => ({
      dishes,
      orders,
      loading,
      servingOrders,
      getServingOrder,
      isDishInServingOrder,
      isDishNameTaken,
      addDish,
      updateDish,
      setDishAvailable,
      deleteDish,
      saveOrderItems,
      payOrder,
    }),
    [
      dishes,
      orders,
      loading,
      servingOrders,
      getServingOrder,
      isDishInServingOrder,
      isDishNameTaken,
      addDish,
      updateDish,
      setDishAvailable,
      deleteDish,
      saveOrderItems,
      payOrder,
    ],
  );

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant(): RestaurantContextValue {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error(
      'useRestaurant phải được dùng bên trong RestaurantProvider',
    );
  }
  return context;
}
