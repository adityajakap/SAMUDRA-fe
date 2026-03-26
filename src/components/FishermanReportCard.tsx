import { Waves } from "lucide-react"
import type { FishermanReport } from "../constants/fishermanReports"
import { OBSERVATION_OPTIONS } from "../constants/reportConstants"

interface FishermanReportCardProps {
  report: FishermanReport
}

const INTENSITY_PROGRESS: Record<FishermanReport["intensity"], number> = {
  rendah: 33,
  sedang: 66,
  tinggi: 100,
}

const INTENSITY_LABEL: Record<FishermanReport["intensity"], string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
}

export function FishermanReportCard({ report }: FishermanReportCardProps) {
  const progress = INTENSITY_PROGRESS[report.intensity]
  const tandaDiamati = report.likCodes.map((code) => {
    const option = OBSERVATION_OPTIONS.find((item) => item.value === code)
    return option?.label ?? code
  })

  return (
    <article className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <Waves className="w-5 h-5" aria-hidden />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-semibold">Laporan Nelayan {report.lokasi}</h2>
          <p className="text-xs text-gray-500">{report.waktu}</p>

          <div className="mt-3">
            <p className="text-xs text-gray-500">Gelombang</p>
            <p className="font-semibold">{report.gelombang}</p>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-semibold">Intensitas Rata-rata</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"   
              style={{ width: `${progress}%` }}
              aria-hidden
            />
          </div>
          <div className={`px-2 py-1 rounded text-xs font-semibold text-white ${
            report.intensity === "rendah"
              ? "bg-green-500"
              : report.intensity === "sedang"
            ? "bg-yellow-500"
            : "bg-red-500"
          }`}>
            {INTENSITY_LABEL[report.intensity]}
          </div>
        </div>
     
      </div>

      <div className="mt-3">
        <p className="text-sm font-semibold">Tanda yang Diamati</p>
        <ul className="mt-2 rounded-md p-3 text-sm text-gray-700 list-disc pl-5 space-y-1 [&>li::marker]:text-primary   ">
          {tandaDiamati.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold">Prakiraan</p>
        <p className="mt-2 bg-gray-100 rounded-md p-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            {report.prakiraan}
        </p>
      </div>
    <div className="mt-3">
        <p className="text-sm font-semibold">Rekomendasi</p>
        <p className="mt-2 bg-gray-100 rounded-md p-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
            {report.rekomendasi}
        </p>
    </div>
    </article>
  )
}

export default FishermanReportCard