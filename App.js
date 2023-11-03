import { MenuProvider } from 'react-native-popup-menu';
import AppNavigation from './src/navigation';

export default function App() {
  return (
    <MenuProvider>
      <AppNavigation />
    </MenuProvider>
  )
}