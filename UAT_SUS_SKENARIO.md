# Dokumen Uji Coba Pengguna (SUS & UAT) Aplikasi SAMUDRA

Dokumen ini memuat daftar kuesioner **System Usability Scale (SUS)** untuk mengukur tingkat kebergunaan (usability) aplikasi, serta rancangan skenario pengujian **User Acceptance Testing (UAT)** berdasarkan seluruh fitur utama yang ada pada *codebase* SAMUDRA saat ini.

---

## Bagian 1: Kuesioner System Usability Scale (SUS)

SUS adalah kuesioner standar yang terdiri dari 10 pertanyaan dengan skala penilaian 1 hingga 5 (1 = Sangat Tidak Setuju, 5 = Sangat Setuju).

**Daftar Pertanyaan (Telah disesuaikan ke Bahasa Indonesia):**

1. Saya berpikir bahwa saya akan sering menggunakan aplikasi SAMUDRA ini.
2. Saya merasa aplikasi ini terlalu rumit, padahal bisa dibuat lebih sederhana.
3. Saya merasa aplikasi ini mudah untuk digunakan.
4. Saya merasa butuh bantuan dari orang teknis (ahli IT) untuk bisa menggunakan aplikasi ini.
5. Saya merasa fitur-fitur di dalam aplikasi ini berjalan dengan semestinya (terintegrasi dengan baik).
6. Saya merasa ada banyak hal yang tidak konsisten (membingungkan) pada aplikasi ini.
7. Saya merasa kebanyakan orang (nelayan/warga pesisir) akan cepat memahami cara menggunakan aplikasi ini.
8. Saya merasa aplikasi ini sangat tidak praktis/menyusahkan saat digunakan.
9. Saya merasa sangat yakin dan percaya diri saat menggunakan aplikasi ini.
10. Saya merasa harus banyak belajar dan membiasakan diri terlebih dahulu sebelum bisa menggunakan aplikasi ini dengan baik.

> **[TIP] Cara Perhitungan Skor SUS:**
> *   Untuk pertanyaan ganjil (1, 3, 5, 7, 9): Skor = Nilai Jawaban - 1
> *   Untuk pertanyaan genap (2, 4, 6, 8, 10): Skor = 5 - Nilai Jawaban
> *   Jumlahkan semua skor, lalu kalikan dengan **2.5**. Total skor rata-rata SUS yang baik adalah di atas **68**.

---

## Bagian 2: Skenario User Acceptance Testing (UAT)

Skenario UAT ini digunakan untuk memastikan bahwa pengguna (end-user) dapat menjalankan alur bisnis aplikasi tanpa adanya *error* dan sesuai ekspektasi.

### UAT 01: Membuat Laporan Tanda Alam (LIK)
*   **Tujuan:** Memastikan pengguna dapat mengirim laporan cuaca/tanda alam berbasis LIK ke *backend* (ML Faiqal).
*   **Langkah Pengujian:**
    1. Buka aplikasi dan masuk ke halaman **Laporan** (*Report Page*).
    2. Pilih lokasi pesisir pantai.
    3. Pilih satu atau beberapa *tanda alam* (Kode LIK) yang sedang teramati.
    4. Tekan tombol Kirim Laporan.
*   **Ekspektasi Hasil:** Muncul notifikasi bahwa laporan berhasil dikirim. Aplikasi akan memunculkan respons langsung dari Machine Learning berupa **Status Keamanan** (Aman/Tidak Aman) dan **Deskripsi ML** terkait risiko.

### UAT 02: Melihat Data Cuaca & Peringatan Dini (BMKG)
*   **Tujuan:** Memastikan data dari BMKG (*alerts* dan *forecast*) termuat dan dapat dibaca oleh nelayan.
*   **Langkah Pengujian:**
    1. Buka halaman **Home**, amati ringkasan cuaca di bagian atas.
    2. Navigasi ke halaman **Forecast** dan **Alerts Detail**.
    3. Pastikan informasi suhu, arah angin, gelombang, dan peringatan dini muncul.
*   **Ekspektasi Hasil:** Data BMKG terbaru berhasil ditampilkan sesuai dengan koordinat atau lokasi ADM4 pengguna.

### UAT 03: Memantau Laporan Nelayan (Distribusi Informasi)
*   **Tujuan:** Memastikan warga/nelayan dapat melihat informasi bahaya yang dilaporkan oleh warga lainnya.
*   **Langkah Pengujian:**
    1. Buka halaman **Riwayat** (*History*) atau cek pada *feed* laporan di halaman **Home**.
    2. Lakukan pergantian tab/filter antara "Laporan Saya" dan "Laporan Komunitas" (jika ada).
*   **Ekspektasi Hasil:** Kartu (*Card*) laporan muncul memuat informasi lokasi, waktu kejadian, tanda alam yang diamati, *badge* status keamanan (Merah/Hijau), serta deskripsi keputusannya.

### UAT 04: Aksesibilitas Saat Luring (PWA / Offline Mode)
*   **Tujuan:** Memastikan fitur *Progressive Web App* (Service Worker) berfungsi di kondisi sulit sinyal.
*   **Langkah Pengujian:**
    1. Saat aplikasi terbuka, matikan koneksi internet (Airplane mode).
    2. Pindah antar halaman (misal dari Home ke History atau Report).
    3. Tarik layar untuk menyegarkan (*refresh*).
*   **Ekspektasi Hasil:** Aplikasi tidak memunculkan halaman *error* jaringan bawaan *browser* (gambar dinosaurus). Pengguna tetap bisa melihat antarmuka dan laporan terakhir (dari *cache*).
