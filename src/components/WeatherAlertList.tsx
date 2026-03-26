import WeatherAlertCard from "./WeatherAlertCard"
import WeatherAlertSkeleton from "./WeatherAlertSkeleton"
import { useWeatherAlerts } from "../hooks/useWeatherAlerts"
import { WEATHER_CONFIG } from "../constants/weatherConfig"

export function WeatherAlertList() {
  const { alerts, loading, error } = useWeatherAlerts()

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {Array.from({ length: WEATHER_CONFIG.SKELETON_COUNT }).map((_, idx) => (
          <div key={`skeleton-${idx}`} className="min-w-[85%] snap-start sm:min-w-[420px]">
            <WeatherAlertSkeleton />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  if (alerts.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Tidak ada peringatan cuaca aktif dari BMKG saat ini.
      </p>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
      {alerts.map((alert, idx) => (
        <div key={idx} className="min-w-[85%] snap-start sm:min-w-[420px]">
          <WeatherAlertCard {...alert} id={idx} />
        </div>
      ))}
    </div>
  )
}

export default WeatherAlertList