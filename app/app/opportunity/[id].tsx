import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator, Share } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useSavedOpportunities, useToggleSave } from '../../hooks/useOpportunities'
import { Opportunity } from '../../lib/types'
import { Colors, Radius, getDaysLeft, getCompanyLogo, getTypeImage } from '../../lib/design'
import AppImage from '../../components/AppImage'

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
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

        {/* Sticky top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8} style={styles.topBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity
              onPress={() => toggleSave({ opportunityId: opportunity.id, saved: isSaved })}
              hitSlop={8} style={styles.topBtn}
            >
              <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={isSaved ? Colors.gold : Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Share.share({ title: opportunity.title, message: `${opportunity.title} at ${opportunity.organization}${opportunity.link ? '\n\nApply: ' + opportunity.link : ''}\n\nShared via RiseHub` })}
              hitSlop={8} style={styles.topBtn}
            >
              <Ionicons name="share-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero image */}
        <View style={styles.heroWrap}>
          <AppImage uri={getTypeImage(opportunity.type)} style={styles.hero} contentFit="cover" showLoader />
          <View style={styles.heroOverlay} />
          <View style={[styles.typeBadge, { backgroundColor: color }]}>
            <Text style={styles.typeBadgeText}>{opportunity.type.toUpperCase()}</Text>
          </View>
          {countdown && (
            <View style={[styles.countdownBadge, countdown.urgent && { backgroundColor: Colors.coral }]}>
              <Text style={styles.countdownText}>{countdown.urgent ? '⚡ ' : ''}{countdown.text}</Text>
            </View>
          )}
        </View>

        {/* Company logo + org block */}
        <View style={styles.orgBlock}>
          <View style={styles.logoWrap}>
            <AppImage
              uri={getCompanyLogo(opportunity.organization)}
              style={styles.logo}
              contentFit="contain"
              fallbackText={opportunity.organization}
              fallbackBg="#fff"
              isLogo
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.orgName}>{opportunity.organization}</Text>
            <Text style={styles.orgSub}>{opportunity.location ?? 'South Africa'}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{opportunity.title}</Text>

          <View style={styles.infoBlock}>
            {opportunity.location && (
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: Colors.primary + '18' }]}>
                  <Ionicons name="location-outline" size={14} color={Colors.primary} />
                </View>
                <Text style={styles.infoText}>{opportunity.location}</Text>
              </View>
            )}
            {deadline && (
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: Colors.gold + '18' }]}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.gold} />
                </View>
                <Text style={styles.infoText}>Closes {deadline}</Text>
              </View>
            )}
            {opportunity.eligibility && (
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: Colors.mint + '18' }]}>
                  <Ionicons name="person-outline" size={14} color={Colors.mint} />
                </View>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.background, borderBottomWidth: 1, borderBottomColor: Colors.border },
  topBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center' },
  topActions: { flexDirection: 'row', gap: 8 },
  heroWrap: { position: 'relative', height: 200 },
  hero: { width: '100%', height: 200 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  typeBadge: { position: 'absolute', top: 16, left: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  typeBadgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#fff', letterSpacing: 0.8 },
  countdownBadge: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: Colors.card },
  countdownText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#fff' },
  orgBlock: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  logoWrap: { width: 52, height: 52, borderRadius: Radius.md, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  logo: { width: 52, height: 52 },
  orgName: { fontSize: 15, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary },
  orgSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  content: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 22, fontFamily: 'Sora_700Bold', color: Colors.textPrimary, lineHeight: 30, marginBottom: 20 },
  infoBlock: { gap: 12, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIcon: { width: 30, height: 30, borderRadius: Radius.sm, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  infoText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, flex: 1, lineHeight: 20, paddingTop: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  tag: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.primary },
  applyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.md, padding: 16 },
  applyText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },
})
