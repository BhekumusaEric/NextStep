import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from '../../lib/supabase'
import { Colors, Radius } from '../../lib/design'

WebBrowser.maybeCompleteAuthSession()

const REDIRECT_URI = 'nextstep://auth/callback'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
  const [show, setShow] = useState(false)

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) return Alert.alert('Fill in all fields')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) Alert.alert('Sign in failed', error.message)
    setLoading(false)
  }

  async function handleOAuth(provider: 'google' | 'apple') {
    setOauthLoading(provider)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: REDIRECT_URI, skipBrowserRedirect: true },
    })
    if (error || !data.url) {
      Alert.alert('Error', error?.message ?? 'Could not start sign in')
      setOauthLoading(null)
      return
    }
    const result = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT_URI)
    if (result.type === 'success') {
      const url = result.url
      const params = new URLSearchParams(url.split('#')[1] ?? url.split('?')[1] ?? '')
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      }
    }
    setOauthLoading(null)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoMark}>
            <View style={styles.step1} /><View style={styles.step2} /><View style={styles.step3} />
            <View style={styles.stepTop} />
          </View>
          <Text style={styles.logoText}>Next<Text style={{ color: Colors.primary }}>Step</Text></Text>
          <Text style={styles.tagline}>Nobody wins alone.</Text>
        </View>

        {/* OAuth buttons */}
        <View style={styles.oauthRow}>
          <TouchableOpacity
            style={styles.oauthBtn}
            onPress={() => handleOAuth('google')}
            disabled={!!oauthLoading}
          >
            {oauthLoading === 'google'
              ? <Ionicons name="reload-outline" size={18} color={Colors.textPrimary} />
              : <Ionicons name="logo-google" size={18} color={Colors.textPrimary} />
            }
            <Text style={styles.oauthText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email / Password */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@email.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!show}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShow(!show)} hitSlop={8}>
              <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>
        </View>

        <Link href="/(auth)/sign-up" style={styles.link}>
          Don't have an account?{'  '}<Text style={styles.linkAccent}>Sign up</Text>
        </Link>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 28, paddingBottom: 48 },

  // Logo
  logoWrap: { alignItems: 'center', marginBottom: 44 },
  logoMark: { width: 64, height: 64, marginBottom: 16, position: 'relative', justifyContent: 'flex-end' },
  step1: { position: 'absolute', bottom: 0, left: 0, width: 20, height: 8, borderRadius: 3, backgroundColor: Colors.primary },
  step2: { position: 'absolute', bottom: 12, left: 12, width: 20, height: 8, borderRadius: 3, backgroundColor: Colors.primary },
  step3: { position: 'absolute', bottom: 24, left: 24, width: 20, height: 8, borderRadius: 3, backgroundColor: Colors.primary },
  stepTop: { position: 'absolute', bottom: 36, left: 36, width: 20, height: 8, borderRadius: 3, backgroundColor: Colors.mint },
  logoText: { fontSize: 30, fontFamily: 'Sora_700Bold', color: Colors.textPrimary, letterSpacing: -0.5 },
  tagline: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 6, letterSpacing: 0.3 },

  // OAuth
  oauthRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  oauthBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingVertical: 14 },
  oauthText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted },

  // Form
  form: { gap: 4 },
  label: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: 16, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
  passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border },
  passwordInput: { flex: 1, paddingVertical: 16, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary },
  button: { backgroundColor: Colors.primary, borderRadius: Radius.md, padding: 17, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },

  link: { textAlign: 'center', marginTop: 24, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, fontSize: 14 },
  linkAccent: { color: Colors.primary, fontFamily: 'Inter_700Bold' },
})
