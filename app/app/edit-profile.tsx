import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useProfile, useUpdateProfile, useUploadAvatar } from '../hooks/useProfile'
import { Colors, Radius } from '../lib/design'

export default function EditProfile() {
  const router = useRouter()
  const { data: profile } = useProfile()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const { mutate: uploadAvatar, isPending: uploading } = useUploadAvatar()

  const [name, setName] = useState('')
  const [university, setUniversity] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [interests, setInterests] = useState('')
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')

  useEffect(() => {
    if (!profile) return
    setName(profile.name ?? '')
    setUniversity(profile.university ?? '')
    setBio(profile.bio ?? '')
    setSkills(profile.skills?.join(', ') ?? '')
    setInterests(profile.career_interests?.join(', ') ?? '')
    setGithub(profile.github_url ?? '')
    setLinkedin(profile.linkedin_url ?? '')
  }, [profile])

  const [localAvatar, setLocalAvatar] = useState<string | null>(null)

  async function pickAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 })
    if (!result.canceled) {
      const uri = result.assets[0].uri
      setLocalAvatar(uri)
      uploadAvatar(uri, {
        onSuccess: () => setLocalAvatar(null), // clear so profile.avatar_url takes over
      })
    }
  }

  function handleSave() {
    updateProfile({
      name: name.trim(),
      university: university.trim(),
      bio: bio.trim(),
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      career_interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
      github_url: github.trim(),
      linkedin_url: linkedin.trim(),
    }, { onSuccess: () => router.back() })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isPending}>
          <Text style={styles.saveBtn}>{isPending ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar} disabled={uploading}>
            {localAvatar ? (
              <Image source={localAvatar} style={styles.avatar} contentFit="cover" />
            ) : profile?.avatar_url ? (
              <Image source={profile.avatar_url} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{(name || 'U')[0].toUpperCase()}</Text>
              </View>
            )}
            {uploading ? (
              <ActivityIndicator style={styles.avatarOverlay} color="#fff" />
            ) : (
              <View style={styles.avatarOverlay}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {[
            { label: 'Full Name', value: name, set: setName, placeholder: 'Your full name' },
            { label: 'University / Institution', value: university, set: setUniversity, placeholder: 'e.g. University of Cape Town' },
            { label: 'Bio', value: bio, set: setBio, placeholder: 'Tell people about yourself', multiline: true },
            { label: 'Skills (comma separated)', value: skills, set: setSkills, placeholder: 'e.g. Python, React, SQL' },
            { label: 'Career Interests (comma separated)', value: interests, set: setInterests, placeholder: 'e.g. Data, Product, Finance' },
            { label: 'GitHub URL', value: github, set: setGithub, placeholder: 'https://github.com/username' },
            { label: 'LinkedIn URL', value: linkedin, set: setLinkedin, placeholder: 'https://linkedin.com/in/username' },
          ].map((field) => (
            <View key={field.label} style={styles.field}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={[styles.input, field.multiline && styles.inputMulti]}
                value={field.value}
                onChangeText={field.set}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.textMuted}
                multiline={field.multiline}
                autoCapitalize="none"
              />
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  saveBtn: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  content: { padding: 20, paddingBottom: 40 },
  avatarWrap: { alignSelf: 'center', marginBottom: 28, position: 'relative', width: 80, height: 80 },
  avatar: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden' },
  avatarFallback: { width: 80, height: 80, borderRadius: Radius.full, backgroundColor: Colors.cardAlt, borderWidth: 2, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.primary, fontSize: 28, fontWeight: '700' },
  avatarOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primary, borderRadius: 12, padding: 5 },
  field: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  input: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: 14, fontSize: 15, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
  inputMulti: { minHeight: 90, textAlignVertical: 'top' },
})
