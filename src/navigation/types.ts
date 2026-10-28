import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Main: undefined;
  DishForm: { dishId?: string } | undefined;
  Order: { tableNumber: number };
  Payment: { orderId: string };
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
