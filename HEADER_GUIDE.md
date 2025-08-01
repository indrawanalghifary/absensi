# Header Components untuk Sistem Absensi

Sistem ini menggunakan dua header yang berbeda untuk membedakan antara interface admin dan siswa.

## 1. Header Admin (`Header.tsx`)

### Digunakan di halaman:
- `/` (Dashboard Admin)
- `/absensi` (Absensi Harian)
- `/rekap` (Rekap Bulanan) 
- `/siswa` (Data Siswa)

### Fitur:
- **Branding**: "AbsensiKu Admin"
- **Navigasi**: Link ke semua fitur admin
- **Status**: Menampilkan "Status: Admin" di dropdown
- **Warna**: Menggunakan tema biru dengan background putih
- **Akses**: Fitur lengkap untuk manajemen absensi

### Menu Navigasi:
- Dashboard Admin
- Absensi Harian  
- Rekap Bulanan
- Data Siswa

## 2. Header Siswa (`HeaderSiswa.tsx`)

### Digunakan di halaman:
- `/dashboardsiswa` (Dashboard Personal Siswa)
- `/kamera` (Absensi dengan Kamera)

### Fitur:
- **Branding**: "AbsensiKu Siswa"
- **Navigasi**: Link hanya ke fitur siswa
- **Status**: Menampilkan "Status: Siswa" di dropdown
- **Warna**: Menggunakan gradient indigo-purple yang menarik
- **Akses**: Fitur terbatas sesuai kebutuhan siswa

### Menu Navigasi:
- Dashboard (Personal)
- Absen Kamera

## Perbedaan Visual

### Header Admin:
```
- Background: Putih dengan shadow
- Text: Abu-abu dengan hover biru
- Logo: "AbsensiKu Admin" 
- Style: Professional, clean
```

### Header Siswa:
```
- Background: Gradient indigo-purple
- Text: Putih dengan transparansi
- Logo: "AbsensiKu Siswa"
- Style: Modern, friendly
```

## Implementasi

### Menggunakan Header Admin:
```tsx
import Header from '../../components/Header';

// Di dalam component
<Header />
```

### Menggunakan Header Siswa:
```tsx
import HeaderSiswa from '../../components/HeaderSiswa';

// Di dalam component
<HeaderSiswa />
```

## User Experience

### Untuk Admin:
- Interface yang fokus pada produktivitas
- Akses ke semua data dan fitur manajemen
- Tampilan yang profesional dan formal

### Untuk Siswa:
- Interface yang ramah dan mudah digunakan
- Fokus pada fitur absensi personal
- Tampilan yang modern dan menarik

## Security & Access Control

Kedua header menggunakan `useAuth()` hook yang sama untuk:
- Menampilkan informasi user yang login
- Fungsi logout
- Proteksi akses berdasarkan autentikasi

Namun pembedaan akses dilakukan melalui:
- Route yang berbeda (`/` vs `/dashboardsiswa`)
- Database queries yang difilter berdasarkan `user_id`
- UI yang disesuaikan dengan role

## Maintenance

Ketika menambah fitur baru:
1. **Fitur Admin**: Tambahkan link di `Header.tsx`
2. **Fitur Siswa**: Tambahkan link di `HeaderSiswa.tsx`
3. **Fitur Universal**: Pertimbangkan untuk menambah di kedua header

## Responsive Design

Kedua header sudah responsive dengan:
- Desktop navigation (lg:flex)
- Mobile hamburger menu
- Responsive typography dan spacing
- Touch-friendly buttons untuk mobile
