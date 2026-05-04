import { useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Image, ImageContentFit } from 'expo-image'
import { Colors, Radius } from '../lib/design'

interface Props {
  uri: string | null | undefined
  style?: any
  contentFit?: ImageContentFit
  fallbackText?: string        // letter to show when image fails
  fallbackBg?: string
  isLogo?: boolean             // logos use white bg + force-cache
  isAvatar?: boolean           // avatars use memory-disk cache
  showLoader?: boolean
}

export default function AppImage({
  uri,
  style,
  contentFit = 'cover',
  fallbackText,
  fallbackBg,
  isLogo = false,
  isAvatar = false,
  showLoader = false,
}: Props) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Pick the right cache policy:
  // - logos: force-cache (Clearbit logos rarely change)
  // - avatars/supabase: memory-disk (balance freshness + performance)
  // - hero images: disk (large, rarely change)
  const cachePolicy = isLogo ? 'force-cache' : isAvatar ? 'memory-disk' : 'disk'

  if (!uri || error) {
    return (
      <View style={[styles.fallback, { backgroundColor: fallbackBg ?? (isLogo ? '#fff' : Colors.cardAlt) }, style]}>
        {fallbackText ? (
          <Text style={[styles.fallbackText, isLogo && { color: Colors.textMuted }]}>
            {fallbackText.charAt(0).toUpperCase()}
          </Text>
        ) : (
          <Text style={styles.fallbackIcon}>📷</Text>
        )}
      </View>
    )
  }

  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        contentFit={contentFit}
        cachePolicy={cachePolicy}
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false) }}
        // Transition makes images feel smooth when they load
        transition={200}
      />
      {showLoader && loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardAlt,
  },
  fallbackText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
  },
  fallbackIcon: {
    fontSize: 16,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardAlt,
  },
})
