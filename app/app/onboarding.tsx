import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useUpdateProfile } from '../hooks/useProfile'
import { Colors, Radius } from '../lib/design'

const INTERESTS = ['Tech', 'Data', 'Finance', 'Consulting', 'Design', 'Engineering', 'Marketing', 'Law', 'Healthcare', 'Education']
const SKILLS = ['Python', 'JavaScript', 'React', 'SQL', 'Excel', 'Java', 'Communication', 'Leadership', 'Project Management', 'UI/UX']
const STEPS = ['Welcome', 'About You', 'Interests', 'Skills']

export default function Onboarding() {
  const router = useRouter()
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [university, setUniversity] = useState('')
  const [bio, setBio] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  function toggleItem(item: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  function handleNext() {
    if (step === 1 && !name.trim()) return Alert.alert('Please enter your name')
    if (step < STEPS.length - 1) { setStep(step + 1); return }
    updateProfile({
      name: name.trim(),
      university: university.trim(),
      bio: bio.trim(),
      career_interests: selectedInterests,
      skills: selectedSkills,
    }, { onSuccess: () => router.replace('/(tabs)/home') })
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressRow}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.progressBar, i <= step && styles.progressBarActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={styles.welcomeBlock}>
            <Text style={styles.emoji}>🚀</Text>
            <Text style={styles.title}>Welcome to NextStep</Text>
            <Text style={styles.subtitle}>Your career growth starts here. Let's set up your profile so we can personalise your experience.</Text>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.title}>About You</Text>
            <Text style={styles.subtitle}>Tell the community who you are.</Text>
            {[
              { label: 'Full Name *', value: name, set: setName, placeholder: 'Your full name' },
              { label: 'University / Institution', value: university, set: setUniversity, placeholder: 'e.g. University of Johannesburg' },
              { label: 'Bio', value: bio, set: setBio, placeholder: 'A short intro about yourself', multiline: true },
            ].map((f) => (
              <View key={f.label} style={styles.field}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  style={[styles.input, f.multiline && styles.inputMulti]}
                  value={f.value}
                  onChangeText={f.set}
                  placeholder={f.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  multiline={f.multiline}
                />
              </View>
            ))}
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.title}>Career Interests</Text>
            <Text style={styles.subtitle}>Pick the fields you're interested in.</Text>
            <View style={styles.chips}>
              {INTERESTS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, selectedInterests.includes(item) && styles.chipActive]}
                  onPress={() => toggleItem(item, selectedInterests, setSelectedInterests)}
                >
                  <Text style={[styles.chipText, selectedInterests.includes(item) && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.title}>Your Skills</Text>
            <Text style={styles.subtitle}>Select skills you have or are building.</Text>
            <View style={styles.chips}>
              {SKILLS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, selectedSkills.includes(item) && styles.chipActive]}
                  onPress={() => toggleItem(item, selectedSkills, setSelectedSkills)}
                >
                  <Text style={[styles.chipText, selectedSkills.includes(item) && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} disabled={isPending}>
          <Text style={styles.nextText}>
            {step === STEPS.length - 1 ? (isPending ? 'Saving...' : 'Finish') : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  progressRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  progressBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: Colors.border },
  progressBarActive: { backgroundColor: Colors.primary },
  content: { padding: 24, paddingBottom: 40 },
  welcomeBlock: { alignItems: 'center', paddingTop: 40 },
  emoji: { fontSize: 56, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 28 },
  field: { marginBottom: 18 },
  label: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 14, fontSize: 15, color: Colors.textPrimary, backgroundColor: Colors.card },
  inputMulti: { minHeight: 90, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  footer: { flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: Colors.border },
  backBtn: { flex: 1, padding: 15, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  backText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  nextBtn: { flex: 2, padding: 15, borderRadius: Radius.md, backgroundColor: Colors.primary, alignItems: 'center' },
  nextText: { fontSize: 15, fontWeight: '700', color: '#fff' },
})
