import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type IconName = React.ComponentProps<typeof Ionicons>['name']

const tabs: { name: string; label: string; icon: IconName; activeIcon: IconName }[] = [
  { name: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'community', label: 'Community', icon: 'people-outline', activeIcon: 'people' },
  { name: 'mentorship', label: 'Mentorship', icon: 'school-outline', activeIcon: 'school' },
  { name: 'notifications', label: 'Alerts', icon: 'notifications-outline', activeIcon: 'notifications' },
  { name: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
]

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4f46e5', headerShown: false }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? tab.activeIcon : tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
