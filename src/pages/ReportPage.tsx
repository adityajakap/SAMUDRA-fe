import { useState } from "react"
import { MainLayout } from "../components/layout/MainLayout"
import { Button } from "../components/ui/Button"
import { ObservationModal } from "../components/ObservationModal"
import { FormField, NumberInput, SelectInput } from "../components/FormInputs"
import { useReportForm } from "../hooks/useReportForm"
import { OBSERVATION_OPTIONS, INTERACTION_LEVELS } from "../constants/reportConstants"

export function ReportPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { formData, selectedObservations, isSubmitting, updateField, setSelectedObservations, submitReport } = useReportForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submitReport()
    } catch {
      // Error already handled in hook
    }
  }

  const removeObservation = (value: string) => {
    setSelectedObservations(selectedObservations.filter(v => v !== value))
  }

  const getObservationLabel = (value: string) => {
    return OBSERVATION_OPTIONS.find(opt => opt.value === value)?.label || ''
  }

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-1">Laporkan Cuaca</h1>
      <p className="mb-4 text-gray-600">Pantai Depok, Bantul 16:24 WIB</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Observation Selection */}
        <FormField label="Objek Pengamatan" required>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full p-3 rounded-lg bg-white border border-gray-300 text-left hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
          >
            {selectedObservations.length > 0 ? (
              <span className="text-sm text-gray-900">{selectedObservations.length} tanda dipilih</span>
            ) : (
              <span className="text-sm text-gray-500">Pilih objek pengamatan</span>
            )}
          </button>

          {selectedObservations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedObservations.map(val => (
                <span key={val} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {getObservationLabel(val).substring(0, 30)}...
                  <button type="button" onClick={() => removeObservation(val)} className="hover:text-blue-900">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </FormField>

        {/* Form Fields */}
        <FormField label="Tingkat Interaksi dengan Bencana" required>
          <SelectInput
            value={formData.levelOfInteraction}
            onChange={(v) => updateField('levelOfInteraction', v)}
            options={INTERACTION_LEVELS}
            placeholder="Pilih tingkat interaksi"
            required
          />
        </FormField>

        <FormField label="Usia" required>
          <NumberInput
            value={formData.age}
            onChange={(v) => updateField('age', v)}
            placeholder="Masukkan usia Anda"
            min={1}
            max={120}
            required
          />
        </FormField>

        <FormField label="Durasi Penggunaan Aplikasi (bulan)" required>
          <NumberInput
            value={formData.usageDuration}
            onChange={(v) => updateField('usageDuration', v)}
            placeholder="Berapa lama menggunakan aplikasi ini?"
            min={0}
            required
          />
        </FormField>

        <FormField label="Frekuensi Penggunaan Minimum (kali/bulan)" required>
          <NumberInput
            value={formData.minFrequency}
            onChange={(v) => updateField('minFrequency', v)}
            placeholder="Berapa kali minimal menggunakan per bulan?"
            min={0}
            required
          />
        </FormField>

        <FormField label="Pengalaman Melaut (tahun)" required>
          <NumberInput
            value={formData.fishingExperience}
            onChange={(v) => updateField('fishingExperience', v)}
            placeholder="Berapa tahun pengalaman melaut?"
            min={0}
            required
          />
        </FormField>

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Menambahkan...' : 'Tambahkan'}
        </Button>
      </form>

      <ObservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedValues={selectedObservations}
        onConfirm={setSelectedObservations}
      />
    </MainLayout>
  )
}

