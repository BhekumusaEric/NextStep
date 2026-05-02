import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { useProfile } from '../../hooks/useProfile'
import { useSavedOpportunities } from '../../hooks/useOpportunities'
import { Colors, Radius } from '../../lib/design'

export default function Profile() {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const { data: profile } = useProfile()
  const { data: saved = [] } = useSavedOpportunities()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.heading}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/edit-profile')} hitSlop={8}>
            <Ionicons name="create-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Avatar + name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{(profile?.name ?? user?.email ?? 'U')[0].toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{profile?.name ?? 'Your Name'}</Text>
          {profile?.university && <Text style={styles.uni}>{profile.university}</Text>}
          {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          <TouchableOpacity style={styles.savedRow} onPress={() => router.push('/saved')}>
            <Text style={styles.savedNum}>{saved.length}</Text>
            <Text style={styles.savedLabel}> saved opportunities</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Links */}
        {(profile?.github_url || profile?.linkedin_url) && (
          <View style={styles.section}>
            {profile?.github_url && (
              <View style={styles.linkRow}>
                <Ionicons name="logo-github" size={16} color={Colors.textSecondary} />
                <Text style={styles.linkText}>{profile.github_url}</Text>
              </View>
            )}
            {profile?.linkedin_url && (
              <View style={styles.linkRow}>
                <Ionicons name="logo-linkedin" size={16} color={Colors.primary} />
                <Text style={styles.linkText}>{profile.linkedin_url}</Text>
              </View>
            )}
          </View>
        )}

        {(profile?.skills?.length ?? 0) > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.chips}>
              {profile!.skills.map((s) => (
                <Text key={s} style={styles.chip}>#{s}</Text>
              ))}
            </View>
          </View>
        )}

        {(profile?.career_interests?.length ?? 0) > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.chips}>
              {profile!.career_interests.map((i) => (
                <Text key={i} style={[styles.chip, { color: Colors.mint }]}>#{i}</Text>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.signOutBtn} onPress={() => supabase.auth.signOut()}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 20, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  profileHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: Radius.full },
  avatarFallback: { width: 72, height: 72, borderRadius: Radius.full, backgroundColor: Colors.cardAlt, borderWidth: 2, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.primary, fontSize: 26, fontWeight: '700' },
  name: { fontSize: 20, fontFamily: 'Sora_700Bold', color: Colors.textPrimary, marginBottom: 2 },
  uni: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginBottom: 6 },
  bio: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, lineHeight: 20, marginBottom: 12 },
  savedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  savedNum: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  savedLabel: { fontSize: 14, color: Colors.textSecondary },
  section: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  linkText: { fontSize: 13, color: Colors.textSecondary },
  signOutBtn: { margin: 20, padding: 14, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.coral + '44', alignItems: 'center' },
  signOutText: { color: Colors.coral, fontWeight: '600', fontSize: 14 },
})
