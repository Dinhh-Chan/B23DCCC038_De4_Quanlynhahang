import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { Dish, Order } from '../types';
import { createSeedOrders, SEED_DISHES } from './seed';

// Trả về null nếu key chưa tồn tại hoặc dữ liệu hỏng
async function readList<T>(key: string): Promise<T[] | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.warn(`Không đọc được ${key}`, error);
    return null;
  }
}

async function writeList<T>(key: string, list: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(list));
  } catch (error) {
    console.warn(`Không lưu được ${key}`, error);
  }
}

export const saveDishes = (dishes: Dish[]) =>
  writeList(STORAGE_KEYS.DISHES, dishes);

export const saveOrders = (orders: Order[]) =>
  writeList(STORAGE_KEYS.ORDERS, orders);

// Lần đầu mở app (chưa có dữ liệu) thì nạp dữ liệu mẫu
export async function loadData(): Promise<{ dishes: Dish[]; orders: Order[] }> {
  let dishes = await readList<Dish>(STORAGE_KEYS.DISHES);
  let orders = await readList<Order>(STORAGE_KEYS.ORDERS);

  if (dishes === null) {
    dishes = SEED_DISHES;
    await saveDishes(dishes);
  }
  if (orders === null) {
    orders = createSeedOrders();
    await saveOrders(orders);
  }
  return { dishes, orders };
}
