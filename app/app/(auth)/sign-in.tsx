import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { Colors, Radius } from '../../lib/design'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) Alert.alert('Error', error.message)
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.logoWrap}>
          <View style={styles.logoIcon}>
            <Ionicons name="compass" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.logoText}>NextStep</Text>
          <Text style={styles.tagline}>Nobody wins alone.</Text>
        </View>

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

          <Link href="/(auth)/sign-up" style={styles.link}>
            Don't have an account? <Text style={{ color: Colors.primary, fontWeight: '700' }}>Sign up</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1, justifyContent: 'center', padding: 28 },
  logoWrap: { alignItems: 'center', marginBottom: 48 },
  logoIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: Colors.primary + '22', justifyContent: 'center', alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: Colors.primary + '44' },
  logoText: { fontSize: 32, fontFamily: 'Sora_700Bold', color: Colors.textPrimary, letterSpacing: -0.5 },
  tagline: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 4 },
  form: { gap: 4 },
  label: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: 16, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
  passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border },
  passwordInput: { flex: 1, paddingVertical: 16, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary },
  button: { backgroundColor: Colors.primary, borderRadius: Radius.md, padding: 17, alignItems: 'center', marginTop: 28 },
  buttonText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, fontSize: 14 },
})
