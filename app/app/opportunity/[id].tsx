import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useSavedOpportunities, useToggleSave } from '../../hooks/useOpportunities'
import { Opportunity } from '../../lib/types'

const TYPE_COLORS: Record<string, string> = {
  internship: '#4f46e5',
  learnership: '#0891b2',
  graduate: '#059669',
  scholarship: '#d97706',
  event: '#db2777',
  bootcamp: '#7c3aed',
}

export default function OpportunityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const { data: opportunity, isLoading } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('opportunities').select('*').eq('id', id).single()
      if (error) throw error
      return data as Opportunity
    },
  })

  const { data: saved = [] } = useSavedOpportunities()
  const { mutate: toggleSave } = useToggleSave()

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} color="#4f46e5" />
  if (!opportunity) return null

  const color = TYPE_COLORS[opportunity.type] ?? '#4f46e5'
  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const isSaved = saved.includes(opportunity.id)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#1a1a2e" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleSave({ opportunityId: opportunity.id, saved: isSaved })} hitSlop={8}>
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={24} color={isSaved ? '#4f46e5' : '#aaa'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.badge, { backgroundColor: color + '18' }]}>
          <Text style={[styles.badgeText, { color }]}>{opportunity.type}</Text>
        </View>

        <Text style={styles.title}>{opportunity.title}</Text>
        <Text style={styles.org}>{opportunity.organization}</Text>

        <View style={styles.infoBlock}>
          {opportunity.location && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#888" />
              <Text style={styles.infoText}>{opportunity.location}</Text>
            </View>
          )}
          {deadline && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="#888" />
              <Text style={styles.infoText}>Closes {deadline}</Text>
            </View>
          )}
          {opportunity.eligibility && (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={16} color="#888" />
              <Text style={styles.infoText}>{opportunity.eligibility}</Text>
            </View>
          )}
        </View>

        {opportunity.tags?.length > 0 && (
          <View style={styles.tags}>
            {opportunity.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {opportunity.link && (
          <TouchableOpacity
            style={[styles.applyBtn, { backgroundColor: color }]}
            onPress={() => Linking.openURL(opportunity.link!)}
          >
            <Text style={styles.applyText}>Apply Now</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fb' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  content: { padding: 20, paddingBottom: 40 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 14 },
  badgeText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 6 },
  org: { fontSize: 15, color: '#555', marginBottom: 20 },
  infoBlock: { gap: 10, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: '#555' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  tag: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: '#e5e7eb' },
  tagText: { fontSize: 12, color: '#555' },
  applyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, padding: 16 },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
