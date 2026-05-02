import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePosts, useCreatePost, useUpvote, useUpvotedPosts } from '../../hooks/usePosts'
import { useSubmitOpportunity } from '../../hooks/useOpportunities'
import PostCard from '../../components/PostCard'
import { Colors, Radius } from '../../lib/design'
import { OpportunityType } from '../../lib/types'

const CATEGORIES = ['question', 'opportunity', 'interview', 'career_win', 'advice']
const CATEGORY_LABELS: Record<string, string> = {
  question: 'Question',
  opportunity: 'Opportunity',
  interview: 'Interview',
  career_win: '🏆 Win',
  advice: 'Advice',
}

const OPP_TYPES: OpportunityType[] = ['internship', 'learnership', 'graduate', 'scholarship', 'event', 'bootcamp']

export default function Community() {
  const { data: posts, isLoading } = usePosts()
  const { data: upvoted = [] } = useUpvotedPosts()
  const { mutate: upvote } = useUpvote()
  const { mutate: createPost, isPending: postingPost } = useCreatePost()
  const { mutate: submitOpportunity, isPending: postingOpp } = useSubmitOpportunity()

  const [modal, setModal] = useState(false)
  const [category, setCategory] = useState('question')

  // Regular post fields
  const [content, setContent] = useState('')

  // Opportunity fields
  const [oppTitle, setOppTitle] = useState('')
  const [oppOrg, setOppOrg] = useState('')
  const [oppType, setOppType] = useState<OpportunityType>('internship')
  const [oppDeadline, setOppDeadline] = useState('')
  const [oppLocation, setOppLocation] = useState('')
  const [oppEligibility, setOppEligibility] = useState('')
  const [oppLink, setOppLink] = useState('')
  const [oppTags, setOppTags] = useState('')

  const isPending = postingPost || postingOpp
  const isOpp = category === 'opportunity'

  function resetForm() {
    setContent('')
    setOppTitle(''); setOppOrg(''); setOppType('internship')
    setOppDeadline(''); setOppLocation(''); setOppEligibility('')
    setOppLink(''); setOppTags('')
    setCategory('question')
  }

  function handlePost() {
    if (isOpp) {
      if (!oppTitle.trim() || !oppOrg.trim()) return Alert.alert('Title and organization are required')
      submitOpportunity({
        title: oppTitle.trim(),
        organization: oppOrg.trim(),
        type: oppType,
        deadline: oppDeadline.trim() || null,
        location: oppLocation.trim(),
        eligibility: oppEligibility.trim(),
        link: oppLink.trim(),
        tags: oppTags.split(',').map((t) => t.trim()).filter(Boolean),
      }, {
        onSuccess: () => {
          setModal(false)
          resetForm()
          Alert.alert('Submitted!', 'Your opportunity has been submitted for review.')
        },
        onError: (err: any) => {
          Alert.alert('Submission failed', err?.message ?? 'Unknown error')
        },
      })
    } else {
      if (!content.trim()) return Alert.alert('Write something first')
      createPost({ content: content.trim(), category }, {
        onSuccess: () => { setModal(false); resetForm() },
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Community</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => setModal(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.newBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="people-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.empty}>Your network is quiet...</Text>
              <Text style={styles.emptySub}>Why not start the conversation?</Text>
            </View>
          }
          renderItem={({ item }) => (
            <PostCard post={item} upvoted={upvoted.includes(item.id)} onUpvote={() => upvote(item.id)} />
          )}
        />
      )}

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setModal(false); resetForm() }}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{isOpp ? 'Submit Opportunity' : 'New Post'}</Text>
            <TouchableOpacity onPress={handlePost} disabled={isPending}>
              <Text style={styles.postBtn}>{isPending ? 'Posting...' : isOpp ? 'Submit' : 'Post'}</Text>
            </TouchableOpacity>
          </View>

          {/* Category chips */}
          <View style={styles.categoryRow}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.catChip, category === c && styles.catChipActive]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.catText, category === c && styles.catTextActive]}>
                  {CATEGORY_LABELS[c]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Opportunity form */}
          {isOpp ? (
            <ScrollView contentContainerStyle={styles.oppForm} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.infoBanner}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoText}>Opportunities are reviewed before appearing in the feed.</Text>
              </View>

              {[
                { label: 'Title *', value: oppTitle, set: setOppTitle, placeholder: 'e.g. Software Engineering Intern' },
                { label: 'Organization *', value: oppOrg, set: setOppOrg, placeholder: 'e.g. Standard Bank' },
                { label: 'Deadline (YYYY-MM-DD)', value: oppDeadline, set: setOppDeadline, placeholder: 'e.g. 2025-03-31' },
                { label: 'Location', value: oppLocation, set: setOppLocation, placeholder: 'e.g. Johannesburg / Remote' },
                { label: 'Eligibility', value: oppEligibility, set: setOppEligibility, placeholder: 'e.g. 3rd year students, South African citizens' },
                { label: 'Apply Link', value: oppLink, set: setOppLink, placeholder: 'https://...' },
                { label: 'Tags (comma separated)', value: oppTags, set: setOppTags, placeholder: 'e.g. tech, data, finance' },
              ].map((f) => (
                <View key={f.label} style={styles.field}>
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={f.value}
                    onChangeText={f.set}
                    placeholder={f.placeholder}
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="none"
                  />
                </View>
              ))}

              {/* Type selector */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Type *</Text>
                <View style={styles.typeRow}>
                  {OPP_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.typeChip, oppType === t && styles.typeChipActive]}
                      onPress={() => setOppType(t)}
                    >
                      <Text style={[styles.typeChipText, oppType === t && styles.typeChipTextActive]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          ) : (
            /* Regular post text input */
            <TextInput
              style={styles.textInput}
              placeholder="Share an opportunity, ask a question, celebrate a win..."
              placeholderTextColor={Colors.textMuted}
              multiline
              value={content}
              onChangeText={setContent}
              autoFocus
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 20, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full },
  newBtnText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  list: { paddingBottom: 24 },
  emptyWrap: { alignItems: 'center', marginTop: 60, gap: 8 },
  empty: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  emptySub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted },

  // Modal
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 16, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  cancel: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  postBtn: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.primary },

  // Category chips
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  catTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },

  // Regular post input
  textInput: { flex: 1, padding: 16, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, textAlignVertical: 'top' },

  // Opportunity form
  oppForm: { padding: 16, paddingBottom: 40 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary + '18', borderRadius: Radius.md, padding: 12, marginBottom: 20 },
  infoText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.primary, lineHeight: 18 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  input: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: 14, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeChipText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, textTransform: 'capitalize' },
  typeChipTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },
})
