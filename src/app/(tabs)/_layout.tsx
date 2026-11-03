import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1039B8',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={typeof color === 'string' ? color : '#64748B'} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          popToTopOnBlur: true,
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={typeof color === 'string' ? color : '#64748B'} />,
        }}
        listeners={{
          tabPress: () => router.replace('/(tabs)/search'),
        }}
      />
      <Tabs.Screen
        name="my-courses"
        options={{
          title: 'Mis cursos',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={typeof color === 'string' ? color : '#64748B'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={typeof color === 'string' ? color : '#64748B'} />,
        }}
      />
    </Tabs>
  );
}
