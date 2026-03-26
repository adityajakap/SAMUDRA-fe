export type IntensityLevel = "rendah" | "sedang" | "tinggi"

export interface FishermanReport {
  id: number
  lokasi: string
  waktu: string
  gelombang: string
  intensity: IntensityLevel
  likCodes: string[]
  prakiraan?: string[]
  rekomendasi?: string[]
}

export const FISHERMAN_REPORTS: FishermanReport[] = [
  {
    id: 1,
    lokasi: "Pantai Depok",
    waktu: "Hari ini, 07:15",
    gelombang: "1.2 - 1.8 m",
    intensity: "sedang",
    likCodes: ["wn-2", "wn-4", "wn-6"],
    prakiraan: [
      "Hari ini akan terjadi hujan ringan di area pantai",
    ],
    rekomendasi: [
      "Nelayan disarankan untuk tidak berlayar ke laut",
    ]
  },
  {
    id: 2,
    lokasi: "Pantai Samas",
    waktu: "Hari ini, 09:40",
    gelombang: "2.0 - 2.6 m",
    intensity: "tinggi",
    likCodes: ["wn-3", "wn-9", "wn-15"],
    prakiraan: [
      "Diprediksi akan terjadi hujan lebat disertai angin kencang",
    ],
    rekomendasi: [
      "Segera berlindung di tempat aman dan hindari area pantai",
    ]
  },
]