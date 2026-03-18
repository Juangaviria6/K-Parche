import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';

function TabBarIcon({ name, emoji, focused }: { name: any, emoji: string, focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5, transform: [{ scale: focused ? 1.15 : 1 }] }}>
        {emoji}
      </Text>
      {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.accent, marginTop: 4 }} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="🗺️" name="map" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="university"
        options={{
          title: 'Uni',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="🎓" name="school" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Guardados',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="🔖" name="bookmark" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: 'Publicar',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="➕" name="add-circle" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabBarIcon emoji="👤" name="person" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
