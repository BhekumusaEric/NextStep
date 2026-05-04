import { useRef, useState } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Animated, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius } from '../../lib/design'
import {
  useNotifications, useDeleteNotification,
  useMarkNotificationRead, useClearAllNotifications,
  AppNotification,
} from '../../hooks/useHuddles'
import { useMyRequests } from '../../hooks/useMentorship'

const TYPE_META: Record<string, { icon: string; color: string }> = {
  mentorship_accepted: { icon: 'checkmark-circle', color: Colors.mint },
  mentorship_declined: { icon: 'close-circle', color: Colors.coral },
  huddle_rsvp:         { icon: 'people', color: Colors.primary },
  huddle_live:         { icon: 'radio', color: Colors.coral },
  new_answer:          { icon: 'chatbubble', color: Colors.gold },
  new_comment:         { icon: 'chatbubbles', color: Colors.primary },
  pending:             { icon: 'time', color: Colors.gold },
}

function SwipeableRow({ item, onDelete, onRead }: {
  item: AppNotification
  onDelete: () => void
  onRead: () => void
}) {
  const translateX = useRef(new Animated.Value(0)).current
  const deleteWidth = 80

  function onSwipeLeft() {
    Animated.timing(translateX, {
      toValue: -deleteWidth,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  function onReset() {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start()
  }

  const meta = TYPE_META[item.type] ?? TYPE_META['pending']

  return (
    <View style={row.wrap}>
      {/* Delete action revealed on swipe */}
      <TouchableOpacity style={row.deleteAction} onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>

      <Animated.View style={[row.content, { transform: [{ translateX }] }]}>
        <TouchableOpacity
          style={[row.inner, !item.read && row.unread]}
          onPress={() => { onRead(); onReset() }}
          onLongPress={onSwipeLeft}
          delayLongPress={300}
          activeOpacity={0.7}
        >
          {!item.read && <View style={row.unreadDot} />}
          <View style={[row.iconWrap, { backgroundColor: meta.color + '18' }]}>
            <Ionicons name={meta.icon as any} size={18} color={meta.color} />
          </View>
          <View style={row.body}>
            <Text style={row.title}>{item.title}</Text>
            {item.body && <Text style={row.bodyText} numberOfLines={2}>{item.body}</Text>}
            <Text style={row.time}>
              {new Date(item.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <TouchableOpacity onPress={onSwipeLeft} hitSlop={12}>
            <Ionicons name="ellipsis-horizontal" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default function Notifications() {
  const { data: notifications = [] } = useNotifications()
  const { data: requests = [] } = useMyRequests()
  const { mutate: deleteNotif } = useDeleteNotification()
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: clearAll } = useClearAllNotifications()
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())

  const requestItems: AppNotification[] = requests.map((r) => ({
    id: r.id,
    user_id: r.mentee_id,
    type: r.status === 'accepted' ? 'mentorship_accepted' : r.status === 'declined' ? 'mentorship_declined' : 'pending',
    title: r.status === 'accepted'
      ? `${r.mentors?.profiles?.name ?? 'A mentor'} accepted your request`
      : r.status === 'declined'
      ? `${r.mentors?.profiles?.name ?? 'A mentor'} declined your request`
      : `Request to ${r.mentors?.profiles?.name ?? 'mentor'} is pending`,
    body: null,
    read: r.status !== 'pending',
    reference_id: r.id,
    created_at: r.created_at,
  }))

  const usingDB = notifications.length > 0
  const baseItems = usingDB ? notifications : requestItems
  const items = baseItems.filter((n) => !hiddenIds.has(n.id))
  const unreadCount = items.filter((n) => !n.read).length

  function handleDelete(id: string) {
    if (usingDB) deleteNotif(id)
    else setHiddenIds((prev) => new Set([...prev, id]))
  }

  function confirmClearAll() {
    Alert.alert('Clear all notifications?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all', style: 'destructive', onPress: () => {
          if (usingDB) clearAll()
          else setHiddenIds(new Set(baseItems.map((n) => n.id)))
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>
          Notifications
          {unreadCount > 0 && <Text style={styles.unreadCount}> {unreadCount}</Text>}
        </Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={confirmClearAll} hitSlop={8}>
            <Text style={styles.clearAll}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length > 0 && (
        <Text style={styles.hint}>Long press or tap ··· to delete</Text>
      )}

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={(
          <View style={styles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.empty}>No notifications yet</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SwipeableRow
            item={item}
            onDelete={() => handleDelete(item.id)}
            onRead={() => !item.read && markRead(item.id)}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 20, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  unreadCount: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.primary },
  clearAll: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textMuted },
  hint: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted, paddingHorizontal: 20, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  emptyWrap: { alignItems: 'center', marginTop: 80, gap: 12 },
  empty: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
})

const row = StyleSheet.create({
  wrap: { position: 'relative', borderBottomWidth: 1, borderBottomColor: Colors.border },
  deleteAction: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, backgroundColor: Colors.coral, justifyContent: 'center', alignItems: 'center' },
  content: { backgroundColor: Colors.background },
  inner: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  unread: { backgroundColor: Colors.primary + '08' },
  unreadDot: { position: 'absolute', left: 6, top: 20, width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  iconWrap: { width: 38, height: 38, borderRadius: Radius.full, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  body: { flex: 1 },
  title: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textPrimary, lineHeight: 20, marginBottom: 2 },
  bodyText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 18, marginBottom: 4 },
  time: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
})
