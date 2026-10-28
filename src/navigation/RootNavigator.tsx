import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import DishFormScreen from '../screens/DishFormScreen';
import MainScreen from '../screens/MainScreen';
import OrderScreen from '../screens/OrderScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { colors } from '../theme/colors';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Mỗi màn hình tự vẽ header gradient (GradientHeader) nên ẩn header mặc định
const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
  animation: 'slide_from_right',
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" screenOptions={screenOptions}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="DishForm" component={DishFormScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
