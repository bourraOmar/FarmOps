import { Tabs, useLocalSearchParams } from 'expo-router';
import { Sprout, PawPrint, Users } from 'lucide-react-native';

export default function FarmDetailLayout() {
  const { farmId } = useLocalSearchParams<{ farmId: string }>();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#102815',
        borderTopColor: '#1D3B24',
      },
      tabBarActiveTintColor: '#00E632',
      tabBarInactiveTintColor: '#8BA890',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Sprout color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="herd"
        options={{
          title: 'Herd',
          tabBarIcon: ({ color }) => <PawPrint color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="workers"
        options={{
          title: 'Workers',
          tabBarIcon: ({ color }) => <Users color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
