import { useState } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSearch } from '../hooks/useSearch'
import OpportunityCard from '../components/OpportunityCard'
import PostCard from '../components/PostCard'
import { useSavedOpportunities, useToggleSave } from '../hooks/useOpportunities'
import { useUpvote, useUpvotedPosts } from '../hooks/usePosts'
import { Colors, Radius } from '../lib/design'

export default function Search() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { data, isLoading } = useSearch(query)
  const { data: saved = [] } = useSavedOpportunities()
  const { mutate: toggleSave } = useToggleSave()
  const { mutate: upvote } = useUpvote()
  const { data: upvoted = [] } = useUpvotedPosts()

  const hasResults = (data?.opportunities.length ?? 0) + (data?.posts.length ?? 0) > 0

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search opportunities, posts..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading && <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />}

      {!isLoading && query.length > 1 && !hasResults && (
        <Text style={styles.empty}>No results for "{query}"</Text>
      )}

      {!isLoading && hasResults && (
        <FlatList
          data={[
            ...(data!.opportunities.length > 0 ? [{ type: 'header', label: 'Opportunities' }] : []),
            ...data!.opportunities.map((o) => ({ type: 'opportunity', data: o })),
            ...(data!.posts.length > 0 ? [{ type: 'header', label: 'Posts' }] : []),
            ...data!.posts.map((p) => ({ type: 'post', data: p })),
          ]}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: any) => {
            if (item.type === 'header') return <Text style={styles.sectionHeader}>{item.label}</Text>
            if (item.type === 'opportunity') return (
              <OpportunityCard
                opportunity={item.data}
                saved={saved.includes(item.data.id)}
                onToggleSave={() => toggleSave({ opportunityId: item.data.id, saved: saved.includes(item.data.id) })}
              />
            )
            return <PostCard post={item.data} upvoted={upvoted.includes(item.data.id)} onUpvote={() => upvote(item.data.id)} />
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.card, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: Colors.border },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  list: { paddingBottom: 24 },
  sectionHeader: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 16, paddingVertical: 12 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 60, fontSize: 14 },
})
