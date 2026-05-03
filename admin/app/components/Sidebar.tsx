'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Briefcase, Users, GraduationCap, MessageSquare } from 'lucide-react'
import Image from 'next/image'

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/mentors', label: 'Mentors', icon: GraduationCap },
  { href: '/posts', label: 'Posts', icon: MessageSquare },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 bg-bg border-r border-border flex flex-col py-8 px-4 gap-1 shrink-0 h-screen">
      <div className="px-3 mb-8">
        <Image src="/logo.png" alt="NextStep" width={120} height={24} />
        <p className="text-xs text-textMuted mt-1">Admin Dashboard</p>
      </div>
      {links.map(({ href, label, icon: Icon }) => {
        const active = path === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-inter transition-colors ${
              active
                ? 'bg-primary/15 text-primary font-semibold'
                : 'text-textSecondary hover:text-textPrimary hover:bg-cardAlt'
            }`}
          >
            <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
            {label}
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
          </Link>
        )
      })}
    </aside>
  )
}
