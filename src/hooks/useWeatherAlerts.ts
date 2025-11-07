import { useEffect, useState } from "react"
import type { WeatherAlertProps } from "../components/WeatherAlertCard"
import { WEATHER_CONFIG, PROXY_REPLACEMENTS } from "../constants/weatherConfig"
import {
  formatDateToID,
  formatTimeWIB,
  buildRecommendation,
  proxifyBmkgUrl,
  extractLocation,
} from "../utils/weatherUtils"

export function useWeatherAlerts() {
  const [alerts, setAlerts] = useState<WeatherAlertProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchAlerts() {
      try {
        setLoading(true)
        setError(null)

        const rssRes = await fetch(WEATHER_CONFIG.BMKG_RSS_PROXY, {
          signal: controller.signal,
        })
        const rssText = await rssRes.text()

        const parser = new DOMParser()
        const rssXml = parser.parseFromString(rssText, "application/xml")
        const items = Array.from(rssXml.querySelectorAll("item")).slice(
          0,
          WEATHER_CONFIG.MAX_ALERTS_TO_FETCH,
        )

        const mappedAlerts: WeatherAlertProps[] = []

        for (const item of items) {
          const title = item.querySelector("title")?.textContent ?? ""
          const link = item.querySelector("link")?.textContent ?? ""
          const pubDate = item.querySelector("pubDate")?.textContent ?? ""

          if (!link) continue

          const proxiedLink = proxifyBmkgUrl(link, PROXY_REPLACEMENTS)
          const capRes = await fetch(proxiedLink, { signal: controller.signal })

          if (!capRes.ok) {
            throw new Error(`CAP status ${capRes.status}`)
          }

          const capText = await capRes.text()
          const capXml = parser.parseFromString(capText, "application/xml")

          const info = capXml.getElementsByTagNameNS("*", "info")[0]
          const event = info?.getElementsByTagNameNS("*", "event")[0]?.textContent ?? ""
          const effective =
            info?.getElementsByTagNameNS("*", "effective")[0]?.textContent ?? ""
          const expires =
            info?.getElementsByTagNameNS("*", "expires")[0]?.textContent ?? ""
          const headline =
            info?.getElementsByTagNameNS("*", "headline")[0]?.textContent ?? ""
          const description =
            info?.getElementsByTagNameNS("*", "description")[0]?.textContent ?? ""

          mappedAlerts.push({
            location: extractLocation(headline, title),
            date: formatDateToID(effective || pubDate),
            start: formatTimeWIB(effective),
            end: formatTimeWIB(expires),
            condition: event || "Peringatan Cuaca",
            forecast: description || "Peringatan dini cuaca dari BMKG.",
            recommendation: buildRecommendation(event, description),
          })
        }

        setAlerts(mappedAlerts)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return
        console.error(err)
        setError("Gagal memuat data peringatan cuaca.")
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    return () => controller.abort()
  }, [])

  return { alerts, loading, error }
}
