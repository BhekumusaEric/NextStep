import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useOpportunities, useSavedOpportunities, useToggleSave } from '../../hooks/useOpportunities'
import SwipeDeck from '../../components/SwipeDeck'
import OpportunityCard from '../../components/OpportunityCard'
import { OpportunityType } from '../../lib/types'
import { Colors, Radius, getMotivationalGreeting } from '../../lib/design'
import { useProfile } from '../../hooks/useProfile'
import { useRoadmap, useUserProgress, useToggleStep } from '../../hooks/useJourney'

const FILTERS: { label: string; value: OpportunityType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Internship', value: 'internship' },
  { label: 'Learnership', value: 'learnership' },
  { label: 'Graduate', value: 'graduate' },
  { label: 'Scholarship', value: 'scholarship' },
  { label: 'Event', value: 'event' },
  { label: 'Bootcamp', value: 'bootcamp' },
]

const PATH_TITLES: Record<string, string> = {
  frontend_dev: 'Frontend Developer',
  data_analyst: 'Data Analyst',
  ui_ux_designer: 'UI/UX Designer',
  backend_dev: 'Backend Developer',
  product_manager: 'Product Manager',
  cybersecurity: 'Cybersecurity Analyst',
  digital_marketing: 'Digital Marketer',
}

export default function Home() {
  const router = useRouter()
  const [filter, setFilter] = useState<OpportunityType | undefined>(undefined)
  const [filterModal, setFilterModal] = useState(false)
  const [listMode, setListMode] = useState(false)
  const [skipped, setSkipped] = useState<string[]>([])

  const { data: opportunities = [], isLoading, refetch, isRefetching } = useOpportunities(filter)
  const { data: saved = [] } = useSavedOpportunities()
  const { mutate: toggleSave } = useToggleSave()
  const { data: profile } = useProfile()
  const { data: steps = [] } = useRoadmap(profile?.career_path ?? null)
  const { data: progress = [] } = useUserProgress()
  const { mutate: toggleStep } = useToggleStep()

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.step_id))
  const completedCount = completedIds.size
  const readiness = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0
  const nextStep = steps.find((s) => !completedIds.has(s.id))

  const activeLabel = FILTERS.find((f) => f.value === filter)?.label ?? 'All'

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>{getMotivationalGreeting()}</Text>
          <Text style={styles.sub}>Find your next opportunity</Text>
        </View>
        <View style={styles.topActions}>
          {/* Swipe / List toggle */}
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setListMode((v) => !v)}
            hitSlop={8}
          >
            <Ionicons
              name={listMode ? 'layers-outline' : 'list-outline'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModal(true)}>
            <Ionicons name="options-outline" size={16} color={Colors.primary} />
            <Text style={styles.filterBtnText}>{activeLabel}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/search')} hitSlop={8}>
            <Ionicons name="search-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Journey Banner */}
      {profile?.career_path && steps.length > 0 && (
        <View style={styles.journeyBanner}>
          <View style={styles.journeyTop}>
            <View>
              <Text style={styles.journeyPath}>{PATH_TITLES[profile.career_path] ?? profile.career_path}</Text>
              <Text style={styles.journeyStage}>Stage {profile.journey_stage ?? 1} of 7</Text>
            </View>
            <Text style={styles.readiness}>{readiness}% ready</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${readiness}%` as any }]} />
          </View>
          {nextStep && (
            <TouchableOpacity
              style={styles.nextStepRow}
              onPress={() => toggleStep({ stepId: nextStep.id, completed: false })}
            >
              <Ionicons name="ellipse-outline" size={16} color={Colors.primary} />
              <Text style={styles.nextStepText} numberOfLines={1}>Next: {nextStep.title}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
      ) : listMode ? (
        <FlatList
          data={opportunities}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />}
          ListHeaderComponent={
            skipped.length > 0 ? (
              <View style={styles.skippedBanner}>
                <Ionicons name="eye-off-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.skippedText}>
                  Showing all {opportunities.length} opportunities · {skipped.length} previously skipped
                </Text>
              </View>
            ) : null
          }
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
      ) : (
        <SwipeDeck
          opportunities={opportunities}
          saved={saved}
          skipped={skipped}
          onSave={(id) => toggleSave({ opportunityId: id, saved: false })}
          onSkip={(id) => setSkipped((prev) => [...prev, id])}
          onBrowseAll={() => setListMode(true)}
        />
      )}

      <Modal visible={filterModal} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setFilterModal(false)}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Filter by type</Text>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.label}
                style={styles.dropdownItem}
                onPress={() => { setFilter(f.value); setFilterModal(false) }}
              >
                <Text style={[styles.dropdownText, filter === f.value && styles.dropdownTextActive]}>{f.label}</Text>
                {filter === f.value && <Ionicons name="checkmark" size={16} color={Colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  greeting: { fontSize: 15, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary, maxWidth: 180 },
  sub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 2 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleBtn: { padding: 2 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.primary + '22', paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full },
  filterBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  journeyBanner: { marginHorizontal: 16, marginTop: 12, backgroundColor: Colors.card, borderRadius: Radius.md, padding: 14, borderWidth: 1, borderColor: Colors.border },
  journeyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  journeyPath: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  journeyStage: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  readiness: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  progressTrack: { height: 4, backgroundColor: Colors.border, borderRadius: 2, marginBottom: 10 },
  progressFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  nextStepRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nextStepText: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
  list: { paddingBottom: 24 },
  skippedBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 12 },
  skippedText: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 60, fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 100, paddingRight: 16 },
  dropdown: { backgroundColor: Colors.card, borderRadius: 8, paddingVertical: 8, width: 200, borderWidth: 1, borderColor: Colors.border },
  dropdownTitle: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 16, paddingVertical: 8 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  dropdownText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  dropdownTextActive: { color: Colors.primary, fontFamily: 'Inter_700Bold' },
})
