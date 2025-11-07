import { NavLink } from "react-router-dom"
import type { NavItem as NavItemType } from "../../constants/navigation"

interface NavItemProps extends NavItemType {
  onClick?: () => void
}

export function NavItem({ path, label, icon: Icon, onClick }: NavItemProps) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded transition-all duration-150 transform hover:translate-x-1 ${
          isActive ? "text-primary bg-white/5" : "text-gray-400 hover:text-gray-700"
        }`
      }
    >
      <Icon size={18} aria-hidden />
      <span>{label}</span>
    </NavLink>
  )
}
