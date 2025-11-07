import { MainLayout } from "../components/layout/MainLayout"
import { Button } from "../components/ui/Button"

export function ReportPage() {
  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-3">Laporkan Cuaca</h1>
      <form className="space-y-3">
        <input
          type="text"
          placeholder="Objek pengamatan"
          className="w-full p-3 rounded-md bg-white shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-400 focus:shadow-md transition outline-none"
        />
        <textarea
          placeholder="Deskripsi singkat"
          className="w-full p-3 rounded-md bg-white h-24 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-400 focus:shadow-md transition outline-none"
        />
        <Button variant="primary" className="w-full shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 transition">
          Kirim
        </Button>
      </form>
    </MainLayout>
  )
}
