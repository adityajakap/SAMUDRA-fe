import { useRef, useState } from "react"
import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export function MainLayout({ children }: Props) {
  const mainRef = useRef<HTMLElement | null>(null)
  const startYRef = useRef<number | null>(null)
  const isPullingRef = useRef(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const maxPull = 120
  const refreshThreshold = 80

  const resetPull = () => {
    setPullDistance(0)
    isPullingRef.current = false
    startYRef.current = null
  }

  const triggerRefresh = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setPullDistance(refreshThreshold)
    window.setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    if (isRefreshing) return
    if (mainRef.current && mainRef.current.scrollTop > 0) return
    startYRef.current = event.touches[0]?.clientY ?? null
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    if (isRefreshing) return
    if (startYRef.current === null) return
    if (mainRef.current && mainRef.current.scrollTop > 0) return

    const currentY = event.touches[0]?.clientY ?? 0
    const distance = currentY - startYRef.current
    if (distance <= 0) {
      setPullDistance(0)
      return
    }

    isPullingRef.current = true
    if (event.cancelable) {
      event.preventDefault()
    }
    setPullDistance(Math.min(distance, maxPull))
  }

  const handleTouchEnd = () => {
    if (!isPullingRef.current) {
      resetPull()
      return
    }

    if (pullDistance >= refreshThreshold) {
      triggerRefresh()
      return
    }

    resetPull()
  }

  const indicatorText = isRefreshing
    ? "Memuat ulang..."
    : pullDistance >= refreshThreshold
      ? "Lepas untuk memuat ulang"
      : "Tarik untuk memuat ulang"

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#F9F9F9] text-black"
      style={{
        paddingTop: 'var(--safe-area-inset-top)'
      }}
    >
      <main 
        ref={mainRef}
        className="flex-1 overflow-y-auto p-4"
        style={{
          paddingBottom: 'calc(1rem + var(--safe-area-inset-bottom))',
          overscrollBehaviorY: 'contain',
          touchAction: 'pan-x pan-y',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative">
          <div
            className="absolute left-0 right-0 top-0 flex items-center justify-center text-xs text-gray-500"
            style={{
              height: Math.min(pullDistance, 60),
              opacity: pullDistance > 0 ? 1 : 0,
              transition: isPullingRef.current
                ? "none"
                : "opacity 0.2s ease, height 0.2s ease",
            }}
          >
            {indicatorText}
          </div>
          <div
            style={{
              transform: pullDistance ? `translateY(${pullDistance}px)` : "translateY(0)",
              transition: isPullingRef.current ? "none" : "transform 0.2s ease",
            }}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
