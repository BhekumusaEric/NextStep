import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../lib/design'

type IconName = React.ComponentProps<typeof Ionicons>['name']

const tabs: { name: string; label: string; icon: IconName; activeIcon: IconName }[] = [
  { name: 'home', label: 'Home', icon: 'compass-outline', activeIcon: 'compass' },
  { name: 'community', label: 'Community', icon: 'people-outline', activeIcon: 'people' },
  { name: 'mentorship', label: 'Mentors', icon: 'star-outline', activeIcon: 'star' },
  { name: 'notifications', label: 'Alerts', icon: 'notifications-outline', activeIcon: 'notifications' },
  { name: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
]

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarStyle: {
        backgroundColor: Colors.background,
        borderTopColor: Colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
      },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      headerShown: false,
    }}>
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
