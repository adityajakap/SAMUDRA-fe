import { MainLayout } from "../components/layout/MainLayout"
import { ArrowRight, MapPin, Search } from "lucide-react"
import { TodayForecast } from "../components/TodayForecast"
import { WeatherAlertList } from "../components/WeatherAlertList"

export function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-3">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" aria-hidden />
          Pantai Depok Bantul
        </h1>
        <div className="relative">
          <input
            type="search"
            placeholder="Cari lokasi..."
            className="w-full bg-white iWWtalic rounded-lg border border-black text-sm py-2 pl-3 pr-10 focus:outline-none"
          />
          <button type="button" className="absolute inset-y-0 right-0 flex items-center justify-center w-8 h-full">
            <Search className="w-4 h-4 text-black" aria-hidden />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">Peringatan Cuaca</h1>
          <button type="button" className="text-sm text-primary hover:underline font-semibold flex items-center gap-2">
            Selengkapnya
            <span className="w-5 h-5 flex items-center justify-center bg-primary text-white rounded-full">
              <ArrowRight className="w-3 h-3" aria-hidden strokeWidth={4} />
            </span>
          </button>
        </div>
      <WeatherAlertList />

      <div className="space-y-3">
        <h1 className="text-xl font-bold flex items-center gap-2 mt-5">Prakiraan Hari Ini</h1>
        <TodayForecast />
      </div>

      </div>
    </MainLayout>
  )
}
