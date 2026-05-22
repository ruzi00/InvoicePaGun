Pembuat Invoice Les Otomatis - 2 Mode

Mode:
1. Payment in Front
2. Payment After

Sumber data utama:
- Siswa: Google Sheet (default sudah diisi URL) atau REKAP DATA SISWA.csv
- Tarif: tarif.csv
- Diskon durasi: diskon_durasi.csv
- Rekening guru: bank_guru.csv atau file Excel .xlsx
- Absensi (khusus Payment After): CSV absensi atau Google Sheet absensi

Mode cloud:
- GitHub Pages: app ini bisa dipublish sebagai static site tanpa backend.
- Firebase: sumber data dan invoice terakhir bisa disimpan ke Firestore.

Cara pakai ringkas:
1. Buka index.html dari local server (disarankan Live Server).
2. Muat data siswa (Google Sheet atau file CSV).
3. Muat tarif, diskon durasi, dan rekening guru.
4. Pilih mode pembayaran.

Payment in Front:
1. Pilih siswa, pengajar, rekening, dan mata pelajaran.
2. Isi tanggal awal minggu.
3. Pilih hari aktif + jam mulai/jam selesai per hari.
4. Klik "Generate Jadwal 1 Minggu".
5. Cek tabel sesi, tambahkan catatan bila perlu.
6. Klik "Generate Invoice" lalu "Cetak / Simpan PDF".

Payment After:
1. Pindah ke mode Payment After.
2. Muat CSV absensi atau URL Google Sheet absensi.
3. Pilih siswa dari dropdown.
4. Sistem menampilkan sesi yang attended oleh siswa tersebut.
5. Cek baris, ubah peserta/catatan jika perlu.
6. Klik "Generate Invoice" lalu "Cetak / Simpan PDF".

Format file penting:

1) tarif.csv
jenis_hari,jumlah_peserta,tarif_per_jam
senin-jumat,1,80000
sabtu,1,90000
minggu,1,100000

2) diskon_durasi.csv
min_durasi,max_durasi,diskon_persen
0,1.49,0
1.5,1.99,5
2,2.99,10
3,99,15

3) bank_guru.csv
nama_pengajar,label_rekening,bank,nomor_rekening,atas_nama
Rensie,Utama,BCA,1234567890,Rensie P
Rensie,Cadangan,BNI,9988776655,Rensie P
Trias,Utama,Mandiri,1122334455,Trias A
Trias,Cadangan,BRI,5566778899,Trias A

Catatan teknis:
- Invoice menggunakan orientasi landscape A4.
- Background invoice menggunakan file Template INVOICE Background.png.
- Jika Google Sheet private atau belum dibuka aksesnya, proses fetch bisa gagal.

Setup GitHub Pages + Firebase:
1. Push folder ini ke GitHub.
2. Aktifkan GitHub Pages dari branch utama atau pakai workflow yang disediakan.
3. Di Firebase Console, buat project baru dan aktifkan Anonymous Authentication + Firestore.
4. Salin konfigurasi Web App ke panel Firebase Sync di halaman app.
5. Klik Hubungkan Firebase, lalu Simpan Data ke Firebase.

Koleksi Firebase yang dipakai:
- invoice_sources: menyimpan CSV sumber data per jenis (students, pricing, discount, bank, holiday, attendance).
- invoice_records: menyimpan invoice terakhir yang digenerate dari browser.
