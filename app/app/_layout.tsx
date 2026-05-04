import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Sora_400Regular, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import { View, ActivityIndicator } from 'react-native'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { Colors } from '../lib/design'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
})

function AuthGate() {
  const { session, setSession } = useAuthStore()
  const segments = useSegments()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (_event === 'SIGNED_IN' && session) {
        supabase.from('profiles').select('name').eq('id', session.user.id).single().then(({ data }) => {
          if (!data?.name) router.replace('/onboarding')
          else router.replace('/(tabs)/home')
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!ready) return
    const inAuth = segments[0] === '(auth)'
    const inOnboarding = segments[0] === 'onboarding'
    if (!session && !inAuth) { router.replace('/(auth)/sign-in'); return }
    if (session && inAuth) {
      // Check if profile has a name — if not, send to onboarding
      supabase.from('profiles').select('name').eq('id', session.user.id).single().then(({ data }) => {
        if (!data?.name) router.replace('/onboarding')
        else router.replace('/(tabs)/home')
      })
    }
  }, [ready, session, segments])

  usePushNotifications()
  return <Slot />
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular, Sora_600SemiBold, Sora_700Bold,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  )
}
