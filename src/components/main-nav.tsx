'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarCheck2,
  FileSpreadsheet,
  Menu,
  ShieldCheck,
  Users2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: '/mdt', label: 'Dashboard', icon: Users2 },
  { href: '/meetings', label: 'Schedules', icon: CalendarCheck2 },
  { href: '/tasks', label: 'Tasks', icon: ShieldCheck },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[#2D6356] text-white shadow-sm">
      <div className="container flex h-16 w-full items-center gap-4">
        <Link href="/mdt" className="flex shrink-0 items-center gap-3 text-sm font-semibold tracking-tight text-white">
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

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <nav className="flex items-center gap-1">
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
                    'h-9 gap-1.5 px-2.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white',
                    isActive && 'bg-white/25 text-white font-semibold shadow-sm'
                  )}
                >
                  <Link href={item.href} className="inline-flex items-center justify-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </nav>
          <Button asChild variant="outline" size="sm" className="border-white/30 px-3 text-white hover:bg-white/10">
            <Link href="/admin/allowlist" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Administration
            </Link>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/15">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {[...navItems, { href: '/admin/allowlist', label: 'Administration', icon: FileSpreadsheet }].map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2',
                        isActive && 'font-semibold text-primary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
