import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Post } from '../hooks/usePosts'
import { Colors, Radius } from '../lib/design'

const CATEGORY_COLORS: Record<string, string> = {
  question: Colors.primary,
  opportunity: Colors.mint,
  interview: Colors.gold,
  career_win: Colors.coral,
  advice: '#A78BFA',
}

const CATEGORY_LABELS: Record<string, string> = {
  question: 'Question',
  opportunity: 'Opportunity',
  interview: 'Interview',
  career_win: 'Win',
  advice: 'Advice',
}

interface Props {
  post: Post
  onUpvote: () => void
  upvoted?: boolean
}

export default function PostCard({ post, onUpvote, upvoted = false }: Props) {
  const router = useRouter()
  const color = CATEGORY_COLORS[post.category] ?? Colors.primary
  const timeAgo = getTimeAgo(post.created_at)
  const initial = (post.profiles?.name ?? 'U')[0].toUpperCase()
  const name = post.profiles?.name ?? 'Anonymous'

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/post/${post.id}`)}
    >
      {/* Left: Avatar column */}
      <View style={styles.avatarCol}>
        <View style={styles.avatar}>
          {post.profiles?.avatar_url
            ? <Image source={post.profiles.avatar_url} style={styles.avatarImg} contentFit="cover" cachePolicy="none" />
            : <Text style={styles.avatarText}>{initial}</Text>
          }
        </View>
        {/* Thread line below avatar */}
        <View style={styles.threadLine} />
      </View>

      {/* Right: Content */}
      <View style={styles.content}>
        {/* Name + time + category */}
        <View style={styles.headerRow}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{timeAgo}</Text>
          <View style={[styles.categoryDot, { backgroundColor: color }]} />
          <Text style={[styles.category, { color }]}>{CATEGORY_LABELS[post.category] ?? post.category}</Text>
        </View>

        <Text style={styles.body} numberOfLines={4}>{post.content}</Text>

        {/* Action row — X style */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={() => router.push(`/post/${post.id}`)}>
            <Ionicons name="chatbubble-outline" size={17} color={Colors.textSecondary} />
            <Text style={styles.actionText}>{post.comment_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={!upvoted ? onUpvote : undefined}>
            <Ionicons
              name={upvoted ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
              size={17}
              color={upvoted ? Colors.coral : Colors.textSecondary}
            />
            <Text style={[styles.actionText, upvoted && { color: Colors.coral }]}>{post.upvotes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  avatarCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 40,
    height: 40,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  threadLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginTop: 6,
    marginBottom: 0,
    minHeight: 20,
  },
  content: {
    flex: 1,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dot: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  time: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoryDot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
    marginLeft: 2,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
})
