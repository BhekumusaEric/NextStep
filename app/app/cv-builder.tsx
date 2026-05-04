import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { Colors, Radius } from '../lib/design'
import { useProfile } from '../hooks/useProfile'

interface ExpEntry { role: string; company: string; period: string; description: string }
interface EduEntry { institution: string; qualification: string; year: string }
interface CVData {
  name: string; email: string; phone: string; location: string; linkedin: string
  summary: string; skills: string
  experience: ExpEntry[]; education: EduEntry[]
}

const emptyExp = (): ExpEntry => ({ role: '', company: '', period: '', description: '' })
const emptyEdu = (): EduEntry => ({ institution: '', qualification: '', year: '' })

function buildCVHtml(data: CVData): string {
  const skillsList = data.skills.split(',').map((s) => `<span class="tag">${s.trim()}</span>`).join('')
  const expItems = data.experience.filter((e) => e.role).map((e) => `
    <div class="entry">
      <div class="entry-header"><strong>${e.role}</strong><span class="muted">${e.period}</span></div>
      <div class="company">${e.company}</div>
      <p>${e.description}</p>
    </div>`).join('')
  const eduItems = data.education.filter((e) => e.institution).map((e) => `
    <div class="entry">
      <div class="entry-header"><strong>${e.qualification}</strong><span class="muted">${e.year}</span></div>
      <div class="company">${e.institution}</div>
    </div>`).join('')

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;padding:40px;font-size:13px;line-height:1.6}
  h1{font-size:26px;font-weight:700}
  h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6D5DF6;border-bottom:1px solid #e5e5e5;padding-bottom:4px;margin:24px 0 12px}
  .contact{color:#555;font-size:12px;margin-top:4px}
  .entry{margin-bottom:14px}
  .entry-header{display:flex;justify-content:space-between}
  .company{color:#555;font-size:12px;margin-bottom:4px}
  .muted{color:#888;font-size:12px}
  .tags{display:flex;flex-wrap:wrap;gap:6px}
  .tag{background:#f0eeff;color:#6D5DF6;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
  p{color:#444;margin-top:4px}
</style></head><body>
  <h1>${data.name}</h1>
  <div class="contact">${[data.email, data.phone, data.location, data.linkedin].filter(Boolean).join(' · ')}</div>
  ${data.summary ? `<p style="margin-top:12px;color:#333">${data.summary}</p>` : ''}
  ${expItems ? `<h2>Experience</h2>${expItems}` : ''}
  ${eduItems ? `<h2>Education</h2>${eduItems}` : ''}
  ${data.skills ? `<h2>Skills</h2><div class="tags">${skillsList}</div>` : ''}
</body></html>`
}

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder: string; multiline?: boolean
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        multiline={multiline}
      />
    </View>
  )
}

export default function CVBuilder() {
  const router = useRouter()
  const { data: profile } = useProfile()
  const [exporting, setExporting] = useState(false)

  const [cv, setCv] = useState<CVData>({
    name: profile?.name ?? '',
    email: '',
    phone: '',
    location: '',
    linkedin: profile?.linkedin_url ?? '',
    summary: profile?.bio ?? '',
    skills: (profile?.skills ?? []).join(', '),
    experience: [emptyExp()],
    education: [emptyEdu()],
  })

  function set(key: keyof CVData, value: string) {
    setCv((p) => ({ ...p, [key]: value }))
  }
  function setExp(i: number, key: keyof ExpEntry, value: string) {
    setCv((p) => { const e = [...p.experience]; e[i] = { ...e[i], [key]: value }; return { ...p, experience: e } })
  }
  function setEdu(i: number, key: keyof EduEntry, value: string) {
    setCv((p) => { const e = [...p.education]; e[i] = { ...e[i], [key]: value }; return { ...p, education: e } })
  }

  async function handleExport() {
    if (!cv.name.trim()) return Alert.alert('Add your name before exporting')
    setExporting(true)
    try {
      const { uri } = await Print.printToFileAsync({ html: buildCVHtml(cv), base64: false })
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share your CV' })
    } catch {
      Alert.alert('Export failed', 'Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.heading}>CV Builder</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport} disabled={exporting}>
          {exporting
            ? <ActivityIndicator size="small" color="#fff" />
            : <><Ionicons name="share-outline" size={15} color="#fff" /><Text style={styles.exportText}>Export PDF</Text></>
          }
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>Personal Info</Text>
        <View style={styles.section}>
          <Field label="Full Name" value={cv.name} onChange={(v) => set('name', v)} placeholder="Your full name" />
          <Field label="Email" value={cv.email} onChange={(v) => set('email', v)} placeholder="your@email.com" />
          <Field label="Phone" value={cv.phone} onChange={(v) => set('phone', v)} placeholder="+27 ..." />
          <Field label="Location" value={cv.location} onChange={(v) => set('location', v)} placeholder="City, Province" />
          <Field label="LinkedIn" value={cv.linkedin} onChange={(v) => set('linkedin', v)} placeholder="linkedin.com/in/yourname" />
        </View>

        <Text style={styles.sectionLabel}>Professional Summary</Text>
        <View style={styles.section}>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={cv.summary}
            onChangeText={(v) => set('summary', v)}
            placeholder="A short paragraph about who you are and what you bring..."
            placeholderTextColor={Colors.textMuted}
            multiline
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Experience</Text>
          <TouchableOpacity onPress={() => setCv((p) => ({ ...p, experience: [...p.experience, emptyExp()] }))} hitSlop={8}>
            <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        {cv.experience.map((e, i) => (
          <View key={i} style={styles.section}>
            <Field label="Job Title" value={e.role} onChange={(v) => setExp(i, 'role', v)} placeholder="e.g. Junior Developer" />
            <Field label="Company" value={e.company} onChange={(v) => setExp(i, 'company', v)} placeholder="e.g. Capitec Bank" />
            <Field label="Period" value={e.period} onChange={(v) => setExp(i, 'period', v)} placeholder="Jan 2024 – Present" />
            <Field label="Description" value={e.description} onChange={(v) => setExp(i, 'description', v)} placeholder="What did you do and achieve?" multiline />
          </View>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Education</Text>
          <TouchableOpacity onPress={() => setCv((p) => ({ ...p, education: [...p.education, emptyEdu()] }))} hitSlop={8}>
            <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        {cv.education.map((e, i) => (
          <View key={i} style={styles.section}>
            <Field label="Institution" value={e.institution} onChange={(v) => setEdu(i, 'institution', v)} placeholder="e.g. University of Johannesburg" />
            <Field label="Qualification" value={e.qualification} onChange={(v) => setEdu(i, 'qualification', v)} placeholder="e.g. BSc Computer Science" />
            <Field label="Year" value={e.year} onChange={(v) => setEdu(i, 'year', v)} placeholder="2022 – 2025" />
          </View>
        ))}

        <Text style={styles.sectionLabel}>Skills</Text>
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            value={cv.skills}
            onChangeText={(v) => set('skills', v)}
            placeholder="Python, SQL, React, Communication..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  heading: { fontSize: 17, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full },
  exportText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 13 },
  content: { paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  section: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card, paddingHorizontal: 16, paddingVertical: 4 },
  field: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  fieldLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, paddingVertical: 2 },
  inputMulti: { minHeight: 72, textAlignVertical: 'top' },
})
