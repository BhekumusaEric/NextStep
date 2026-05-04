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
  heading1: { fontSize: 28, fontFamily: 'Sora_700Bold', color: Colors.textPrimary, letterSpacing: -0.5 },
  heading2: { fontSize: 22, fontFamily: 'Sora_700Bold', color: Colors.textPrimary },
  heading3: { fontSize: 18, fontFamily: 'Sora_600SemiBold', color: Colors.textPrimary },
  body: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  caption: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textMuted },
  label: { fontSize: 11, fontFamily: 'Inter_700Bold', color: Colors.textMuted, textTransform: 'uppercase' as const, letterSpacing: 0.8 },
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

// Company domain map for logo lookups
const ORG_DOMAINS: Record<string, string> = {
  'capitec bank': 'capitecbank.co.za',
  'capitec': 'capitecbank.co.za',
  'standard bank': 'standardbank.co.za',
  'standard bank group': 'standardbank.co.za',
  'absa': 'absa.co.za',
  'absa group': 'absa.co.za',
  'nedbank': 'nedbank.co.za',
  'fnb': 'fnb.co.za',
  'investec': 'investec.com',
  'discovery health': 'discovery.co.za',
  'old mutual': 'oldmutual.co.za',
  'vodacom': 'vodacom.co.za',
  'mtn south africa': 'mtn.co.za',
  'mtn': 'mtn.co.za',
  'telkom': 'telkom.co.za',
  'liquid intelligent technologies': 'liquid.tech',
  'amazon web services': 'aws.amazon.com',
  'amazon (aws)': 'aws.amazon.com',
  'aws': 'aws.amazon.com',
  'google': 'google.com',
  'google south africa': 'google.com',
  'google / coursera': 'google.com',
  'google dsc': 'google.com',
  'microsoft': 'microsoft.com',
  'microsoft africa': 'microsoft.com',
  'deloitte': 'deloitte.com',
  'deloitte south africa': 'deloitte.com',
  'pwc': 'pwc.com',
  'pwc south africa': 'pwc.com',
  'kpmg': 'kpmg.com',
  'ey': 'ey.com',
  'mckinsey & company': 'mckinsey.com',
  'accenture': 'accenture.com',
  'accenture south africa': 'accenture.com',
  'sap': 'sap.com',
  'ibm': 'ibm.com',
  'oracle': 'oracle.com',
  'salesforce': 'salesforce.com',
  'takealot group': 'takealot.com',
  'takealot': 'takealot.com',
  'naspers / prosus': 'prosus.com',
  'prosus': 'prosus.com',
  'naspers': 'naspers.com',
  'shoprite group': 'shoprite.co.za',
  'shoprite': 'shoprite.co.za',
  'woolworths': 'woolworths.co.za',
  'pick n pay': 'pnp.co.za',
  'eskom': 'eskom.co.za',
  'sasol': 'sasol.com',
  'wethinkcode_': 'wethinkcode.co.za',
  'wethinkcode': 'wethinkcode.co.za',
  'umuzi': 'umuzi.org',
  'harambee': 'harambee.co.za',
  'capaciti (ixperience)': 'capaciti.org.za',
  'edsa': 'edsa.co.za',
  'yoco technologies': 'yoco.com',
  'yoco': 'yoco.com',
  'bcx (business connexion)': 'bcx.co.za',
  'allan gray orbis foundation': 'allangrayorbis.org',
  'mastercard foundation': 'mastercardfdn.org',
  'nasa / sansa': 'nasa.gov',
  'nasa': 'nasa.gov',
  'seedstars': 'seedstars.com',
  'africarena': 'africarena.com',
  'womhub': 'womhub.com',
}

export function getCompanyLogo(org: string): string {
  const key = org.toLowerCase().trim()
  const domain = ORG_DOMAINS[key] ?? `${key.split(' ')[0]}.com`
  return `https://logo.clearbit.com/${domain}`
}

const TYPE_IMAGES: Record<string, string> = {
  internship: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
  learnership: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  graduate: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  scholarship: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  bootcamp: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
}

export function getTypeImage(type: string): string {
  return TYPE_IMAGES[type] ?? TYPE_IMAGES['internship']
}
