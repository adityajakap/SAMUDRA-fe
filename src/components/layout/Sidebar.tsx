import { X } from "lucide-react"
import { NavItem } from "./NavItem"
import { NAV_ITEMS } from "../../constants/navigation"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar Panel */}
      <aside
        role="menu"
        aria-label="Main menu"
        className={`absolute top-0 left-0 bottom-0 w-80 max-w-[85%] bg-[#F9F9F9] border-r border-slate-700 shadow-lg p-4 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Menu</span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/5 focus:outline-none transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.path} {...item} onClick={onClose} />
          ))}
        </nav>
      </aside>
    </div>
  )
}
