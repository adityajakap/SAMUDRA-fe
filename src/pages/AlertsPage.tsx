import { MainLayout } from "../components/layout/MainLayout"
import {AlertTriangle} from "lucide-react"

export function AlertsPage() {
 
  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-3">Peringatan Cuaca</h1>
      <div className="space-y-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
      </div>
    </MainLayout>
  )
}
