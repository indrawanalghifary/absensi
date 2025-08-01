import { supabase } from './supabaseClient';

export interface AttendanceData {
  userId: string;
  userEmail: string;
  tanggal: string;
  waktu: string;
  status: 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpha';
  metode: 'kamera' | 'manual' | 'izin';
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  photoUrl?: string;
  keterangan?: string;
}

export interface AttendanceRecord extends AttendanceData {
  id: number;
  createdAt: string;
}

// Upload photo to Supabase Storage
export const uploadAttendancePhoto = async (photoBlob: Blob, userId: string): Promise<string> => {
  const fileName = `attendance_${userId}_${Date.now()}.jpg`;
  const filePath = `attendance-photos/${fileName}`;

  const { data, error } = await supabase.storage
    .from('attendance-photos')
    .upload(filePath, photoBlob, {
      contentType: 'image/jpeg',
      upsert: false
    });

  if (error) {
    throw new Error('Gagal mengupload foto: ' + error.message);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('attendance-photos')
    .getPublicUrl(filePath);

  return publicUrl;
};

// Save attendance record
export const saveAttendanceRecord = async (attendanceData: AttendanceData): Promise<AttendanceRecord> => {
  const { data, error } = await supabase
    .from('attendance_records')
    .insert([{
      user_id: attendanceData.userId,
      user_email: attendanceData.userEmail,
      tanggal: attendanceData.tanggal,
      waktu: attendanceData.waktu,
      status: attendanceData.status,
      metode: attendanceData.metode,
      latitude: attendanceData.latitude,
      longitude: attendanceData.longitude,
      accuracy: attendanceData.accuracy,
      photo_url: attendanceData.photoUrl,
      keterangan: attendanceData.keterangan,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    throw new Error('Gagal menyimpan data absensi: ' + error.message);
  }

  return {
    id: data.id,
    userId: data.user_id,
    userEmail: data.user_email,
    tanggal: data.tanggal,
    waktu: data.waktu,
    status: data.status,
    metode: data.metode,
    latitude: data.latitude,
    longitude: data.longitude,
    accuracy: data.accuracy,
    photoUrl: data.photo_url,
    keterangan: data.keterangan,
    createdAt: data.created_at
  };
};

// Get attendance records for a specific user
export const getUserAttendanceRecords = async (
  userId: string, 
  month?: string
): Promise<AttendanceRecord[]> => {
  let query = supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', userId)
    .order('tanggal', { ascending: false });

  if (month) {
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;
    query = query.gte('tanggal', startDate).lte('tanggal', endDate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Gagal mengambil data absensi: ' + error.message);
  }

  return data.map(record => ({
    id: record.id,
    userId: record.user_id,
    userEmail: record.user_email,
    tanggal: record.tanggal,
    waktu: record.waktu,
    status: record.status,
    metode: record.metode,
    latitude: record.latitude,
    longitude: record.longitude,
    accuracy: record.accuracy,
    photoUrl: record.photo_url,
    keterangan: record.keterangan,
    createdAt: record.created_at
  }));
};

// Check if user already has attendance for today
export const checkTodayAttendance = async (userId: string): Promise<AttendanceRecord | null> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', userId)
    .eq('tanggal', today)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - user hasn't checked in today
      return null;
    }
    throw new Error('Gagal memeriksa absensi hari ini: ' + error.message);
  }

  return {
    id: data.id,
    userId: data.user_id,
    userEmail: data.user_email,
    tanggal: data.tanggal,
    waktu: data.waktu,
    status: data.status,
    metode: data.metode,
    latitude: data.latitude,
    longitude: data.longitude,
    accuracy: data.accuracy,
    photoUrl: data.photo_url,
    keterangan: data.keterangan,
    createdAt: data.created_at
  };
};

// Get attendance statistics for a user
export const getUserAttendanceStats = async (
  userId: string, 
  month?: string
): Promise<{
  totalHadir: number;
  totalTerlambat: number;
  totalIzin: number;
  totalSakit: number;
  totalAlpha: number;
  persentaseKehadiran: number;
}> => {
  let query = supabase
    .from('attendance_records')
    .select('status')
    .eq('user_id', userId);

  if (month) {
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;
    query = query.gte('tanggal', startDate).lte('tanggal', endDate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Gagal mengambil statistik absensi: ' + error.message);
  }

  const totalHadir = data.filter(r => r.status === 'hadir').length;
  const totalTerlambat = data.filter(r => r.status === 'terlambat').length;
  const totalIzin = data.filter(r => r.status === 'izin').length;
  const totalSakit = data.filter(r => r.status === 'sakit').length;
  const totalAlpha = data.filter(r => r.status === 'alpha').length;
  const totalRecords = data.length;
  const persentaseKehadiran = totalRecords > 0 
    ? Math.round(((totalHadir + totalTerlambat) / totalRecords) * 100) 
    : 0;

  return {
    totalHadir,
    totalTerlambat,
    totalIzin,
    totalSakit,
    totalAlpha,
    persentaseKehadiran,
  };
};

// Process camera attendance (upload photo and save record)
export const processCameraAttendance = async (
  photoBlob: Blob,
  location: { latitude: number; longitude: number; accuracy: number },
  userId: string,
  userEmail: string
): Promise<AttendanceRecord> => {
  try {
    // Check if user already checked in today
    const existingAttendance = await checkTodayAttendance(userId);
    if (existingAttendance) {
      throw new Error('Anda sudah melakukan absensi hari ini');
    }

    // Upload photo
    const photoUrl = await uploadAttendancePhoto(photoBlob, userId);

    // Determine status based on time
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const cutoffTime = '08:00'; // 8 AM cutoff for on-time attendance
    
    const status = currentTime <= cutoffTime ? 'hadir' : 'terlambat';

    // Prepare attendance data
    const attendanceData: AttendanceData = {
      userId,
      userEmail,
      tanggal: now.toISOString().split('T')[0],
      waktu: currentTime,
      status,
      metode: 'kamera',
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      photoUrl,
      keterangan: status === 'terlambat' ? 'Terlambat datang' : undefined
    };

    // Save to database
    const savedRecord = await saveAttendanceRecord(attendanceData);
    return savedRecord;

  } catch (error) {
    throw error;
  }
};
