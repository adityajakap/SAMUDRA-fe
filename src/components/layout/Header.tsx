import { Menu, X } from "lucide-react"

interface HeaderProps {
  isMenuOpen: boolean
  onMenuToggle: () => void
}

export function Header({ isMenuOpen, onMenuToggle }: HeaderProps) {
  return (
    <header className="p-4 font-bold text-xl bg-white text-black shadow flex items-center justify-between">
      <button
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        onClick={onMenuToggle}
        className="p-2 rounded-md focus:outline-none hover:bg-gray-100 transition-colors"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  )
}
