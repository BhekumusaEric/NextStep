'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: '📊 Dashboard' },
  { href: '/opportunities', label: '🎯 Opportunities' },
  { href: '/users', label: '👥 Users' },
  { href: '/mentors', label: '🧑‍🏫 Mentors' },
  { href: '/posts', label: '💬 Posts' },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-8 px-4 gap-1 shrink-0">
      <p className="text-white font-bold text-lg mb-6 px-2">NextStep</p>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            path === l.href
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {l.label}
        </Link>
      ))}
    </aside>
  )
}
