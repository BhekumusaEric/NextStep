import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Post } from '../hooks/usePosts'

const CATEGORY_COLORS: Record<string, string> = {
  question: '#4f46e5',
  opportunity: '#059669',
  interview: '#d97706',
  career_win: '#db2777',
  advice: '#0891b2',
}

const CATEGORY_LABELS: Record<string, string> = {
  question: 'Question',
  opportunity: 'Opportunity',
  interview: 'Interview',
  career_win: '🏆 Win',
  advice: 'Advice',
}

interface Props {
  post: Post
  onUpvote: () => void
}

export default function PostCard({ post, onUpvote }: Props) {
  const router = useRouter()
  const color = CATEGORY_COLORS[post.category] ?? '#4f46e5'
  const timeAgo = getTimeAgo(post.created_at)

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => router.push(`/post/${post.id}`)}>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(post.profiles?.name ?? 'U')[0].toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.name}>{post.profiles?.name ?? 'Anonymous'}</Text>
            <Text style={styles.time}>{timeAgo}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: color + '18' }]}>
          <Text style={[styles.badgeText, { color }]}>{CATEGORY_LABELS[post.category] ?? post.category}</Text>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={3}>{post.content}</Text>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.action} onPress={onUpvote}>
          <Ionicons name="arrow-up-circle-outline" size={18} color="#4f46e5" />
          <Text style={styles.actionText}>{post.upvotes}</Text>
        </TouchableOpacity>
        <View style={styles.action}>
          <Ionicons name="chatbubble-outline" size={16} color="#888" />
          <Text style={styles.actionText}>{post.comment_count}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  name: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  time: { fontSize: 11, color: '#aaa' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  content: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 12 },
  footer: { flexDirection: 'row', gap: 16 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, color: '#888' },
})
