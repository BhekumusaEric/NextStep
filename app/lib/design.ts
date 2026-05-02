// NextStep Design System — "Dream in Motion"

export const Colors = {
  primary: '#6D5DF6',       // Future Purple
  coral: '#FF6B6B',         // Electric Coral
  mint: '#4ECDC4',          // Glow Mint
  gold: '#FFC857',          // Warm Gold
  background: '#000000',    // Pure black (X-style)
  card: '#0F0F0F',          // Near black card
  cardAlt: '#161616',       // Hover/alt card
  border: '#2F2F2F',        // X-style subtle border
  textPrimary: '#E7E9EA',   // X white
  textSecondary: '#71767B', // X muted grey
  textMuted: '#3E4144',     // Very muted
  success: '#4ECDC4',
  error: '#FF6B6B',
  warning: '#FFC857',
}

export const Gradients = {
  primary: ['#6D5DF6', '#4ECDC4'],
  coral: ['#FF6B6B', '#FFC857'],
  card: ['#1E293B', '#243044'],
  dark: ['#121826', '#1E293B'],
}

export const Typography = {
  // Sora for headlines, Inter for body
  heading1: { fontSize: 28, fontWeight: '700' as const, color: Colors.textPrimary, letterSpacing: -0.5 },
  heading2: { fontSize: 22, fontWeight: '700' as const, color: Colors.textPrimary },
  heading3: { fontSize: 18, fontWeight: '600' as const, color: Colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: Colors.textSecondary, lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '500' as const, color: Colors.textMuted },
  label: { fontSize: 11, fontWeight: '700' as const, color: Colors.textMuted, textTransform: 'uppercase' as const, letterSpacing: 0.8 },
}

export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
}

export const Radius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 999,
}

export const Shadow = {
  card: {
    shadowColor: '#6D5DF6',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  subtle: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
}

// Dynamic motivational greetings by time of day
export function getMotivationalGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning. Today might change everything.'
  if (hour < 17) return 'Someone out there needs your talent.'
  return 'One application can change your future.'
}

// Deadline countdown
export function getDaysLeft(deadline: string | null): { text: string; urgent: boolean } | null {
  if (!deadline) return null
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
  if (days < 0) return { text: 'Closed', urgent: true }
  if (days === 0) return { text: 'Last day!', urgent: true }
  if (days <= 7) return { text: `${days}d left`, urgent: true }
  return { text: `${days}d left`, urgent: false }
}
