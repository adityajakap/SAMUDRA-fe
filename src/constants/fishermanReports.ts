import type { BeachLocation } from "../types/api"

export type ReportAction = "Low" | "Actionable"

export interface FishermanReport {
  id: string
  beachValue?: BeachLocation
  lokasi: string
  waktu: string
  gelombang?: string
  action: ReportAction
  likCodes: string[]
  recommendation?: string
  mlDescription?: string
}

export const FISHERMAN_REPORTS: FishermanReport[] = [
  {
    id: "1",
    lokasi: "Pantai Depok",
    waktu: "Hari ini, 07:15",
    gelombang: "1.2 - 1.8 m",
    action: "Low",
    likCodes: ["wn-2", "wn-4", "wn-6"],
    recommendation: "Kondisi aman, tetap perhatikan perubahan cuaca.",
    mlDescription: "Tanda alam terdeteksi namun masih dalam batas normal.",
  },
  {
    id: "2",
    lokasi: "Pantai Samas",
    waktu: "Hari ini, 09:40",
    gelombang: "2.0 - 2.6 m",
    action: "Actionable",
    likCodes: ["wn-3", "wn-9", "wn-15"],
    recommendation: "Segera berlindung di tempat aman dan hindari area pantai.",
    mlDescription: "Terdeteksi tanda bahaya cuaca ekstrem. Tindakan segera diperlukan.",
  },
]