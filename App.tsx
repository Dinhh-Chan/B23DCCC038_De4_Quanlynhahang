import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RestaurantProvider } from './src/context/RestaurantContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <RestaurantProvider>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </RestaurantProvider>
    </SafeAreaProvider>
  );
}
