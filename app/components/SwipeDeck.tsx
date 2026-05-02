import { useRef, useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  PanResponder, Dimensions, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Opportunity } from '../lib/types'
import { Colors, Radius, getDaysLeft } from '../lib/design'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3
const CARD_WIDTH = SCREEN_WIDTH - 40
const CARD_HEIGHT = SCREEN_HEIGHT * 0.58

const TYPE_COLORS: Record<string, string> = {
  internship: Colors.primary,
  learnership: Colors.mint,
  graduate: Colors.coral,
  scholarship: Colors.gold,
  event: '#A78BFA',
  bootcamp: '#34D399',
}

interface Props {
  opportunities: Opportunity[]
  saved: string[]
  skipped: string[]
  onSave: (id: string) => void
  onSkip: (id: string) => void
  onBrowseAll: () => void
}

export default function SwipeDeck({ opportunities, saved, skipped, onSave, onSkip, onBrowseAll }: Props) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const position = useRef(new Animated.ValueXY()).current

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  })

  const saveOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  const skipOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeOut('right')
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeOut('left')
        } else {
          resetPosition()
        }
      },
    })
  ).current

  function swipeOut(direction: 'left' | 'right') {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 280,
      useNativeDriver: false,
    }).start(() => {
      const current = opportunities[index]
      if (direction === 'right') onSave(current.id)
      else onSkip(current.id)
      position.setValue({ x: 0, y: 0 })
      setIndex((i) => i + 1)
    })
  }

  function resetPosition() {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start()
  }

  if (index >= opportunities.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🎉</Text>
        <Text style={styles.emptyTitle}>You've seen everything</Text>
        <Text style={styles.emptySub}>Check back later for new opportunities</Text>
        {skipped.length > 0 && (
          <TouchableOpacity style={styles.browseBtn} onPress={onBrowseAll}>
            <Ionicons name="list-outline" size={16} color="#fff" />
            <Text style={styles.browseBtnText}>Browse {skipped.length} skipped</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.browseBtnOutline} onPress={onBrowseAll}>
          <Text style={styles.browseBtnOutlineText}>Browse all opportunities</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Render up to 3 stacked cards, back to front */}
      {[2, 1, 0].map((offset) => {
        const cardIndex = index + offset
        if (cardIndex >= opportunities.length) return null
        const opp = opportunities[cardIndex]

        if (offset !== 0) {
          return (
            <View
              key={opp.id}
              style={[
                styles.card,
                {
                  top: offset * 10,
                  transform: [{ scale: 1 - offset * 0.04 }],
                  zIndex: -offset,
                  opacity: 1 - offset * 0.15,
                },
              ]}
            >
              <CardContent opportunity={opp} saved={saved.includes(opp.id)} router={router} />
            </View>
          )
        }

        // Top card — animated
        return (
          <Animated.View
            key={opp.id}
            style={[
              styles.card,
              { zIndex: 10, transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] },
            ]}
            {...panResponder.panHandlers}
          >
            {/* SAVE label */}
            <Animated.View style={[styles.swipeLabel, styles.saveLabelWrap, { opacity: saveOpacity }]}>
              <Text style={[styles.swipeLabelText, { color: Colors.mint }]}>SAVE</Text>
            </Animated.View>

            {/* SKIP label */}
            <Animated.View style={[styles.swipeLabel, styles.skipLabelWrap, { opacity: skipOpacity }]}>
              <Text style={[styles.swipeLabelText, { color: Colors.coral }]}>SKIP</Text>
            </Animated.View>

            <CardContent opportunity={opp} saved={saved.includes(opp.id)} router={router} />
          </Animated.View>
        )
      })}

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.skipBtn]} onPress={() => swipeOut('left')}>
          <Ionicons name="close" size={28} color={Colors.coral} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => router.push(`/opportunity/${opportunities[index].id}`)}
        >
          <Text style={styles.viewBtnText}>View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={() => swipeOut('right')}>
          <Ionicons name="bookmark" size={24} color={Colors.mint} />
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>← skip · save →</Text>
    </View>
  )
}

function CardContent({ opportunity, saved, router }: { opportunity: Opportunity; saved: boolean; router: any }) {
  const color = TYPE_COLORS[opportunity.type] ?? Colors.primary
  const countdown = getDaysLeft(opportunity.deadline)

  return (
    <View style={styles.cardInner}>
      {/* Colored top bar */}
      <View style={[styles.cardTopBar, { backgroundColor: color }]} />

      <View style={styles.cardBody}>
        <View style={styles.topRow}>
          <Text style={[styles.typeLabel, { color }]}>{opportunity.type.toUpperCase()}</Text>
          {countdown && (
            <Text style={[styles.countdown, countdown.urgent && { color: Colors.coral }]}>
              {countdown.urgent ? '⚡ ' : ''}{countdown.text}
            </Text>
          )}
        </View>

        <Text style={styles.title}>{opportunity.title}</Text>
        <Text style={styles.org}>{opportunity.organization}</Text>

        {opportunity.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{opportunity.location}</Text>
          </View>
        )}

        {opportunity.eligibility && (
          <Text style={styles.eligibility} numberOfLines={2}>{opportunity.eligibility}</Text>
        )}

        {opportunity.tags?.length > 0 && (
          <View style={styles.tags}>
            {opportunity.tags.slice(0, 4).map((tag) => (
              <Text key={tag} style={styles.tag}>#{tag}</Text>
            ))}
          </View>
        )}

        {saved && (
          <View style={styles.savedBadge}>
            <Ionicons name="bookmark" size={12} color={Colors.gold} />
            <Text style={styles.savedBadgeText}>Saved</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  cardTopBar: {
    height: 4,
    width: '100%',
  },
  cardInner: {
    flex: 1,
  },
  cardBody: {
    padding: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  countdown: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 30,
    marginBottom: 8,
  },
  org: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  eligibility: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  tag: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 16,
  },
  savedBadgeText: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '600',
  },
  swipeLabel: {
    position: 'absolute',
    top: 24,
    zIndex: 20,
    borderWidth: 3,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  saveLabelWrap: {
    right: 24,
    borderColor: Colors.mint,
    transform: [{ rotate: '15deg' }],
  },
  skipLabelWrap: {
    left: 24,
    borderColor: Colors.coral,
    transform: [{ rotate: '-15deg' }],
  },
  swipeLabelText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  actions: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  skipBtn: {
    backgroundColor: Colors.card,
    borderColor: Colors.coral + '66',
  },
  saveBtn: {
    backgroundColor: Colors.card,
    borderColor: Colors.mint + '66',
  },
  viewBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: Radius.full,
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  hint: {
    position: 'absolute',
    bottom: 6,
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptySub: { fontSize: 14, color: Colors.textSecondary },
  browseBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 13, borderRadius: Radius.full, marginTop: 8 },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  browseBtnOutline: { paddingVertical: 10, marginTop: 4 },
  browseBtnOutlineText: { fontSize: 13, color: Colors.textSecondary },
})
