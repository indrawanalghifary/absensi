-- SQL untuk membuat tabel attendance_records di Supabase

-- 1. Buat tabel attendance_records
CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 2. Buat index untuk optimasi query
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_tanggal ON attendance_records(tanggal);
CREATE INDEX IF NOT EXISTS idx_attendance_user_tanggal ON attendance_records(user_id, tanggal);

-- 3. Buat storage bucket untuk foto absensi
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attendance-photos', 'attendance-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Buat policy untuk storage bucket
CREATE POLICY "Allow authenticated users to upload attendance photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'attendance-photos' AND 
    auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view attendance photos" ON storage.objects
FOR SELECT USING (
    bucket_id = 'attendance-photos' AND 
    auth.role() = 'authenticated'
);

-- 5. Buat RLS (Row Level Security) policies untuk attendance_records
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own attendance records
CREATE POLICY "Users can view their own attendance records" ON attendance_records
FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own attendance records
CREATE POLICY "Users can insert their own attendance records" ON attendance_records
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own attendance records (optional)
CREATE POLICY "Users can update their own attendance records" ON attendance_records
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own attendance records (optional)
CREATE POLICY "Users can delete their own attendance records" ON attendance_records
FOR DELETE USING (auth.uid() = user_id);

-- 6. Buat function untuk update timestamp otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Buat trigger untuk update timestamp otomatis
CREATE TRIGGER update_attendance_records_updated_at 
    BEFORE UPDATE ON attendance_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Buat constraint untuk mencegah duplikasi absensi per hari
ALTER TABLE attendance_records 
ADD CONSTRAINT unique_user_date 
UNIQUE (user_id, tanggal);

-- 9. Insert sample data (opsional, untuk testing)
-- INSERT INTO attendance_records (user_id, user_email, tanggal, waktu, status, metode, latitude, longitude, accuracy)
-- VALUES 
--     (auth.uid(), 'user@example.com', CURRENT_DATE, '08:00', 'hadir', 'kamera', -6.2088, 106.8456, 10.5),
--     (auth.uid(), 'user@example.com', CURRENT_DATE - INTERVAL '1 day', '08:15', 'terlambat', 'kamera', -6.2088, 106.8456, 15.2);

-- 10. Buat view untuk statistik attendance (opsional)
CREATE OR REPLACE VIEW user_attendance_stats AS
SELECT 
    user_id,
    user_email,
    DATE_TRUNC('month', tanggal) as bulan,
    COUNT(*) as total_absensi,
    COUNT(CASE WHEN status = 'hadir' THEN 1 END) as total_hadir,
    COUNT(CASE WHEN status = 'terlambat' THEN 1 END) as total_terlambat,
    COUNT(CASE WHEN status = 'izin' THEN 1 END) as total_izin,
    COUNT(CASE WHEN status = 'sakit' THEN 1 END) as total_sakit,
    COUNT(CASE WHEN status = 'alpha' THEN 1 END) as total_alpha,
    ROUND(
        (COUNT(CASE WHEN status IN ('hadir', 'terlambat') THEN 1 END) * 100.0 / COUNT(*)), 2
    ) as persentase_kehadiran
FROM attendance_records
GROUP BY user_id, user_email, DATE_TRUNC('month', tanggal);

-- Grant access ke view untuk authenticated users
GRANT SELECT ON user_attendance_stats TO authenticated;
