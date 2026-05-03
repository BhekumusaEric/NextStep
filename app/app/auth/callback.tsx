import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { Colors } from '../../lib/design'

export default function AuthCallback() {
  const router = useRouter()
  const params = useLocalSearchParams()

  useEffect(() => {
    const accessToken = params.access_token as string
    const refreshToken = params.refresh_token as string

    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => router.replace('/(tabs)/home'))
    } else {
      // Email verification — session will be picked up by onAuthStateChange in _layout
      router.replace('/(auth)/sign-in')
    }
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  )
}
