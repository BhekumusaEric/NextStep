import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Opportunity } from '../lib/types'

const TYPE_COLORS: Record<string, string> = {
  internship: '#4f46e5',
  learnership: '#0891b2',
  graduate: '#059669',
  scholarship: '#d97706',
  event: '#db2777',
  bootcamp: '#7c3aed',
}

interface Props {
  opportunity: Opportunity
  saved: boolean
  onToggleSave: () => void
}

export default function OpportunityCard({ opportunity, saved, onToggleSave }: Props) {
  const router = useRouter()
  const color = TYPE_COLORS[opportunity.type] ?? '#4f46e5'

  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/opportunity/${opportunity.id}`)}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: color + '18' }]}>
          <Text style={[styles.badgeText, { color }]}>{opportunity.type}</Text>
        </View>
        <TouchableOpacity onPress={onToggleSave} hitSlop={8}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? '#4f46e5' : '#aaa'} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{opportunity.title}</Text>
      <Text style={styles.org}>{opportunity.organization}</Text>

      <View style={styles.meta}>
        {opportunity.location && (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color="#888" />
            <Text style={styles.metaText}>{opportunity.location}</Text>
          </View>
        )}
        {deadline && (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color="#888" />
            <Text style={styles.metaText}>Closes {deadline}</Text>
          </View>
        )}
      </View>

      {opportunity.tags?.length > 0 && (
        <View style={styles.tags}>
          {opportunity.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  title: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  org: { fontSize: 13, color: '#555', marginBottom: 10 },
  meta: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#888' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: 11, color: '#555' },
})
