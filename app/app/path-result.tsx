import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Colors, Radius } from '../lib/design'

const PATH_META: Record<string, { title: string; icon: string; description: string }> = {
  frontend_dev:     { title: 'Frontend Developer',    icon: '💻', description: 'Build interfaces people interact with every day.' },
  data_analyst:     { title: 'Data Analyst',           icon: '📊', description: 'Turn raw data into decisions that drive business.' },
  ui_ux_designer:   { title: 'UI/UX Designer',         icon: '🎨', description: 'Design experiences that feel effortless.' },
  backend_dev:      { title: 'Backend Developer',      icon: '⚙️', description: 'Build the systems that power applications.' },
  product_manager:  { title: 'Product Manager',        icon: '🚀', description: 'Lead products from idea to launch.' },
  cybersecurity:    { title: 'Cybersecurity Analyst',  icon: '🔒', description: 'Protect systems and the people who use them.' },
  digital_marketing:{ title: 'Digital Marketer',       icon: '📱', description: 'Grow brands through digital channels.' },
}

const STAGE_LABELS: Record<number, string> = {
  1: "You're at the start — that's the best place to begin.",
  2: "You've got some foundation. Time to build on it.",
  3: "You're building skills. Keep the momentum.",
  4: "You're close to opportunity-ready. Push through.",
  5: "You're ready to apply. Start putting yourself out there.",
  6: "You've landed something. Now grow from here.",
  7: "You're established. Time to give back.",
}

export default function PathResult() {
  const router = useRouter()
  const { career_path, journey_stage } = useLocalSearchParams<{ career_path: string; journey_stage: string }>()

  const stage = Number(journey_stage) || 1
  const meta = PATH_META[career_path] ?? PATH_META['frontend_dev']
  const readiness = Math.min(Math.round((stage / 7) * 100), 100)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Your path has been set</Text>

        <View style={styles.pathCard}>
          <Text style={styles.pathIcon}>{meta.icon}</Text>
          <Text style={styles.pathTitle}>{meta.title}</Text>
          <Text style={styles.pathDesc}>{meta.description}</Text>
        </View>

        <View style={styles.stageBlock}>
          <View style={styles.stageRow}>
            <Text style={styles.stageLabel}>Journey Stage</Text>
            <Text style={styles.stageValue}>{stage} / 7</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${readiness}%` as any }]} />
          </View>
          <Text style={styles.stageMessage}>{STAGE_LABELS[stage]}</Text>
        </View>

        <View style={styles.nextBlock}>
          <Text style={styles.nextTitle}>What happens next</Text>
          <Text style={styles.nextItem}>📍 Your home screen shows your personalised roadmap</Text>
          <Text style={styles.nextItem}>🃏 Opportunities are matched to where you are</Text>
          <Text style={styles.nextItem}>👥 Mentors on your path are surfaced for you</Text>
          <Text style={styles.nextItem}>🏆 Complete steps to level up your stage</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)/home')}>
          <Text style={styles.btnText}>Let's go 🚀</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 24 },
  eyebrow: { fontSize: 13, color: Colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20, marginTop: 16 },
  pathCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary + '44', marginBottom: 24 },
  pathIcon: { fontSize: 52, marginBottom: 12 },
  pathTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  pathDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  stageBlock: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  stageRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stageLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  stageValue: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: Colors.border, borderRadius: 3, marginBottom: 12 },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  stageMessage: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  nextBlock: { gap: 12 },
  nextTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  nextItem: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: Colors.border },
  btn: { backgroundColor: Colors.primary, padding: 16, borderRadius: Radius.md, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
})
