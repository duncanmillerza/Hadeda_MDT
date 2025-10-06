'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarCheck2,
  ClipboardList,
  FileSpreadsheet,
  ShieldCheck,
  Users2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/mdt', label: 'Dashboard', icon: Users2 },
  { href: '/meetings', label: 'Schedules', icon: CalendarCheck2 },
  { href: '/patients', label: 'Patient Care', icon: ClipboardList },
  { href: '/tasks', label: 'Tasks', icon: ShieldCheck },
  { href: '/import', label: 'Administration', icon: FileSpreadsheet },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[#2D6356] text-white shadow-sm">
      <div className="container flex h-16 items-center justify-between gap-6 px-4">
        <Link href="/mdt" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-white">
          <span className="relative h-10 w-[152px]">
            <Image
              src="/wordmark-mono.svg"
              alt="Hadeda Health"
              fill
              className="object-contain"
              priority
            />
          </span>
          <span className="hidden h-8 w-px bg-white/30 md:inline" aria-hidden />
          <span className="text-sm font-medium text-white/80">MDT Platform</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Button
                key={item.href}
                asChild
                size="sm"
                variant="ghost"
                className={cn(
                  'h-9 px-3 text-white/80 transition-colors hover:bg-white/15 hover:text-white',
                  isActive && 'bg-white/25 text-white font-semibold shadow-sm'
                )}
              >
                <Link href={item.href} className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <span className="text-xs uppercase tracking-wide text-white/70">Logged in as admin</span>
        </div>
      </div>
    </header>
  )
}
