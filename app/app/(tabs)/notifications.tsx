import { View, Text, FlatList, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useMyRequests } from '../../hooks/useMentorship'
import { Colors } from '../../lib/design'

const STATUS_COLOR: Record<string, string> = {
  pending: Colors.gold,
  accepted: Colors.mint,
  declined: Colors.coral,
}

export default function Notifications() {
  const { data: requests = [] } = useMyRequests()

  const items = requests.map((r) => ({
    id: r.id,
    icon: r.status === 'accepted' ? 'checkmark-circle' : r.status === 'declined' ? 'close-circle' : 'time',
    color: STATUS_COLOR[r.status],
    title: r.status === 'accepted'
      ? `${r.mentors?.profiles?.name ?? 'A mentor'} accepted your request`
      : r.status === 'declined'
      ? `${r.mentors?.profiles?.name ?? 'A mentor'} declined your request`
      : `Request to ${r.mentors?.profiles?.name ?? 'mentor'} is pending`,
    time: new Date(r.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }),
  }))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Notifications</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={(
          <View style={styles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.empty}>No notifications yet</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={[styles.iconWrap, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  list: { paddingBottom: 24 },
  emptyWrap: { alignItems: 'center', marginTop: 80, gap: 12 },
  empty: { fontSize: 14, color: Colors.textMuted },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  itemTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500', lineHeight: 20 },
  itemTime: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
})
