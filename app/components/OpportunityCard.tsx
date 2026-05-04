import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Opportunity } from '../lib/types'
import { Colors, Radius, getDaysLeft, getCompanyLogo } from '../lib/design'
import AppImage from './AppImage'

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
      <View style={[styles.threadLine, { backgroundColor: color }]} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={[styles.typeLabel, { color }]}>{opportunity.type.toUpperCase()}</Text>
          {countdown && (
            <Text style={[styles.countdown, countdown.urgent && { color: Colors.coral }]}>
              {countdown.urgent && '⚡ '}{countdown.text}
            </Text>
          )}
        </View>

        {/* Org row with logo */}
        <View style={styles.orgRow}>
          <AppImage
            uri={getCompanyLogo(opportunity.organization)}
            style={styles.logo}
            contentFit="contain"
            fallbackText={opportunity.organization}
            fallbackBg="#fff"
            isLogo
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{opportunity.title}</Text>
            <Text style={styles.org}>{opportunity.organization}</Text>
          </View>
        </View>

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
              message: `${opportunity.title} at ${opportunity.organization}${opportunity.link ? '\n\nApply: ' + opportunity.link : ''}\n\nShared via RiseHub`,
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
  card: { flexDirection: 'row', backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border, overflow: 'hidden' },
  threadLine: { width: 3, alignSelf: 'stretch' },
  body: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  countdown: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  orgRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  logo: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: '#fff', flexShrink: 0 },
  logoFallback: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.cardAlt, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  logoFallbackText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  title: { fontSize: 15, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary, lineHeight: 21, marginBottom: 2 },
  org: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  locationText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  tag: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.primary },
  footer: { flexDirection: 'row', gap: 20, paddingTop: 4 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
})
