import WeatherAlertCard from "./WeatherAlertCard"
import WeatherAlertSkeleton from "./WeatherAlertSkeleton"
import { useWeatherAlerts } from "../hooks/useWeatherAlerts"
import { WEATHER_CONFIG } from "../constants/weatherConfig"

export function WeatherAlertList() {
  const { alerts, loading, error } = useWeatherAlerts()

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: WEATHER_CONFIG.SKELETON_COUNT }).map((_, idx) => (
          <WeatherAlertSkeleton key={`skeleton-${idx}`} />
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
    <div className="space-y-4">
      {alerts.map((alert, idx) => (
        <WeatherAlertCard key={idx} {...alert} />
      ))}
    </div>
  )
}

export default WeatherAlertList
