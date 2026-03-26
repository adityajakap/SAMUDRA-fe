import { FISHERMAN_REPORTS } from "../constants/fishermanReports"
import { FishermanReportCard } from "./FishermanReportCard"

export function FishermanReportList() {
  if (FISHERMAN_REPORTS.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Belum ada laporan nelayan terbaru.
      </p>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-1 md:gap-4 md:overflow-visible">
      {FISHERMAN_REPORTS.map((report) => (
        <div key={report.id} className="min-w-[85%] snap-start sm:min-w-[420px] md:min-w-0">
          <FishermanReportCard report={report} />
        </div>
      ))}
    </div>
  )
}

export default FishermanReportList