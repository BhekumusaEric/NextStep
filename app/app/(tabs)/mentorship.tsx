import { View, Text, StyleSheet } from 'react-native'

export default function Mentorship() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mentorship</Text>
      <Text style={styles.sub}>Mentor matching coming in Phase 5.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: '700', color: '#1a1a2e' },
  sub: { fontSize: 14, color: '#888', marginTop: 8 },
})
