import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../store/authStore'
import { useOpportunities, useSavedOpportunities, useToggleSave } from '../../hooks/useOpportunities'
import OpportunityCard from '../../components/OpportunityCard'
import { OpportunityType } from '../../lib/types'

const FILTERS: { label: string; value: OpportunityType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Internship', value: 'internship' },
  { label: 'Learnership', value: 'learnership' },
  { label: 'Graduate', value: 'graduate' },
  { label: 'Scholarship', value: 'scholarship' },
  { label: 'Event', value: 'event' },
  { label: 'Bootcamp', value: 'bootcamp' },
]

export default function Home() {
  const user = useAuthStore((s) => s.user)
  const [filter, setFilter] = useState<OpportunityType | undefined>(undefined)
  const { data: opportunities, isLoading } = useOpportunities(filter)
  const { data: saved = [] } = useSavedOpportunities()
  const { mutate: toggleSave } = useToggleSave()

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}>Good day 👋</Text>
      <Text style={styles.sub}>Find your next opportunity</Text>

      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(f) => f.label}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === item.value && styles.filterChipActive]}
            onPress={() => setFilter(item.value)}
          >
            <Text style={[styles.filterText, filter === item.value && styles.filterTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#4f46e5" />
      ) : (
        <FlatList
          data={opportunities}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No opportunities yet. Check back soon.</Text>
          }
          renderItem={({ item }) => (
            <OpportunityCard
              opportunity={item}
              saved={saved.includes(item.id)}
              onToggleSave={() => toggleSave({ opportunityId: item.id, saved: saved.includes(item.id) })}
            />
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fb' },
  greeting: { fontSize: 24, fontWeight: '700', color: '#1a1a2e', paddingHorizontal: 20, paddingTop: 16 },
  sub: { fontSize: 14, color: '#888', paddingHorizontal: 20, marginBottom: 16 },
  filterList: { paddingHorizontal: 16, marginBottom: 12, flexGrow: 0 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb',
  },
  filterChipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  filterText: { fontSize: 13, color: '#555', fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 60, fontSize: 14 },
})
