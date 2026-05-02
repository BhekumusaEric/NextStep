import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

export default function Profile() {
  const user = useAuthStore((s) => s.user)

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <TouchableOpacity style={styles.button} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  email: { fontSize: 14, color: '#666', marginBottom: 32 },
  button: {
    backgroundColor: '#ef4444', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 32,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
})
