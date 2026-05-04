import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius } from '../../lib/design'
import { useProfile } from '../../hooks/useProfile'

const PATH_TITLES: Record<string, string> = {
  frontend_dev: 'Frontend Developer',
  data_analyst: 'Data Analyst',
  ui_ux_designer: 'UI/UX Designer',
  backend_dev: 'Backend Developer',
  product_manager: 'Product Manager',
  cybersecurity: 'Cybersecurity Analyst',
  digital_marketing: 'Digital Marketer',
}

const SECTIONS = [
  {
    key: 'cv',
    icon: 'document-text-outline' as const,
    color: Colors.primary,
    title: 'CV Builder',
    description: 'Build and export a professional PDF CV.',
    route: '/cv-builder',
    tag: 'Export PDF',
  },
  {
    key: 'questions',
    icon: 'chatbubbles-outline' as const,
    color: Colors.mint,
    title: 'Interview Questions',
    description: 'Curated + community questions for your path.',
    route: '/interview-questions',
    tag: 'Community',
  },
  {
    key: 'tips',
    icon: 'bulb-outline' as const,
    color: Colors.gold,
    title: 'Interview Tips',
    description: 'Before, during and after — walk in confident.',
    route: '/interview-tips',
    tag: '13 tips',
  },
  {
    key: 'checklist',
    icon: 'checkbox-outline' as const,
    color: Colors.coral,
    title: 'Interview Checklist',
    description: 'Run through this the night before.',
    route: '/interview-checklist',
    tag: 'Interactive',
  },
]

export default function Prep() {
  const router = useRouter()
  const { data: profile } = useProfile()
  const pathTitle = profile?.career_path ? PATH_TITLES[profile.career_path] : null

  return (
    <SafeAreaView style={styles.container}>
      {/* X-style top bar */}
      <View style={styles.topBar}>
        <Text style={styles.heading}>Get Ready</Text>
        {pathTitle && (
          <View style={styles.pathPill}>
            <Ionicons name="compass" size={12} color={Colors.primary} />
            <Text style={styles.pathPillText}>{pathTitle}</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero strip */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Land the role.</Text>
          <Text style={styles.heroSub}>
            Everything you need — from CV to offer letter.
          </Text>
        </View>

        {/* Section cards — X-style feed rows */}
        {SECTIONS.map((s, i) => (
          <TouchableOpacity
            key={s.key}
            style={[styles.row, i === SECTIONS.length - 1 && styles.rowLast]}
            onPress={() => router.push(s.route as any)}
            activeOpacity={0.7}
          >
            {/* Left color thread */}
            <View style={[styles.thread, { backgroundColor: s.color }]} />

            <View style={[styles.iconWrap, { backgroundColor: s.color + '18' }]}>
              <Ionicons name={s.icon} size={22} color={s.color} />
            </View>

            <View style={styles.rowBody}>
              <View style={styles.rowTop}>
                <Text style={styles.rowTitle}>{s.title}</Text>
                <View style={[styles.tag, { backgroundColor: s.color + '18' }]}>
                  <Text style={[styles.tagText, { color: s.color }]}>{s.tag}</Text>
                </View>
              </View>
              <Text style={styles.rowDesc}>{s.description}</Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Community callout — X-style pinned note */}
        <View style={styles.communityRow}>
          <View style={styles.communityDot} />
          <View style={styles.communityBody}>
            <Text style={styles.communityTitle}>Community-powered questions</Text>
            <Text style={styles.communityDesc}>
              Members who've interviewed at top companies share the actual questions they were asked. You can contribute too.
            </Text>
            <TouchableOpacity
              style={styles.communityBtn}
              onPress={() => router.push('/interview-questions')}
            >
              <Text style={styles.communityBtnText}>Add a question →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 20, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  pathPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.primary + '18', paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  pathPillText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  hero: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heroTitle: { fontSize: 28, fontFamily: 'Sora_700Bold', color: Colors.textPrimary, letterSpacing: -0.5 },
  heroSub: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLast: { borderBottomWidth: 0 },
  thread: { width: 3, height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0 },
  iconWrap: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  rowBody: { flex: 1 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  rowTitle: { fontSize: 15, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  tagText: { fontSize: 10, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  rowDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 18 },
  communityRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 20, borderTopWidth: 1, borderTopColor: Colors.border, marginTop: 8 },
  communityDot: { width: 3, backgroundColor: Colors.primary, borderRadius: 2, alignSelf: 'stretch' },
  communityBody: { flex: 1 },
  communityTitle: { fontSize: 14, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary, marginBottom: 5 },
  communityDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 19, marginBottom: 10 },
  communityBtn: { alignSelf: 'flex-start' },
  communityBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
})
