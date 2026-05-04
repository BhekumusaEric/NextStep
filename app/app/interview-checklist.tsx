import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SectionList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius } from '../lib/design'

const CHECKLIST = [
  {
    title: 'Night Before',
    color: Colors.primary,
    data: [
      'Research the company — products, values, recent news',
      'Re-read the job description and match your experience to it',
      'Prepare 3 STAR stories (challenge, teamwork, achievement)',
      'Prepare 3 questions to ask the interviewer',
      'Lay out your outfit',
      'Print 2 copies of your CV',
      'Confirm the interview time, location and interviewer name',
      'Test your tech if it\'s a virtual interview',
      'Get a good night\'s sleep',
    ],
  },
  {
    title: 'Morning Of',
    color: Colors.mint,
    data: [
      'Eat a proper meal',
      'Arrive 10–15 minutes early (or log in 5 minutes early)',
      'Bring your CV copies, a pen and a notebook',
      'Put your phone on silent',
      'Take 3 deep breaths before walking in',
    ],
  },
  {
    title: 'During',
    color: Colors.gold,
    data: [
      'Listen to the full question before answering',
      'Use the STAR method for behavioural questions',
      'Ask for clarification if a question is unclear',
      'Show genuine enthusiasm for the role',
      'Ask your prepared questions at the end',
    ],
  },
  {
    title: 'After',
    color: Colors.coral,
    data: [
      'Send a thank-you email within 24 hours',
      'Write down the questions you were asked',
      'Note what went well and what to improve',
      'Follow up after 5–7 business days if no response',
    ],
  },
]

const TOTAL = CHECKLIST.reduce((acc, s) => acc + s.data.length, 0)

export default function InterviewChecklist() {
  const router = useRouter()
  const [checked, setChecked] = useState<Set<string>>(new Set())

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const done = checked.size
  const progress = Math.round((done / TOTAL) * 100)
  const allDone = done === TOTAL

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.heading}>Checklist</Text>
        <TouchableOpacity onPress={() => setChecked(new Set())} hitSlop={8}>
          <Text style={styles.reset}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar — Tinder-style match moment */}
      <View style={styles.progressBlock}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>{done} / {TOTAL} done</Text>
          {allDone
            ? <Text style={styles.readyText}>🎉 You're ready. Go get it.</Text>
            : <Text style={styles.progressPct}>{progress}%</Text>
          }
        </View>
      </View>

      <SectionList
        sections={CHECKLIST}
        keyExtractor={(item, i) => `${item}-${i}`}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
            <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item, section }) => {
          const key = `${section.title}:${item}`
          const isChecked = checked.has(key)
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => toggle(key)}
              activeOpacity={0.7}
            >
              {/* Left thread */}
              <View style={[styles.thread, { backgroundColor: isChecked ? section.color : Colors.border }]} />
              <View style={[styles.checkbox, isChecked && { backgroundColor: section.color, borderColor: section.color }]}>
                {isChecked && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={[styles.itemText, isChecked && styles.itemTextDone]}>{item}</Text>
            </TouchableOpacity>
          )
        }}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 17, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  reset: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textMuted },
  progressBlock: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 8 },
  progressTrack: { height: 3, backgroundColor: Colors.border, borderRadius: 2 },
  progressFill: { height: 3, backgroundColor: Colors.primary, borderRadius: 2 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textMuted },
  progressPct: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.primary },
  readyText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: Colors.mint },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 11, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  thread: { width: 3, alignSelf: 'stretch' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', marginTop: 14, flexShrink: 0 },
  itemText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, lineHeight: 20, paddingVertical: 14, paddingRight: 16 },
  itemTextDone: { color: Colors.textMuted, textDecorationLine: 'line-through' },
})
