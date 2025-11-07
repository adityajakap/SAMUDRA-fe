export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-md">{children}</div>
  )
}
