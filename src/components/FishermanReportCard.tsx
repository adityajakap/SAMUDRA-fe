import { Waves, AlertTriangle, CheckCircle } from "lucide-react"
import type { FishermanReport } from "../constants/fishermanReports"
import { OBSERVATION_OPTIONS } from "../constants/reportConstants"

interface FishermanReportCardProps {
  report: FishermanReport
}

export function FishermanReportCard({ report }: FishermanReportCardProps) {
  const isActionable = report.action === "Actionable"

  const tandaDiamati = (report.likCodes ?? []).map((code) => {
    const option = OBSERVATION_OPTIONS.find(
      (item) => item.value.toLowerCase() === code.toLowerCase()
    )
    return option?.label ?? code
  })

  return (
    <article className="bg-white rounded-xl shadow-md p-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              isActionable
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
            Laporan Nelayan {report.lokasi}
          </h2>
          <p className="text-xs text-gray-500">{report.waktu}</p>
        </div>

        {/* Action Badge */}
        <div
          className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            isActionable
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isActionable ? (
            <AlertTriangle className="w-3 h-3" aria-hidden />
          ) : (
            <CheckCircle className="w-3 h-3" aria-hidden />
          )}
          {isActionable ? "Actionable" : "Low"}
        </div>
      </div>

      {/* Gelombang */}
      {report.gelombang && (
        <div className="mt-3 flex items-center gap-2">
          <p className="text-xs text-gray-500">Gelombang</p>
          <p className="text-xs font-semibold">{report.gelombang}</p>
        </div>
      )}

      {/* Tanda yang Diamati */}
      <div className="mt-3">
        <p className="text-sm font-semibold">Tanda yang Diamati</p>
        {tandaDiamati.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">
            Belum ada tanda yang tercatat.
          </p>
        ) : (
          <ul className="mt-2 rounded-md p-3 text-sm text-gray-700 list-disc pl-5 space-y-1 [&>li::marker]:text-primary">
            {tandaDiamati.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* ML Description */}
      {report.mlDescription && (
        <div className="mt-3">
          <p className="text-sm font-semibold">Analisis ML</p>
          <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {report.mlDescription}
          </p>
        </div>
      )}

      {/* Rekomendasi */}
      {report.recommendation && (
        <div className="mt-3">
          <p className="text-sm font-semibold">Rekomendasi</p>
          <div
            className={`mt-1 p-3 rounded-lg text-sm ${
              isActionable
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            {report.recommendation}
          </div>
        </div>
      )}
    </article>
  )
}

export default FishermanReportCard