import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { usePushNotifications } from '../hooks/usePushNotifications'

const queryClient = new QueryClient()

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  )
}
