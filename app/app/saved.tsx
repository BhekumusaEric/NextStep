import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useSavedOpportunities, useToggleSave } from '../hooks/useOpportunities'
import OpportunityCard from '../components/OpportunityCard'
import { Opportunity } from '../lib/types'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../lib/design'

export default function Saved() {
  const router = useRouter()
  const { data: savedIds = [] } = useSavedOpportunities()
  const { mutate: toggleSave } = useToggleSave()

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['saved_full', savedIds],
    enabled: savedIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .in('id', savedIds)
      if (error) throw error
      return data as Opportunity[]
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.heading}>Saved</Text>
        <View style={{ width: 24 }} />
      </View>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
      ) : savedIds.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="bookmark-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.empty}>No saved opportunities yet</Text>
          <Text style={styles.emptySub}>Bookmark opportunities from the home feed</Text>
        </View>
      ) : (
        <FlatList
          data={opportunities}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OpportunityCard
              opportunity={item}
              saved
              onToggleSave={() => toggleSave({ opportunityId: item.id, saved: true })}
            />
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  list: { paddingBottom: 24 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  empty: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  emptySub: { fontSize: 13, color: Colors.textMuted },
})
