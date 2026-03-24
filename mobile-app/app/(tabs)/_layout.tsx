import { Tabs } from 'expo-router';
import { Sprout, Warehouse, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#102815', borderTopColor: '#1D3B24' },
      tabBarActiveTintColor: '#00E632',
      tabBarInactiveTintColor: '#8BA890'
    }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Sprout color={color} size={24} /> }}
      />
      <Tabs.Screen
        name="farms"
        options={{ title: 'Farms', tabBarIcon: ({ color }) => <Warehouse color={color} size={24} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <User color={color} size={24} /> }}
      />
      {/* Hide herd and workers from main tabs — they live inside farm detail now */}
      <Tabs.Screen name="herd" options={{ href: null }} />
      <Tabs.Screen name="workers" options={{ href: null }} />
    </Tabs>
  );
}
