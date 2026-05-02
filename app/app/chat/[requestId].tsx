import { useState, useRef, useEffect } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useMessages, useSendMessage } from '../../hooks/useMessages'
import { useAuthStore } from '../../store/authStore'
import { Colors, Radius } from '../../lib/design'

export default function ChatScreen() {
  const { requestId, name } = useLocalSearchParams<{ requestId: string; name: string }>()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const { data: messages = [] } = useMessages(requestId)
  const { mutate: send, isPending } = useSendMessage()
  const [text, setText] = useState('')
  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    if (messages.length) listRef.current?.scrollToEnd({ animated: true })
  }, [messages.length])

  function handleSend() {
    if (!text.trim() || isPending) return
    send({ requestId, content: text.trim() })
    setText('')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>{(name ?? 'M')[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.headerName}>{name}</Text>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="chatbubbles-outline" size={36} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Start the conversation</Text>
            </View>
          }
          renderItem={({ item }) => {
            const mine = item.sender_id === user?.id
            return (
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={[styles.bubbleText, mine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
                  {item.content}
                </Text>
                <Text style={[styles.bubbleTime, mine && { color: 'rgba(255,255,255,0.5)' }]}>
                  {new Date(item.created_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            )
          }}
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
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
  backBtn: { padding: 4 },
  headerAvatar: { width: 36, height: 36, borderRadius: Radius.full, backgroundColor: Colors.primary + '33', borderWidth: 1, borderColor: Colors.primary + '55', justifyContent: 'center', alignItems: 'center' },
  headerAvatarText: { color: Colors.primary, fontFamily: 'Inter_700Bold', fontSize: 14 },
  headerName: { fontSize: 16, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },

  list: { padding: 16, gap: 8, flexGrow: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 8 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textMuted },

  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, marginBottom: 4 },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { alignSelf: 'flex-start', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 21 },
  bubbleTextMine: { color: '#fff' },
  bubbleTextTheirs: { color: Colors.textPrimary },
  bubbleTime: { fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },

  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border, maxHeight: 100 },
  sendBtn: { width: 38, height: 38, borderRadius: Radius.full, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: Colors.textMuted },
})
