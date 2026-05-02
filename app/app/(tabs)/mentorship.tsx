import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput, Alert, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import {
  useMentors, useMyRequests, useSendRequest, useMyMentorProfile,
  useBecomeMentor, useIncomingRequests, useRespondRequest, Mentor,
} from '../../hooks/useMentorship'
import { useAuthStore } from '../../store/authStore'
import { Colors, Radius } from '../../lib/design'

type Tab = 'discover' | 'requests'

const STATUS_COLOR: Record<string, string> = {
  pending: Colors.gold,
  accepted: Colors.mint,
  declined: Colors.coral,
}

export default function Mentorship() {
  const { data: mentors, isLoading } = useMentors()
  const { data: myRequests = [] } = useMyRequests()
  const { data: myMentorProfile } = useMyMentorProfile()
  const { mutate: sendRequest, isPending: sending } = useSendRequest()
  const { mutate: becomeMentor, isPending: registering } = useBecomeMentor()
  const { mutate: respond, isPending: responding } = useRespondRequest()
  const { data: incomingRequests = [] } = useIncomingRequests(myMentorProfile?.id)
  const user = useAuthStore((s) => s.user)

  const [tab, setTab] = useState<Tab>('discover')
  const [selected, setSelected] = useState<Mentor | null>(null)
  const [message, setMessage] = useState('')
  const [becomeModal, setBecomeModal] = useState(false)
  const [industry, setIndustry] = useState('')
  const [years, setYears] = useState('')
  const [skills, setSkills] = useState('')
  const [availability, setAvailability] = useState('')

  const requestedIds = myRequests.map((r) => r.mentor_id)
  const visibleMentors = (mentors ?? []).filter((m) => m.user_id !== user?.id)
  const pendingCount = incomingRequests.length

  function handleSendRequest() {
    if (!message.trim()) return Alert.alert('Add a message to your request')
    sendRequest({ mentorId: selected!.id, message: message.trim() }, {
      onSuccess: () => { setSelected(null); setMessage('') },
    })
  }

  function handleBecomeMentor() {
    if (!industry.trim() || !years.trim()) return Alert.alert('Fill in industry and years of experience')
    becomeMentor({
      industry: industry.trim(),
      experience_years: parseInt(years),
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      availability: availability.trim(),
    }, { onSuccess: () => setBecomeModal(false) })
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.heading}>Mentorship</Text>
        {!myMentorProfile && (
          <TouchableOpacity style={styles.becomeBtn} onPress={() => setBecomeModal(true)}>
            <Text style={styles.becomeBtnText}>Become a Mentor</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab switcher — only show Requests tab if user is a mentor */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'discover' && styles.tabBtnActive]}
          onPress={() => setTab('discover')}
        >
          <Text style={[styles.tabText, tab === 'discover' && styles.tabTextActive]}>Discover</Text>
        </TouchableOpacity>

        {myMentorProfile && (
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'requests' && styles.tabBtnActive]}
            onPress={() => setTab('requests')}
          >
            <Text style={[styles.tabText, tab === 'requests' && styles.tabTextActive]}>Requests</Text>
            {pendingCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'requests' && !myMentorProfile && styles.tabBtnActive]}
          onPress={() => setTab('requests')}
        >
          <Text style={[styles.tabText, tab === 'requests' && !myMentorProfile && styles.tabTextActive]}>
            My Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* DISCOVER TAB */}
      {tab === 'discover' && (
        isLoading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
        ) : (
          <FlatList
            data={visibleMentors}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="people-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.empty}>No mentors yet.</Text>
                <Text style={styles.emptySub}>Be the first to sign up as a mentor.</Text>
              </View>
            }
            renderItem={({ item }) => {
              const alreadyRequested = requestedIds.includes(item.id)
              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.avatar}>
                      {item.profiles?.avatar_url
                        ? <Image source={{ uri: item.profiles.avatar_url }} style={styles.avatarImg} />
                        : <Text style={styles.avatarText}>{(item.profiles?.name ?? 'M')[0].toUpperCase()}</Text>
                      }
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mentorName}>{item.profiles?.name ?? 'Mentor'}</Text>
                      <Text style={styles.industry}>{item.industry} · {item.experience_years}y exp</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.connectBtn, alreadyRequested && styles.connectBtnDone]}
                      onPress={() => !alreadyRequested && setSelected(item)}
                    >
                      <Text style={[styles.connectBtnText, alreadyRequested && { color: Colors.textSecondary }]}>
                        {alreadyRequested ? 'Requested' : 'Connect'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {item.profiles?.bio && <Text style={styles.bio} numberOfLines={2}>{item.profiles.bio}</Text>}
                  {item.skills?.length > 0 && (
                    <View style={styles.chips}>
                      {item.skills.slice(0, 4).map((s) => (
                        <Text key={s} style={styles.chip}>#{s}</Text>
                      ))}
                    </View>
                  )}
                  {item.availability && (
                    <View style={styles.availRow}>
                      <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                      <Text style={styles.availText}>{item.availability}</Text>
                    </View>
                  )}
                </View>
              )
            }}
          />
        )
      )}

      {/* REQUESTS TAB — mentor view: incoming requests to accept/decline */}
      {tab === 'requests' && myMentorProfile && (
        <FlatList
          data={incomingRequests}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="mail-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.empty}>No pending requests</Text>
              <Text style={styles.emptySub}>When someone requests your mentorship it'll appear here.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(item.profiles?.name ?? 'U')[0].toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mentorName}>{item.profiles?.name ?? 'Someone'}</Text>
                  <Text style={styles.requestTime}>
                    {new Date(item.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: STATUS_COLOR[item.status] + '22' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>{item.status}</Text>
                </View>
              </View>

              {item.message && (
                <Text style={styles.requestMessage}>"{item.message}"</Text>
              )}

              {item.status === 'pending' && (
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={() => respond({ requestId: item.id, status: 'declined' })}
                    disabled={responding}
                  >
                    <Text style={styles.declineBtnText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => respond({ requestId: item.id, status: 'accepted' })}
                    disabled={responding}
                  >
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* REQUESTS TAB — mentee view: outgoing requests status */}
      {tab === 'requests' && !myMentorProfile && (
        <FlatList
          data={myRequests}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="paper-plane-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.empty}>No requests sent yet</Text>
              <Text style={styles.emptySub}>Connect with a mentor from the Discover tab.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(item.mentors?.profiles?.name ?? 'M')[0].toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mentorName}>{item.mentors?.profiles?.name ?? 'Mentor'}</Text>
                  <Text style={styles.requestTime}>
                    {new Date(item.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: STATUS_COLOR[item.status] + '22' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>{item.status}</Text>
                </View>
              </View>
              {item.message && (
                <Text style={styles.requestMessage}>"{item.message}"</Text>
              )}
            </View>
          )}
        />
      )}

      {/* Connect Modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Request Mentorship</Text>
            <TouchableOpacity onPress={handleSendRequest} disabled={sending}>
              <Text style={styles.actionBtn}>{sending ? 'Sending...' : 'Send'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalSub}>
              Connecting with{' '}
              <Text style={{ fontFamily: 'Inter_700Bold', color: Colors.textPrimary }}>
                {selected?.profiles?.name}
              </Text>
            </Text>
            <Text style={styles.fieldLabel}>Your message</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Introduce yourself and explain what you're looking for..."
              placeholderTextColor={Colors.textMuted}
              multiline
              value={message}
              onChangeText={setMessage}
              autoFocus
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Become Mentor Modal */}
      <Modal visible={becomeModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setBecomeModal(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Become a Mentor</Text>
            <TouchableOpacity onPress={handleBecomeMentor} disabled={registering}>
              <Text style={styles.actionBtn}>{registering ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {[
              { label: 'Industry', value: industry, set: setIndustry, placeholder: 'e.g. Software Engineering' },
              { label: 'Years of Experience', value: years, set: setYears, placeholder: 'e.g. 5', keyboard: 'numeric' as const },
              { label: 'Skills (comma separated)', value: skills, set: setSkills, placeholder: 'e.g. React, Python, Leadership' },
              { label: 'Availability', value: availability, set: setAvailability, placeholder: 'e.g. Weekends, 1hr/week' },
            ].map((f) => (
              <View key={f.label} style={styles.field}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <TextInput
                  style={styles.input}
                  value={f.value}
                  onChangeText={f.set}
                  placeholder={f.placeholder}
                  keyboardType={f.keyboard}
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 20, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  becomeBtn: { borderWidth: 1, borderColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full },
  becomeBtnText: { color: Colors.primary, fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  // Tabs
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 13, gap: 6 },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  tabTextActive: { color: Colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  badge: { backgroundColor: Colors.coral, borderRadius: Radius.full, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#fff' },

  list: { paddingBottom: 24 },
  emptyWrap: { alignItems: 'center', marginTop: 60, gap: 8 },
  empty: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  emptySub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 40 },

  // Mentor card
  card: { borderBottomWidth: 1, borderBottomColor: Colors.border, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.cardAlt, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  avatarImg: { width: 44, height: 44, borderRadius: Radius.full },
  avatarText: { color: Colors.textPrimary, fontFamily: 'Inter_700Bold', fontSize: 16 },
  mentorName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  industry: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  connectBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full },
  connectBtnDone: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border },
  connectBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_700Bold' },
  bio: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, lineHeight: 20, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  chip: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.primary },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  availText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },

  // Request card
  requestCard: { borderBottomWidth: 1, borderBottomColor: Colors.border, padding: 16 },
  requestHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  requestTime: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  requestMessage: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, fontStyle: 'italic', lineHeight: 20, marginBottom: 14, paddingLeft: 4, borderLeftWidth: 2, borderLeftColor: Colors.border },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize' },
  requestActions: { flexDirection: 'row', gap: 10 },
  declineBtn: { flex: 1, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.coral + '66', alignItems: 'center' },
  declineBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.coral },
  acceptBtn: { flex: 2, paddingVertical: 10, borderRadius: Radius.md, backgroundColor: Colors.primary, alignItems: 'center' },
  acceptBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#fff' },

  // Modals
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 16, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  modalBody: { padding: 20 },
  modalSub: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginBottom: 20 },
  cancel: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  actionBtn: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.primary },
  textInput: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: 14, fontSize: 15, minHeight: 120, textAlignVertical: 'top', color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border, fontFamily: 'Inter_400Regular' },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  input: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: 14, fontSize: 15, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border, fontFamily: 'Inter_400Regular' },
})
