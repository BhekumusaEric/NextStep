import { useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useComments, useCreateComment, useUpvote, useUpvotedPosts, usePosts } from '../../hooks/usePosts'
import { Colors, Radius } from '../../lib/design'

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [text, setText] = useState('')

  const { data: posts } = usePosts()
  const post = posts?.find((p) => p.id === id)
  const { data: comments, isLoading } = useComments(id)
  const { mutate: createComment, isPending } = useCreateComment()
  const { mutate: upvote } = useUpvote()
  const { data: upvoted = [] } = useUpvotedPosts()
  const isUpvoted = upvoted.includes(id)

  function handleComment() {
    if (!text.trim()) return
    createComment({ postId: id, content: text.trim() }, { onSuccess: () => setText('') })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
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
              {/* Author row */}
              <View style={styles.authorRow}>
                <View style={styles.avatar}>
                  {post.profiles?.avatar_url
                    ? <Image source={post.profiles.avatar_url} style={styles.avatarImg} contentFit="cover" cachePolicy="none" />
                    : <Text style={styles.avatarText}>{(post.profiles?.name ?? 'U')[0].toUpperCase()}</Text>
                  }
                </View>
                <View>
                  <Text style={styles.name}>{post.profiles?.name ?? 'Anonymous'}</Text>
                  {post.profiles?.university && <Text style={styles.uni}>{post.profiles.university}</Text>}
                </View>
              </View>

              <Text style={styles.postContent}>{post.content}</Text>

              {/* Action row */}
              <View style={styles.actions}>
                <View style={styles.action}>
                  <Ionicons name="chatbubble-outline" size={17} color={Colors.textSecondary} />
                  <Text style={styles.actionText}>{post.comment_count}</Text>
                </View>
                <TouchableOpacity style={styles.action} onPress={() => !isUpvoted && upvote(post.id)}>
                  <Ionicons
                    name={isUpvoted ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
                    size={17}
                    color={isUpvoted ? Colors.coral : Colors.textSecondary}
                  />
                  <Text style={[styles.actionText, isUpvoted && { color: Colors.coral }]}>{post.upvotes}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.commentsLabel}>Replies</Text>
            </View>
          ) : null}
          ListEmptyComponent={
            !isLoading ? <Text style={styles.empty}>No replies yet. Start the conversation.</Text> : null
          }
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <View style={styles.commentAvatarCol}>
                <View style={styles.commentAvatar}>
                  {item.profiles?.avatar_url
                    ? <Image source={item.profiles.avatar_url} style={styles.commentAvatarImg} contentFit="cover" cachePolicy="none" />
                    : <Text style={styles.commentAvatarText}>{(item.profiles?.name ?? 'U')[0].toUpperCase()}</Text>
                  }
                </View>
                <View style={styles.threadLine} />
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
            placeholder="Add a reply..."
            placeholderTextColor={Colors.textMuted}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleComment} disabled={isPending}>
            <Ionicons name="send" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  topTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  list: { paddingBottom: 16 },
  postBlock: { padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  avatar: { width: 42, height: 42, borderRadius: Radius.full, backgroundColor: Colors.cardAlt, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarImg: { width: 42, height: 42, borderRadius: Radius.full },
  avatarText: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15 },
  name: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  uni: { fontSize: 12, color: Colors.textSecondary },
  postContent: { fontSize: 16, color: Colors.textPrimary, lineHeight: 24, marginBottom: 16 },
  actions: { flexDirection: 'row', gap: 24, marginBottom: 20 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 13, color: Colors.textSecondary },
  commentsLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 24, fontSize: 14 },
  comment: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  commentAvatarCol: { alignItems: 'center', marginRight: 10 },
  commentAvatar: { width: 34, height: 34, borderRadius: Radius.full, backgroundColor: Colors.cardAlt, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  commentAvatarImg: { width: 34, height: 34, borderRadius: Radius.full },
  commentAvatarText: { color: Colors.textPrimary, fontWeight: '700', fontSize: 12 },
  threadLine: { flex: 1, width: 2, backgroundColor: Colors.border, marginTop: 4, minHeight: 16 },
  commentBody: { flex: 1, paddingBottom: 14 },
  commentName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  commentText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, backgroundColor: Colors.cardAlt, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
  sendBtn: { width: 38, height: 38, borderRadius: Radius.full, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
})
