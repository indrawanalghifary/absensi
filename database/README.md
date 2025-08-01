# Database Setup Guide untuk Sistem Absensi

## Langkah-langkah Setup Database

### 1. Login ke Supabase Dashboard
1. Buka [supabase.com](https://supabase.com)
2. Login ke akun Anda
3. Pilih project yang akan digunakan

### 2. Jalankan SQL Script
1. Di dashboard Supabase, pilih menu **SQL Editor**
2. Klik **New Query**
3. Copy dan paste seluruh isi file `database/attendance_records.sql`
4. Klik **Run** untuk menjalankan script

### 3. Verifikasi Setup
Setelah menjalankan script, pastikan hal-hal berikut sudah terbuat:

#### **Tabel yang Dibuat:**
- `attendance_records` - Menyimpan data absensi siswa
- `user_attendance_stats` - View untuk statistik absensi

#### **Storage Bucket:**
- `attendance-photos` - Menyimpan foto absensi

#### **Policies yang Dibuat:**
- RLS (Row Level Security) untuk tabel `attendance_records`
- Storage policies untuk bucket `attendance-photos`

### 4. Verifikasi di Dashboard

#### **Cek Tabel:**
1. Pilih menu **Table Editor**
2. Pastikan tabel `attendance_records` muncul dengan kolom:
   - `id` (bigserial, primary key)
   - `user_id` (uuid, foreign key ke auth.users)
   - `user_email` (text)
   - `tanggal` (date)
   - `waktu` (time)
   - `status` (text dengan constraint)
   - `metode` (text dengan constraint)
   - `latitude`, `longitude`, `accuracy` (decimal, nullable)
   - `photo_url` (text, nullable)
   - `keterangan` (text, nullable)
   - `created_at`, `updated_at` (timestamp)

#### **Cek Storage:**
1. Pilih menu **Storage**
2. Pastikan bucket `attendance-photos` sudah ada
3. Pastikan bucket berstatus **Public**

#### **Cek Authentication:**
1. Pilih menu **Authentication**
2. Pastikan RLS sudah enabled untuk tabel `attendance_records`

## Struktur Data

### Tabel `attendance_records`
```sql
CREATE TABLE attendance_records (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    user_email TEXT NOT NULL,
    tanggal DATE NOT NULL,
    waktu TIME NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('hadir', 'terlambat', 'izin', 'sakit', 'alpha')),
    metode TEXT NOT NULL CHECK (metode IN ('kamera', 'manual', 'izin')),
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    accuracy DECIMAL(10, 2) NULL,
    photo_url TEXT NULL,
    keterangan TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Constraint dan Index
- **Unique constraint**: `unique_user_date` - Mencegah duplikasi absensi per hari per user
- **Index**: Optimasi query berdasarkan `user_id` dan `tanggal`
- **Foreign key**: `user_id` mereferensi `auth.users(id)`

### Security Policies
- **Row Level Security**: User hanya bisa akses data absensi mereka sendiri
- **Storage policies**: User authenticated bisa upload dan view foto absensi

## Testing Database

### 1. Test Insert Data
```sql
INSERT INTO attendance_records (
    user_id, user_email, tanggal, waktu, status, metode, 
    latitude, longitude, accuracy
) VALUES (
    auth.uid(), 
    auth.email(), 
    CURRENT_DATE, 
    CURRENT_TIME, 
    'hadir', 
    'kamera',
    -6.2088, 
    106.8456, 
    10.5
);
```

### 2. Test Query Data
```sql
SELECT * FROM attendance_records WHERE user_id = auth.uid();
```

### 3. Test Statistics View
```sql
SELECT * FROM user_attendance_stats WHERE user_id = auth.uid();
```

## Troubleshooting

### Error: "relation does not exist"
- Pastikan script SQL sudah dijalankan dengan benar
- Cek apakah ada error saat menjalankan script

### Error: "row-level security policy"
- Pastikan user sudah login (authenticated)
- Cek apakah RLS policies sudah aktif

### Error: "bucket does not exist"
- Pastikan storage bucket `attendance-photos` sudah dibuat
- Cek policies untuk storage bucket

### Error: "permission denied for storage"
- Pastikan user sudah authenticated
- Cek storage policies

## Maintenance

### 1. Backup Data
Lakukan backup rutin data absensi:
```sql
SELECT * FROM attendance_records 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

### 2. Clean Up Old Photos
Hapus foto lama yang tidak terpakai (opsional):
- Monitor storage usage di dashboard
- Implementasikan cleanup job jika diperlukan

### 3. Monitor Performance
- Pantau query performance di dashboard
- Tambah index jika diperlukan berdasarkan pattern query

## Support
Jika ada masalah dengan setup database, cek:
1. [Supabase Documentation](https://supabase.com/docs)
2. [Supabase Discord Community](https://discord.supabase.com)
3. Error logs di dashboard Supabase
