import { MainLayout } from "../components/layout/MainLayout"
import { Button } from "../components/ui/Button"

export function ReportPage() {
  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-1">Laporkan Cuaca</h1>
      <p className="mb-4 text-gray-600">
        Pantai Depok, Bantul 16:24 WIB 
      </p>  
      <form className="space-y-3">
        <label className="block text-sm font-medium mb-1">Objek Pengamatan</label>
        <select
          className="w-full p-3 rounded-md bg-white shadow-sm border border-black focus:ring-2 focus:ring-blue-400 focus:shadow-md transition outline-none"
        >
          <option value="">Pilih objek pengamatan</option>
          <option value="cuaca">Awan</option>
          <option value="angin">Angin</option>
          <option value="ombak">Ombak</option>
        </select>
            <label className="block text-sm font-medium mb-1">Tanda yang Diamati</label>
        <select
          className="w-full p-3 rounded-md bg-white shadow-sm border border-black focus:ring-2 focus:ring-blue-400 focus:shadow-md transition outline-none"
        >
          <option value="">Pilih Tanda yang Diamati</option>
          <option value="cuaca">Awan Gelap</option>
          <option value="angin">Angin</option>
          <option value="ombak">Ombak</option>
        </select> 
            <label className="block text-sm font-medium mb-1">Kondisi Tanda</label>
        <select
          className="w-full p-3 rounded-md bg-white shadow-sm border border-black focus:ring-2 focus:ring-blue-400 focus:shadow-md transition outline-none"
        >
          <option value="">Pilih Kondisi Tanda</option>
          <option value="cuaca">Awan Tebal dan Bergulung</option>
          <option value="angin">Angin</option>
          <option value="ombak">Ombak</option>
        </select>
           <label className="block text-sm font-medium mb-1">Keterangan Tambahan</label>
        <textarea
          placeholder="Contoh: Gelombang membentuk pola"
          className="w-full p-3 rounded-md bg-white shadow-sm border border-black focus:ring-2 focus:ring-blue-400 focus:shadow-md transition outline-none"
        />
        <Button variant="primary" className="w-full shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 transition">
          Tambahkan
        </Button>
      </form>
    </MainLayout>
  )
}

