import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePosts, useCreatePost, useUpvote, useUpvotedPosts } from '../../hooks/usePosts'
import PostCard from '../../components/PostCard'
import { Colors } from '../../lib/design'

const CATEGORIES = ['question', 'opportunity', 'interview', 'career_win', 'advice']
const CATEGORY_LABELS: Record<string, string> = {
  question: 'Question', opportunity: 'Opportunity', interview: 'Interview', career_win: '🏆 Win', advice: 'Advice',
}

export default function Community() {
  const { data: posts, isLoading } = usePosts()
  const { data: upvoted = [] } = useUpvotedPosts()
  const { mutate: upvote } = useUpvote()
  const { mutate: createPost, isPending } = useCreatePost()
  const [modal, setModal] = useState(false)
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('question')

  function handlePost() {
    if (!content.trim()) return Alert.alert('Write something first')
    createPost({ content: content.trim(), category }, {
      onSuccess: () => { setModal(false); setContent(''); setCategory('question') },
    })
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
          ListEmptyComponent={<Text style={styles.empty}>No posts yet. Be the first to share something.</Text>}
          renderItem={({ item }) => (
            <PostCard post={item} upvoted={upvoted.includes(item.id)} onUpvote={() => upvote(item.id)} />
          )}
        />
      )}

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Post</Text>
            <TouchableOpacity onPress={handlePost} disabled={isPending}>
              <Text style={styles.postBtn}>{isPending ? 'Posting...' : 'Post'}</Text>
            </TouchableOpacity>
          </View>

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

          <TextInput
            style={styles.textInput}
            placeholder="Share an opportunity, ask a question, celebrate a win..."
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  heading: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  newBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 60, fontSize: 14 },
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: Colors.border },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  cancel: { fontSize: 15, color: Colors.textMuted },
  postBtn: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  catTextActive: { color: '#fff' },
  textInput: { flex: 1, padding: 16, fontSize: 15, color: Colors.textPrimary, textAlignVertical: 'top' },
})
