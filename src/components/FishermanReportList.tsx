import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { FishermanReport, IntensityLevel } from "../constants/fishermanReports"
import { FishermanReportCard } from "./FishermanReportCard"
import { historyService, type HistoryItem } from "../services/historyService"
import { BEACH_LOCATIONS } from "../constants/observationData"
import type { BeachLocation } from "../types/api"

interface FishermanReportListProps {
  selectedBeach: BeachLocation
}

const CACHE_KEY = "fishermanReportsCache.v1"

type ReportsCache = {
  updatedAt: number
  reports: FishermanReport[]
}

const loadCache = (): ReportsCache | null => {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ReportsCache
    if (!Array.isArray(parsed.reports)) return null
    return parsed
  } catch {
    return null
  }
}

const saveCache = (reports: FishermanReport[]) => {
  if (typeof window === "undefined") return
  const payload: ReportsCache = {
    updatedAt: Date.now(),
    reports,
  }
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
}

const getBeachLabel = (value?: BeachLocation) => {
  if (!value) return "Lokasi tidak diketahui"
  return BEACH_LOCATIONS.find((beach) => beach.value === value)?.label ?? "Lokasi tidak diketahui"
}

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) return "-"
  const normalized = timestamp < 1e12 ? timestamp * 1000 : timestamp
  return new Date(normalized).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const deriveIntensity = (item: HistoryItem): IntensityLevel => {
  if (item.decision?.is_high_risk || item.ml?.is_high_risk) {
    return "tinggi"
  }
  if (item.decision?.is_multisign) {
    return "sedang"
  }
  return "rendah"
}

const mapHistoryItem = (item: HistoryItem): FishermanReport => {
  const beachValue = item.beach_location ?? item.input?.beach_location
  return {
    id: item.reportId ?? item.id,
    beachValue,
    lokasi: getBeachLabel(beachValue),
    waktu: formatTimestamp(item.serverTimestamp),
    intensity: deriveIntensity(item),
    likCodes: item.input?.lik_codes ?? [],
  }
}

export function FishermanReportList({ selectedBeach }: FishermanReportListProps) {
  const [reports, setReports] = useState<FishermanReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingCache, setIsUsingCache] = useState(false)
  const [cachedAt, setCachedAt] = useState<number | null>(null)
  const reportCountRef = useRef(0)

  const fetchReports = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true)
    }
    setError(null)
    try {
      const response = await historyService.getDistributedHistory({ limit: 10 })
      const mappedReports = response.items.map(mapHistoryItem)
      setReports(mappedReports)
      saveCache(mappedReports)
      setIsUsingCache(false)
      setCachedAt(Date.now())
    } catch (err) {
      const cached = loadCache()
      if (cached && reportCountRef.current === 0) {
        setReports(cached.reports)
        setIsUsingCache(true)
        setCachedAt(cached.updatedAt)
      }
      setError(err instanceof Error ? err.message : "Gagal memuat laporan nelayan")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = loadCache()
    if (cached) {
      setReports(cached.reports)
      setIsUsingCache(true)
      setCachedAt(cached.updatedAt)
      setIsLoading(false)
    }
    fetchReports({ silent: Boolean(cached) })
  }, [fetchReports])

  useEffect(() => {
    reportCountRef.current = reports.length
  }, [reports.length])

  const filteredReports = useMemo(
    () => reports.filter((report) => report.beachValue === selectedBeach),
    [reports, selectedBeach]
  )

  if (isLoading && reports.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Memuat laporan nelayan...
      </p>
    )
  }

  if (error && reports.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => fetchReports()}
          className="text-sm text-primary hover:underline"
        >
          Coba lagi
        </button>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Belum ada laporan nelayan terbaru.
      </p>
    )
  }

  if (filteredReports.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Belum ada laporan nelayan untuk lokasi ini.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {isUsingCache && cachedAt && (
        <p className="text-xs text-gray-500">
          Menampilkan data tersimpan ({formatTimestamp(cachedAt)})
        </p>
      )}
      {error && (
        <div className="flex items-center justify-between text-xs text-red-600">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => fetchReports()}
            className="text-xs text-primary hover:underline"
          >
            Coba lagi
          </button>
        </div>
      )}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-1 md:gap-4 md:overflow-visible">
        {filteredReports.map((report) => (
          <div key={report.id} className="min-w-[85%] snap-start sm:min-w-[420px] md:min-w-0">
            <FishermanReportCard report={report} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FishermanReportList