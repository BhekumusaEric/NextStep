import { useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useComments, useCreateComment, useUpvote, usePosts } from '../../hooks/usePosts'

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [text, setText] = useState('')

  const { data: posts } = usePosts()
  const post = posts?.find((p) => p.id === id)
  const { data: comments, isLoading } = useComments(id)
  const { mutate: createComment, isPending } = useCreateComment()
  const { mutate: upvote } = useUpvote()

  function handleComment() {
    if (!text.trim()) return
    createComment({ postId: id, content: text.trim() }, { onSuccess: () => setText('') })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Post</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={comments}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={post ? (
            <View style={styles.postBlock}>
              <View style={styles.authorRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(post.profiles?.name ?? 'U')[0].toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.name}>{post.profiles?.name ?? 'Anonymous'}</Text>
                  {post.profiles?.university && <Text style={styles.uni}>{post.profiles.university}</Text>}
                </View>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
              <TouchableOpacity style={styles.upvoteRow} onPress={() => upvote(post.id)}>
                <Ionicons name="arrow-up-circle-outline" size={20} color="#4f46e5" />
                <Text style={styles.upvoteText}>{post.upvotes} upvotes</Text>
              </TouchableOpacity>
              <Text style={styles.commentsLabel}>Comments</Text>
            </View>
          ) : null}
          ListEmptyComponent={
            !isLoading ? <Text style={styles.empty}>No comments yet. Start the conversation.</Text> : null
          }
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <View style={styles.commentAvatar}>
                <Text style={styles.avatarText}>{(item.profiles?.name ?? 'U')[0].toUpperCase()}</Text>
              </View>
              <View style={styles.commentBody}>
                <Text style={styles.commentName}>{item.profiles?.name ?? 'Anonymous'}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
              </View>
            </View>
          )}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleComment} disabled={isPending}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fb' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  topTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  postBlock: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  name: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  uni: { fontSize: 12, color: '#888' },
  postContent: { fontSize: 15, color: '#333', lineHeight: 22, marginBottom: 14 },
  upvoteRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  upvoteText: { fontSize: 13, color: '#4f46e5', fontWeight: '600' },
  commentsLabel: { fontSize: 13, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 24, fontSize: 14 },
  comment: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center' },
  commentBody: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  commentName: { fontSize: 12, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
  commentText: { fontSize: 14, color: '#333', lineHeight: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f0f0f0' },
  input: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' },
})
