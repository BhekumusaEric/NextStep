import { useState, useRef, useEffect } from 'react'
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../store/authStore'
import { useHuddleMessages, useSendHuddleMessage, useDeleteHuddleMessage, useEndHuddle } from '../../hooks/useHuddles'
import { Colors, Radius } from '../../lib/design'

export default function HuddleRoom() {
  const { huddleId, title, hostId } = useLocalSearchParams<{ huddleId: string; title: string; hostId: string }>()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const { data: messages = [] } = useHuddleMessages(huddleId)
  const { mutate: send, isPending } = useSendHuddleMessage()
  const { mutate: deleteMsg } = useDeleteHuddleMessage()
  const { mutate: end } = useEndHuddle()
  const [text, setText] = useState('')
  const listRef = useRef<FlatList>(null)
  const isHost = user?.id === hostId

  useEffect(() => {
    if (messages.length) listRef.current?.scrollToEnd({ animated: true })
  }, [messages.length])

  function handleSend() {
    if (!text.trim() || isPending) return
    send({ huddleId, content: text.trim() })
    setText('')
  }

  function confirmDelete(messageId: string) {
    Alert.alert('Delete message?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMsg({ messageId, huddleId }) },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.liveDot} />
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        </View>
        {isHost && (
          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => Alert.alert('End huddle?', 'This closes the room for everyone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'End', style: 'destructive', onPress: () => { end(huddleId); router.back() } },
            ])}
          >
            <Text style={styles.endBtnText}>End</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={(
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>👋</Text>
              <Text style={styles.emptyTitle}>The room is open</Text>
              <Text style={styles.emptySub}>Be the first to say something.</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const mine = item.user_id === user?.id
            const canDelete = mine || isHost
            return (
              <TouchableOpacity
                onLongPress={() => canDelete && confirmDelete(item.id)}
                activeOpacity={0.85}
                style={[styles.msgRow, mine && styles.msgRowMine]}
              >
                {!mine && (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{(item.profiles?.name ?? 'U')[0].toUpperCase()}</Text>
                  </View>
                )}
                <View style={[
                  styles.bubble,
                  mine ? styles.bubbleMine : styles.bubbleTheirs,
                  item.is_pinned && styles.bubblePinned,
                ]}>
                  {!mine && <Text style={styles.senderName}>{item.profiles?.name ?? 'Member'}</Text>}
                  {item.is_pinned && (
                    <View style={styles.pinnedRow}>
                      <Ionicons name="pin" size={10} color={Colors.gold} />
                      <Text style={styles.pinnedLabel}>Pinned</Text>
                    </View>
                  )}
                  <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{item.content}</Text>
                  <Text style={[styles.bubbleTime, mine && { color: 'rgba(255,255,255,0.45)' }]}>
                    {new Date(item.created_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Say something..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && styles.sendBtnOff]}
            onPress={handleSend}
            disabled={!text.trim() || isPending}
          >
            <Ionicons name="arrow-up" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.coral },
  headerTitle: { fontSize: 15, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary, flex: 1 },
  endBtn: { backgroundColor: Colors.coral + '22', paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.coral + '55' },
  endBtnText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.coral },
  list: { padding: 16, gap: 12, flexGrow: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 8 },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 16, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary },
  emptySub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowMine: { flexDirection: 'row-reverse' },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.cardAlt, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  avatarText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  bubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMine: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 4 },
  bubblePinned: { borderWidth: 1, borderColor: Colors.gold + '55' },
  senderName: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.primary, marginBottom: 3 },
  pinnedRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  pinnedLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: Colors.gold },
  bubbleText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, lineHeight: 20 },
  bubbleTextMine: { color: '#fff' },
  bubbleTime: { fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border, maxHeight: 100 },
  sendBtn: { width: 38, height: 38, borderRadius: Radius.full, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnOff: { backgroundColor: Colors.textMuted },
})
