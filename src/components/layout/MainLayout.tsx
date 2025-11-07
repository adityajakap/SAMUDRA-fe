import type { ReactNode } from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { useSidebar } from "../../hooks/useSidebar"

interface Props {
  children: ReactNode
}

export function MainLayout({ children }: Props) {
  const { isOpen, toggle, close } = useSidebar()

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] text-black">
      <Header isMenuOpen={isOpen} onMenuToggle={toggle} />
      
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
      
      <Sidebar isOpen={isOpen} onClose={close} />
    </div>
  )
}
