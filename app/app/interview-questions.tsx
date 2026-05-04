import { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  TextInput, Modal, ActivityIndicator, Alert, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius } from '../lib/design'
import { useProfile } from '../hooks/useProfile'
import { useInterviewQuestions, useInterviewAnswers, useAddAnswer, useAddQuestion } from '../hooks/usePrep'

const CATEGORIES = [
  { label: 'All', value: undefined },
  { label: 'General', value: 'general' },
  { label: 'Behavioural', value: 'behavioural' },
  { label: 'Technical', value: 'technical' },
  { label: 'Situational', value: 'situational' },
]

const DIFF_COLOR: Record<string, string> = {
  easy: Colors.mint,
  medium: Colors.gold,
  hard: Colors.coral,
}

// ── Answers bottom sheet ──────────────────────────────────────
function AnswersSheet({ question, onClose }: { question: any; onClose: () => void }) {
  const { data: answers = [], isLoading } = useInterviewAnswers(question.id)
  const { mutate: addAnswer, isPending } = useAddAnswer()
  const [text, setText] = useState('')

  function submit() {
    if (!text.trim()) return
    addAnswer({ questionId: question.id, content: text.trim() }, { onSuccess: () => setText('') })
  }

  return (
    <View style={sheet.container}>
      <View style={sheet.handle} />

      {/* Question */}
      <Text style={sheet.question}>{question.question}</Text>

      {/* Suggested answer */}
      {question.suggested_answer && (
        <View style={sheet.suggestedBox}>
          <View style={sheet.suggestedHeader}>
            <View style={sheet.suggestedDot} />
            <Text style={sheet.suggestedLabel}>Suggested approach</Text>
          </View>
          <Text style={sheet.suggestedText}>{question.suggested_answer}</Text>
        </View>
      )}

      {/* Community answers */}
      <Text style={sheet.sectionLabel}>Community answers · {answers.length}</Text>

      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginVertical: 16 }} />
        : answers.length === 0
          ? <Text style={sheet.empty}>No answers yet. Be the first.</Text>
          : <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {answers.map((a: any) => (
                <View key={a.id} style={sheet.answerRow}>
                  <View style={sheet.answerDot} />
                  <View style={sheet.answerBody}>
                    <Text style={sheet.answerAuthor}>{a.profiles?.name ?? 'Anonymous'}</Text>
                    <Text style={sheet.answerText}>{a.content}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
      }

      {/* Add answer */}
      <View style={sheet.inputRow}>
        <TextInput
          style={sheet.input}
          value={text}
          onChangeText={setText}
          placeholder="Share your answer or experience..."
          placeholderTextColor={Colors.textMuted}
          multiline
        />
        <TouchableOpacity style={sheet.sendBtn} onPress={submit} disabled={isPending}>
          <Ionicons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ── Add question modal ────────────────────────────────────────
function AddQuestionModal({ careerPath, onClose }: { careerPath: string | null; onClose: () => void }) {
  const { mutate: addQuestion, isPending } = useAddQuestion()
  const [question, setQuestion] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [category, setCategory] = useState('general')

  function submit() {
    if (!question.trim()) return Alert.alert('Enter a question')
    addQuestion({ question: question.trim(), career_path: careerPath, difficulty, category }, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <SafeAreaView style={addModal.container}>
      <View style={addModal.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={addModal.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={addModal.title}>Add Question</Text>
        <TouchableOpacity onPress={submit} disabled={isPending}>
          <Text style={addModal.post}>{isPending ? 'Posting...' : 'Post'}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={addModal.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="What was the interview question?"
        placeholderTextColor={Colors.textMuted}
        multiline
        autoFocus
      />

      <View style={addModal.section}>
        <Text style={addModal.label}>Difficulty</Text>
        <View style={addModal.row}>
          {['easy', 'medium', 'hard'].map((d) => (
            <TouchableOpacity
              key={d}
              style={[addModal.chip, difficulty === d && { backgroundColor: DIFF_COLOR[d] + '22', borderColor: DIFF_COLOR[d] }]}
              onPress={() => setDifficulty(d)}
            >
              <Text style={[addModal.chipText, difficulty === d && { color: DIFF_COLOR[d] }]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[addModal.label, { marginTop: 16 }]}>Category</Text>
        <View style={addModal.row}>
          {['general', 'behavioural', 'technical', 'situational'].map((c) => (
            <TouchableOpacity
              key={c}
              style={[addModal.chip, category === c && { backgroundColor: Colors.primary + '22', borderColor: Colors.primary }]}
              onPress={() => setCategory(c)}
            >
              <Text style={[addModal.chipText, category === c && { color: Colors.primary }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

// ── Main screen ───────────────────────────────────────────────
export default function InterviewQuestions() {
  const router = useRouter()
  const { data: profile } = useProfile()
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [selected, setSelected] = useState<any>(null)
  const [showAdd, setShowAdd] = useState(false)

  const { data: questions = [], isLoading } = useInterviewQuestions(profile?.career_path ?? null, category)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.heading}>Interview Questions</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)} hitSlop={8}>
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Category filter — X-style horizontal chips */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.label}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, category === item.value && styles.filterChipActive]}
            onPress={() => setCategory(item.value)}
          >
            <Text style={[styles.filterText, category === item.value && styles.filterTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        : <FlatList
            data={questions}
            keyExtractor={(q) => q.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.empty}>No questions for this filter yet.</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => setSelected(item)}
                activeOpacity={0.7}
              >
                {/* Left thread colored by difficulty */}
                <View style={[styles.thread, { backgroundColor: DIFF_COLOR[item.difficulty] }]} />

                <View style={styles.rowBody}>
                  <View style={styles.rowMeta}>
                    <Text style={[styles.diffLabel, { color: DIFF_COLOR[item.difficulty] }]}>
                      {item.difficulty}
                    </Text>
                    <Text style={styles.catLabel}>{item.category}</Text>
                    {item.is_curated && <Text style={styles.curatedLabel}>⭐ curated</Text>}
                  </View>
                  <Text style={styles.questionText}>{item.question}</Text>

                  {/* X-style action row */}
                  <View style={styles.actionRow}>
                    <View style={styles.action}>
                      <Ionicons name="chatbubble-outline" size={14} color={Colors.textMuted} />
                      <Text style={styles.actionText}>Answer</Text>
                    </View>
                    {item.suggested_answer && (
                      <View style={styles.action}>
                        <Ionicons name="bulb-outline" size={14} color={Colors.textMuted} />
                        <Text style={styles.actionText}>Tip included</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
      }

      {/* Answers sheet */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSelected(null)} />
        {selected && <AnswersSheet question={selected} onClose={() => setSelected(null)} />}
      </Modal>

      {/* Add question */}
      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <AddQuestionModal careerPath={profile?.career_path ?? null} onClose={() => setShowAdd(false)} />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 17, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  filterRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  filterTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
  thread: { width: 3 },
  rowBody: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  diffLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  catLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.textMuted },
  curatedLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.gold },
  questionText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, lineHeight: 22, marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 20 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 60, fontSize: 14, fontFamily: 'Inter_400Regular' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
})

const sheet = StyleSheet.create({
  container: { backgroundColor: Colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%', borderTopWidth: 1, borderColor: Colors.border },
  handle: { width: 36, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  question: { fontSize: 17, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary, lineHeight: 24, marginBottom: 16 },
  suggestedBox: { borderLeftWidth: 3, borderLeftColor: Colors.primary, paddingLeft: 12, marginBottom: 20 },
  suggestedHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  suggestedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  suggestedLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  suggestedText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 19 },
  sectionLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  empty: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginBottom: 16 },
  answerRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  answerDot: { width: 3, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'stretch' },
  answerBody: { flex: 1 },
  answerAuthor: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.primary, marginBottom: 3 },
  answerText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 18 },
  inputRow: { flexDirection: 'row', gap: 10, marginTop: 16, alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: Colors.cardAlt, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 12, fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, maxHeight: 80 },
  sendBtn: { backgroundColor: Colors.primary, width: 42, height: 42, borderRadius: Radius.full, justifyContent: 'center', alignItems: 'center' },
})

const addModal = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 16, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  cancel: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  post: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.primary },
  input: { flex: 1, padding: 16, fontSize: 16, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, textAlignVertical: 'top', borderBottomWidth: 1, borderBottomColor: Colors.border },
  section: { padding: 16 },
  label: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, textTransform: 'capitalize' },
})
