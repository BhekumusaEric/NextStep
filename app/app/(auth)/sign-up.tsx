import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from '../../lib/supabase'
import { Colors, Radius } from '../../lib/design'

WebBrowser.maybeCompleteAuthSession()

const REDIRECT_URI = 'nextstep://auth/callback'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
  const [show, setShow] = useState(false)
  const [verifyScreen, setVerifyScreen] = useState(false)

  async function handleSignUp() {
    if (!email.trim() || !password.trim()) return Alert.alert('Fill in all fields')
    if (password.length < 6) return Alert.alert('Password must be at least 6 characters')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: 'nextstep://auth/callback' },
    })
    if (error) Alert.alert('Sign up failed', error.message)
    else setVerifyScreen(true)
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
      const params = new URLSearchParams(result.url.split('#')[1] ?? result.url.split('?')[1] ?? '')
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      }
    }
    setOauthLoading(null)
  }

  // Email verification sent screen
  if (verifyScreen) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.verifyWrap}>
          <View style={styles.verifyIcon}>
            <Ionicons name="mail-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.verifyTitle}>Check your email</Text>
          <Text style={styles.verifySub}>
            We sent a confirmation link to{'\n'}
            <Text style={styles.verifyEmail}>{email}</Text>
          </Text>
          <Text style={styles.verifyHint}>
            Tap the link in the email to verify your account. Once verified, come back and sign in.
          </Text>
          <Link href="/(auth)/sign-in" style={styles.verifyBtn}>
            <Text style={styles.verifyBtnText}>Go to Sign In</Text>
          </Link>
          <TouchableOpacity onPress={() => handleSignUp()} style={styles.resendBtn}>
            <Text style={styles.resendText}>Resend email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.top}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Your future has people in it.</Text>
        </View>

        {/* OAuth */}
        <View style={styles.oauthRow}>
          <TouchableOpacity style={styles.oauthBtn} onPress={() => handleOAuth('google')} disabled={!!oauthLoading}>
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

        {/* Form */}
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
              placeholder="Min. 6 characters"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!show}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShow(!show)} hitSlop={8}>
              <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Get Started'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>
          By signing up you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>

        <Link href="/(auth)/sign-in" style={styles.link}>
          Already have an account?{'  '}<Text style={styles.linkAccent}>Sign in</Text>
        </Link>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 28, paddingBottom: 48 },

  top: { marginBottom: 36 },
  title: { fontSize: 30, fontFamily: 'Sora_700Bold', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 6 },

  oauthRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  oauthBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingVertical: 14 },
  oauthText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted },

  form: { gap: 4 },
  label: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: 16, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
  passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border },
  passwordInput: { flex: 1, paddingVertical: 16, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary },
  button: { backgroundColor: Colors.primary, borderRadius: Radius.md, padding: 17, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },

  terms: { textAlign: 'center', marginTop: 16, fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, lineHeight: 18 },
  termsLink: { color: Colors.primary, fontFamily: 'Inter_500Medium' },
  link: { textAlign: 'center', marginTop: 20, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, fontSize: 14 },
  linkAccent: { color: Colors.primary, fontFamily: 'Inter_700Bold' },

  // Verify screen
  verifyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  verifyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary + '18', borderWidth: 1, borderColor: Colors.primary + '33', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  verifyTitle: { fontSize: 24, fontFamily: 'Sora_700Bold', color: Colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  verifySub: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  verifyEmail: { fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  verifyHint: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  verifyBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 16, paddingHorizontal: 40, marginBottom: 16 },
  verifyBtnText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 },
  resendBtn: { padding: 8 },
  resendText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
})
