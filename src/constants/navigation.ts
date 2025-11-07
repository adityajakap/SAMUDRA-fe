import { Home, CloudRain, PenLine, User } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Beranda", icon: Home },
  { path: "/alerts", label: "Cuaca", icon: CloudRain },
  { path: "/report", label: "Lapor", icon: PenLine },
  { path: "/profile", label: "Profil", icon: User },
] as const
