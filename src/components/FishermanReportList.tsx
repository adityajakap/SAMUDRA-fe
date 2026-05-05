import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RefreshCw } from "lucide-react"
import type { FishermanReport, ReportAction } from "../constants/fishermanReports"
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

const deriveAction = (item: HistoryItem): ReportAction => {
  return item.decision?.action === "Actionable" || item.ml?.action === "Actionable"
    ? "Actionable"
    : "Low"
}

const mapHistoryItem = (item: HistoryItem): FishermanReport => {
  const beachValue = item.beach_location ?? item.input?.beach_location
  return {
    id: item.reportId ?? item.id,
    beachValue,
    lokasi: getBeachLabel(beachValue),
    waktu: formatTimestamp(item.serverTimestamp),
    action: deriveAction(item),
    likCodes: item.input?.lik_codes ?? [],
    recommendation: item.ml?.recommendation,
    mlDescription: item.ml?.description,
  }
}

export function FishermanReportList({ selectedBeach }: FishermanReportListProps) {
  const [reports, setReports] = useState<FishermanReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cachedAt, setCachedAt] = useState<number | null>(null)
  const reportCountRef = useRef(0)

  const fetchReports = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true)
    }
    setError(null)
    try {
      const response = await historyService.getDistributedHistory({ limit: 20 })

      const twentyFourHoursMs = 24 * 60 * 60 * 1000;
      const now = Date.now();

      const recentItems = response.items.filter((item) => {
        if (!item.serverTimestamp) return false;
        const normalized = item.serverTimestamp < 1e12 ? item.serverTimestamp * 1000 : item.serverTimestamp;
        return (now - normalized) <= twentyFourHoursMs;
      });

      const mappedReports = recentItems.map(mapHistoryItem)
      setReports(mappedReports)
      saveCache(mappedReports)
      setCachedAt(Date.now())
    } catch (err) {
      const cached = loadCache()
      if (cached && reportCountRef.current === 0) {
        setReports(cached.reports)
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
      setCachedAt(cached.updatedAt)
      setIsLoading(false)
    }
    fetchReports({ silent: Boolean(cached) })

    // Auto-refresh periodically (e.g. every 30 seconds)
    const intervalId = setInterval(() => {
      fetchReports({ silent: true })
    }, 30000)

    return () => clearInterval(intervalId)
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

  return (
    <div className="space-y-3">
      {/* Header controls for Refresh */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {isLoading ? "Memperbarui data..." : (cachedAt ? `Diperbarui: ${formatTimestamp(cachedAt)}` : "Baru saja diperbarui")}
        </span>
        <button
          type="button"
          onClick={() => fetchReports()}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-indigo-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && reports.length === 0 ? (
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
      ) : reports.length === 0 ? (
        <p className="text-sm text-gray-500">
          Belum ada laporan nelayan terbaru.
        </p>
      ) : filteredReports.length === 0 ? (
        <p className="text-sm text-gray-500">
          Belum ada laporan nelayan untuk lokasi ini.
        </p>
      ) : (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between text-xs text-red-600">
              <span>{error}</span>
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
      )}
    </div>
  )
}

export default FishermanReportList