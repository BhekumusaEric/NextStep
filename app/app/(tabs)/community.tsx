import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePosts, useCreatePost, useUpvote } from '../../hooks/usePosts'
import PostCard from '../../components/PostCard'

const CATEGORIES = ['question', 'opportunity', 'interview', 'career_win', 'advice']
const CATEGORY_LABELS: Record<string, string> = {
  question: 'Question', opportunity: 'Opportunity', interview: 'Interview', career_win: '🏆 Win', advice: 'Advice',
}

export default function Community() {
  const { data: posts, isLoading } = usePosts()
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
        <ActivityIndicator style={{ marginTop: 40 }} color="#4f46e5" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.empty}>No posts yet. Be the first to share something.</Text>}
          renderItem={({ item }) => (
            <PostCard post={item} onUpvote={() => upvote(item.id)} />
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
  container: { flex: 1, backgroundColor: '#f8f9fb' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  heading: { fontSize: 24, fontWeight: '700', color: '#1a1a2e' },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#4f46e5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  newBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 60, fontSize: 14 },
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  cancel: { fontSize: 15, color: '#888' },
  postBtn: { fontSize: 15, fontWeight: '700', color: '#4f46e5' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  catChipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  catText: { fontSize: 12, color: '#555', fontWeight: '500' },
  catTextActive: { color: '#fff' },
  textInput: { flex: 1, padding: 16, fontSize: 15, color: '#1a1a2e', textAlignVertical: 'top' },
})
