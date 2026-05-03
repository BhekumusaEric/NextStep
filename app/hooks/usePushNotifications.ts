import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Expo Go removed push notification support in SDK 53
// Only run in standalone/development builds
const isExpoGo = Constants.appOwnership === 'expo'

export function usePushNotifications() {
  const user = useAuthStore((s) => s.user)
  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  useEffect(() => {
    if (!user || isExpoGo) return

    registerForPushNotifications().then((token) => {
      if (token) savePushToken(user.id, token)
    })

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {})
    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {})

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [user])
}

async function registerForPushNotifications() {
  if (!Device.isDevice) return null

  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') return null

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    })
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data
    return token
  } catch {
    return null
  }
}

async function savePushToken(userId: string, token: string) {
  await supabase.from('profiles').update({ push_token: token } as any).eq('id', userId)
}
