import { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput, Alert, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useMentors, useMyRequests, useSendRequest, useMyMentorProfile, useBecomeMentor, Mentor } from '../../hooks/useMentorship'
import { useAuthStore } from '../../store/authStore'
import { Colors, Radius } from '../../lib/design'

export default function Mentorship() {
  const { data: mentors, isLoading } = useMentors()
  const { data: myRequests = [] } = useMyRequests()
  const { data: myMentorProfile } = useMyMentorProfile()
  const { mutate: sendRequest, isPending: sending } = useSendRequest()
  const { mutate: becomeMentor, isPending: registering } = useBecomeMentor()
  const user = useAuthStore((s) => s.user)

  const [selected, setSelected] = useState<Mentor | null>(null)
  const [message, setMessage] = useState('')
  const [becomeModal, setBecomeModal] = useState(false)
  const [industry, setIndustry] = useState('')
  const [years, setYears] = useState('')
  const [skills, setSkills] = useState('')
  const [availability, setAvailability] = useState('')

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

  const requestedIds = myRequests.map((r) => r.mentor_id)
  const visibleMentors = (mentors ?? []).filter((m) => m.user_id !== user?.id)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Mentorship</Text>
        {!myMentorProfile && (
          <TouchableOpacity style={styles.becomeBtn} onPress={() => setBecomeModal(true)}>
            <Text style={styles.becomeBtnText}>Become a Mentor</Text>
          </TouchableOpacity>
        )}
      </View>

      {myRequests.length > 0 && (
        <View style={styles.requestsBar}>
          <Text style={styles.requestsLabel}>Your Requests</Text>
          {myRequests.map((r) => (
            <View key={r.id} style={styles.requestRow}>
              <Text style={styles.requestName}>{r.mentors?.profiles?.name ?? 'Mentor'}</Text>
              <View style={[
                styles.statusBadge,
                r.status === 'accepted' && styles.statusAccepted,
                r.status === 'declined' && styles.statusDeclined,
              ]}>
                <Text style={[
                  styles.statusText,
                  r.status === 'accepted' && { color: Colors.mint },
                  r.status === 'declined' && { color: Colors.coral },
                ]}>{r.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
      ) : (
        <FlatList
          data={visibleMentors}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.empty}>No mentors yet. Be the first to sign up.</Text>}
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
      )}

      {/* Request Modal */}
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
            <Text style={styles.modalSub}>Connecting with <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>{selected?.profiles?.name}</Text></Text>
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
          <View style={styles.modalBody}>
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
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  becomeBtn: { borderWidth: 1, borderColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full },
  becomeBtnText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  requestsBar: { borderBottomWidth: 1, borderBottomColor: Colors.border, padding: 16 },
  requestsLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  requestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  requestName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full, backgroundColor: Colors.cardAlt },
  statusAccepted: { backgroundColor: Colors.mint + '22' },
  statusDeclined: { backgroundColor: Colors.coral + '22' },
  statusText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textTransform: 'capitalize' },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 60, fontSize: 14 },
  card: { borderBottomWidth: 1, borderBottomColor: Colors.border, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.cardAlt, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  avatarImg: { width: 44, height: 44, borderRadius: Radius.full },
  avatarText: { color: Colors.textPrimary, fontWeight: '700', fontSize: 16 },
  mentorName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  industry: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  connectBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full },
  connectBtnDone: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border },
  connectBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  bio: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  chip: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  availText: { fontSize: 12, color: Colors.textSecondary },
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  modalBody: { padding: 20 },
  modalSub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  cancel: { fontSize: 15, color: Colors.textSecondary },
  actionBtn: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  textInput: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: 14, fontSize: 15, minHeight: 120, textAlignVertical: 'top', color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  input: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: 14, fontSize: 15, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
})
