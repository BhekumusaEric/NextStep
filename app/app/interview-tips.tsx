import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius } from '../lib/design'
import { useInterviewTips } from '../hooks/usePrep'

const PHASES = [
  { label: 'All', value: undefined },
  { label: '🎯 Before', value: 'before' },
  { label: '💬 During', value: 'during' },
  { label: '✅ After', value: 'after' },
]

const PHASE_COLOR: Record<string, string> = {
  before: Colors.primary,
  during: Colors.mint,
  after: Colors.gold,
}

export default function InterviewTips() {
  const router = useRouter()
  const [phase, setPhase] = useState<string | undefined>(undefined)
  const { data: tips = [], isLoading } = useInterviewTips(phase)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.heading}>Interview Tips</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Phase filter */}
      <View style={styles.filterRow}>
        {PHASES.map((p) => (
          <TouchableOpacity
            key={p.label}
            style={[styles.filterChip, phase === p.value && styles.filterChipActive]}
            onPress={() => setPhase(p.value)}
          >
            <Text style={[styles.filterText, phase === p.value && styles.filterTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        : <FlatList
            data={tips}
            keyExtractor={(t) => t.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.empty}>No tips yet.</Text>}
            renderItem={({ item }) => {
              const color = PHASE_COLOR[item.phase] ?? Colors.primary
              return (
                <View style={styles.row}>
                  {/* Left thread colored by phase */}
                  <View style={[styles.thread, { backgroundColor: color }]} />
                  <View style={styles.rowBody}>
                    <View style={styles.rowMeta}>
                      <Text style={[styles.phaseLabel, { color }]}>{item.phase}</Text>
                      {item.is_curated && <Text style={styles.curated}>⭐ curated</Text>}
                    </View>
                    <Text style={styles.tipTitle}>{item.title}</Text>
                    <Text style={styles.tipBody}>{item.body}</Text>
                  </View>
                </View>
              )
            }}
          />
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 17, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterChip: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
  thread: { width: 3 },
  rowBody: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  phaseLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  curated: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.gold },
  tipTitle: { fontSize: 15, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary, marginBottom: 6 },
  tipBody: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 19 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 60, fontSize: 14, fontFamily: 'Inter_400Regular' },
})
