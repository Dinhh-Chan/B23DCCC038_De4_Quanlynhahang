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
  changeItemQuantity: (
    tableNumber: number,
    dishId: string,
    delta: 1 | -1,
  ) => Promise<void>;
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

  // Mỗi bàn chỉ có 1 hoá đơn "Đang phục vụ":
  // - chưa có hoá đơn + bấm [+] -> tạo hoá đơn mới
  // - số lượng về 0 -> bỏ món khỏi items; items rỗng -> xoá hoá đơn
  const changeItemQuantity = useCallback(
    async (tableNumber: number, dishId: string, delta: 1 | -1) => {
      const current = ordersRef.current;
      const dish = dishesRef.current.find(d => d.id === dishId);
      const existing = current.find(
        o => isServing(o) && o.tableNumber === tableNumber,
      );

      if (delta > 0 && (!dish || !dish.available)) {
        return;
      }

      if (!existing) {
        if (delta < 0) {
          return;
        }
        const newOrder: Order = {
          id: generateId(),
          tableNumber,
          items: [{ dishId, quantity: 1 }],
          status: ORDER_STATUS.SERVING,
          createdAt: formatDateTime(new Date()),
        };
        await commitOrders([...current, newOrder]);
        return;
      }

      const target = existing.items.find(item => item.dishId === dishId);
      let items: OrderItem[];
      if (delta > 0) {
        items = target
          ? existing.items.map(item =>
              item.dishId === dishId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...existing.items, { dishId, quantity: 1 }];
      } else {
        if (!target) {
          return;
        }
        items =
          target.quantity <= 1
            ? existing.items.filter(item => item.dishId !== dishId)
            : existing.items.map(item =>
                item.dishId === dishId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item,
              );
      }

      const next =
        items.length === 0
          ? current.filter(o => o.id !== existing.id)
          : current.map(o => (o.id === existing.id ? { ...o, items } : o));
      await commitOrders(next);
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
      changeItemQuantity,
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
      changeItemQuantity,
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
