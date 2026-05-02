import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Opportunity } from '../lib/types'
import { Colors, Radius, getDaysLeft } from '../lib/design'

const TYPE_COLORS: Record<string, string> = {
  internship: Colors.primary,
  learnership: Colors.mint,
  graduate: Colors.coral,
  scholarship: Colors.gold,
  event: '#A78BFA',
  bootcamp: '#34D399',
}

interface Props {
  opportunity: Opportunity
  saved: boolean
  onToggleSave: () => void
}

export default function OpportunityCard({ opportunity, saved, onToggleSave }: Props) {
  const router = useRouter()
  const color = TYPE_COLORS[opportunity.type] ?? Colors.primary
  const countdown = getDaysLeft(opportunity.deadline)

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/opportunity/${opportunity.id}`)}
    >
      {/* Left colored thread line */}
      <View style={[styles.threadLine, { backgroundColor: color }]} />

      <View style={styles.body}>
        {/* Type + countdown */}
        <View style={styles.topRow}>
          <Text style={[styles.typeLabel, { color }]}>
            {opportunity.type.toUpperCase()}
          </Text>
          {countdown && (
            <Text style={[styles.countdown, countdown.urgent && { color: Colors.coral }]}>
              {countdown.urgent && '⚡ '}{countdown.text}
            </Text>
          )}
        </View>

        <Text style={styles.title}>{opportunity.title}</Text>
        <Text style={styles.org}>{opportunity.organization}</Text>

        {opportunity.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{opportunity.location}</Text>
          </View>
        )}

        {opportunity.tags?.length > 0 && (
          <View style={styles.tags}>
            {opportunity.tags.slice(0, 3).map((tag) => (
              <Text key={tag} style={styles.tag}>#{tag}</Text>
            ))}
          </View>
        )}

        {/* Footer — X-style action row */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.action} onPress={onToggleSave} hitSlop={8}>
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={17}
              color={saved ? Colors.gold : Colors.textSecondary}
            />
            <Text style={[styles.actionText, saved && { color: Colors.gold }]}>
              {saved ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.action}
            onPress={() => Share.share({
              title: opportunity.title,
              message: `${opportunity.title} at ${opportunity.organization}${opportunity.link ? '\n\nApply: ' + opportunity.link : ''}\n\nShared via NextStep`,
            })}
          >
            <Ionicons name="share-outline" size={17} color={Colors.textSecondary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={() => router.push(`/opportunity/${opportunity.id}`)}>
            <Ionicons name="arrow-forward-outline" size={17} color={Colors.textSecondary} />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    overflow: 'hidden',
  },
  threadLine: {
    width: 3,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  countdown: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 5,
    lineHeight: 23,
  },
  org: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 4,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
})
