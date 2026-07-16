import { useCallback, useEffect, useState } from "react"
import { RefreshCw, AlertTriangle, Waves, ShieldAlert } from "lucide-react"
import { reportService } from "../services/reportService"
import { BEACH_LOCATIONS } from "../constants/observationData"
import type { BeachLocation, ActiveReportResponse } from "../types/api"
import { OBSERVATION_OPTIONS } from "../constants/reportConstants"

interface FishermanReportListProps {
  selectedBeach: BeachLocation
}

// Helper to format timestamp
const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) return "-"
  return new Date(timestamp).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function FishermanReportList({ selectedBeach }: FishermanReportListProps) {
  const [activeReport, setActiveReport] = useState<ActiveReportResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cachedAt, setCachedAt] = useState<number | null>(null)

  const fetchActiveReport = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true)
    }
    setError(null)
    try {
      const response = await reportService.getActiveReports(selectedBeach)
      setActiveReport(response)
      setCachedAt(Date.now())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat status komunitas")
    } finally {
      setIsLoading(false)
    }
  }, [selectedBeach])

  useEffect(() => {
    fetchActiveReport()
    const intervalId = setInterval(() => {
      fetchActiveReport({ silent: true })
    }, 30000)
    return () => clearInterval(intervalId)
  }, [fetchActiveReport])

  if (isLoading && !activeReport && !error) {
    return <p className="text-sm text-gray-500">Memuat status komunitas...</p>
  }

  // Safe optional chaining to prevent crashes
  const isActionable = activeReport?.active_warning?.alertEvent?.decision?.is_actionable === false;
  const hasReachedThreshold = activeReport?.active_warning?.alertEvent?.decision?.shouldDistribute ?? false;
  const actionRecommendation = activeReport?.active_warning?.alertEvent?.ml?.action_recommendation;
  const signDescription = activeReport?.active_warning?.alertEvent?.ml?.sign_description;

  const hasWarning = activeReport?.active_warning != null;
  const reportCounts = activeReport?.active_warning?.reportCounts ?? {};
  const reportedCodes = Object.keys(reportCounts).filter(code => reportCounts[code] > 0)


  // Mapping codes to labels with counts
  const tandaDenganCount = reportedCodes.map(code => {
    const option = OBSERVATION_OPTIONS.find(
      (item) => item.value.toLowerCase() === code.toLowerCase()
    )
    return {
      label: option?.label ?? code,
      count: reportCounts[code],
      triggered: true // Assume triggered if it's in active_warning reportCounts
    }
  })

  return (
    <div className="space-y-3">
      {/* Header controls for Refresh */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {isLoading ? "Memperbarui data..." : (cachedAt ? `Diperbarui: ${formatTimestamp(cachedAt)}` : "Baru saja diperbarui")}
        </span>
        <button
          type="button"
          onClick={() => fetchActiveReport()}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-indigo-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && !activeReport ? (
        <div className="space-y-2">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => fetchActiveReport()}
            className="text-sm text-primary hover:underline"
          >
            Coba lagi
          </button>
        </div>
      ) : (!hasWarning || !hasReachedThreshold) ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Tidak ada peringatan aktif</p>
            <p className="text-xs text-gray-500 mt-1">Kondisi di lokasi ini saat ini aman.</p>
          </div>
        </div>
      ) : (
        <article className="bg-white rounded-xl shadow-md p-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${isActionable
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
                  }`}
              >
                {isActionable ? (
                  <AlertTriangle className="w-5 h-5" aria-hidden />
                ) : (
                  <Waves className="w-5 h-5" aria-hidden />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">
                Status {BEACH_LOCATIONS.find(b => b.value === selectedBeach)?.label ?? selectedBeach}
              </h2>
              <p className="text-xs text-gray-500">
                Laporan Aktif
              </p>
            </div>

            {/* Action Badge */}
            <div
              className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${isActionable
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
                }`}
            >
              {isActionable ? (
                <AlertTriangle className="w-3 h-3" aria-hidden />
              ) : (
                <Waves className="w-3 h-3" aria-hidden />
              )}
              {isActionable ? "Perlu Tindakan" : "Perlu Kewaspadaan"}
            </div>
          </div>

          {/* Tanda yang Diamati (Counts) */}
          <div className="mt-3">
            <p className="text-sm font-semibold">Tanda yang Diamati</p>
            {tandaDenganCount.length > 0 ? (
              <ul className="mt-2 rounded-md p-3 text-sm text-gray-700 list-disc pl-5 space-y-1 [&>li::marker]:text-primary bg-gray-50 border border-gray-100">
                {tandaDenganCount.map((item, idx) => (
                  <li key={idx}>
                    <span className={item.triggered ? "font-semibold text-red-600" : ""}>{item.label}</span>
                    <span className="text-gray-500 ml-1">({item.count} laporan)</span>
                  </li>
                ))}
              </ul>
            ) : signDescription ? (
              <p className="mt-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 p-3 rounded-md">
                {signDescription}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Belum ada tanda yang tercatat.
              </p>
            )}
          </div>

          {/* Rekomendasi Aksi */}
          {actionRecommendation && (
            <div className="mt-3">
              <p className="text-sm font-semibold">Rekomendasi Aksi</p>
              <div
                className={`mt-1 p-3 rounded-lg text-sm ${isActionable
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}
              >
                {actionRecommendation}
              </div>
            </div>
          )}
        </article>
      )}
    </div>
  )
}

export default FishermanReportList
