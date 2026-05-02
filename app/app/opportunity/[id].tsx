import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useSavedOpportunities, useToggleSave } from '../../hooks/useOpportunities'
import { Opportunity } from '../../lib/types'
import { Colors, Radius, getDaysLeft } from '../../lib/design'

const TYPE_COLORS: Record<string, string> = {
  internship: Colors.primary,
  learnership: Colors.mint,
  graduate: Colors.coral,
  scholarship: Colors.gold,
  event: '#A78BFA',
  bootcamp: '#34D399',
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

  if (isLoading) return <ActivityIndicator style={{ flex: 1, backgroundColor: Colors.background }} color={Colors.primary} />
  if (!opportunity) return null

  const color = TYPE_COLORS[opportunity.type] ?? Colors.primary
  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const isSaved = saved.includes(opportunity.id)
  const countdown = getDaysLeft(opportunity.deadline)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleSave({ opportunityId: opportunity.id, saved: isSaved })} hitSlop={8}>
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={22} color={isSaved ? Colors.gold : Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Left thread line + type */}
        <View style={styles.typeRow}>
          <View style={[styles.threadDot, { backgroundColor: color }]} />
          <Text style={[styles.typeLabel, { color }]}>{opportunity.type.toUpperCase()}</Text>
          {countdown && (
            <Text style={[styles.countdown, countdown.urgent && { color: Colors.coral }]}>
              {countdown.urgent && '⚡ '}{countdown.text}
            </Text>
          )}
        </View>

        <Text style={styles.title}>{opportunity.title}</Text>
        <Text style={styles.org}>{opportunity.organization}</Text>

        <View style={styles.infoBlock}>
          {opportunity.location && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{opportunity.location}</Text>
            </View>
          )}
          {deadline && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={15} color={Colors.textSecondary} />
              <Text style={styles.infoText}>Closes {deadline}</Text>
            </View>
          )}
          {opportunity.eligibility && (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={15} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{opportunity.eligibility}</Text>
            </View>
          )}
        </View>

        {opportunity.tags?.length > 0 && (
          <View style={styles.tags}>
            {opportunity.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>#{tag}</Text>
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
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  content: { padding: 20, paddingBottom: 40 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  threadDot: { width: 8, height: 8, borderRadius: 4 },
  typeLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  countdown: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginLeft: 4 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6, lineHeight: 30 },
  org: { fontSize: 15, color: Colors.textSecondary, marginBottom: 20 },
  infoBlock: { gap: 12, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: Colors.textSecondary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  tag: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  applyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.md, padding: 16 },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
