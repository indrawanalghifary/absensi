'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import HeaderSiswa from '../../components/HeaderSiswa';
import ProtectedRouteSiswa from '../../components/ProtectedRouteSiswa';
import Link from 'next/link';
import { 
  getUserAttendanceRecords, 
  getUserAttendanceStats, 
  checkTodayAttendance,
  AttendanceRecord as ServiceAttendanceRecord 
} from '../../lib/attendanceService';

interface AttendanceRecord {
  id: number;
  tanggal: string;
  waktu: string;
  status: string;
  metode: string;
  lokasi?: {
    latitude: number;
    longitude: number;
  };
  keterangan?: string;
}

interface AttendanceStats {
  totalHadir: number;
  totalTerlambat: number;
  totalIzin: number;
  totalSakit: number;
  totalAlpha: number;
  persentaseKehadiran: number;
}

export default function DashboardSiswaPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalHadir: 0,
    totalTerlambat: 0,
    totalIzin: 0,
    totalSakit: 0,
    totalAlpha: 0,
    persentaseKehadiran: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);

  const { user } = useAuth();

  // Load attendance data from Supabase
  const loadAttendanceData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const [records, stats, todayRecord] = await Promise.all([
        getUserAttendanceRecords(user.id, selectedMonth),
        getUserAttendanceStats(user.id, selectedMonth),
        checkTodayAttendance(user.id)
      ]);

      setAttendanceRecords(records.map(record => ({
        id: record.id,
        tanggal: record.tanggal,
        waktu: record.waktu,
        status: record.status,
        metode: record.metode,
        lokasi: record.latitude && record.longitude ? {
          latitude: record.latitude,
          longitude: record.longitude
        } : undefined,
        keterangan: record.keterangan
      })));

      setStats(stats);
      setTodayAttendance(todayRecord ? {
        id: todayRecord.id,
        tanggal: todayRecord.tanggal,
        waktu: todayRecord.waktu,
        status: todayRecord.status,
        metode: todayRecord.metode,
        lokasi: todayRecord.latitude && todayRecord.longitude ? {
          latitude: todayRecord.latitude,
          longitude: todayRecord.longitude
        } : undefined,
        keterangan: todayRecord.keterangan
      } : null);

    } catch (error: any) {
      console.error('Error loading attendance data:', error);
      // Fall back to empty data if there's an error
      setAttendanceRecords([]);
      setStats({
        totalHadir: 0,
        totalTerlambat: 0,
        totalIzin: 0,
        totalSakit: 0,
        totalAlpha: 0,
        persentaseKehadiran: 0,
      });
      setTodayAttendance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAttendanceData();
    }
  }, [selectedMonth, user]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      hadir: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hadir' },
      terlambat: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Terlambat' },
      izin: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Izin' },
      sakit: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Sakit' },
      alpha: { bg: 'bg-red-100', text: 'text-red-800', label: 'Alpha' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.alpha;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getMethodIcon = (metode: string) => {
    switch (metode) {
      case 'kamera':
        return 'ri-camera-line';
      case 'manual':
        return 'ri-edit-line';
      case 'izin':
        return 'ri-file-text-line';
      default:
        return 'ri-question-line';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRouteSiswa>
      <div className="min-h-screen bg-gray-50">
        <HeaderSiswa />
        
        <main className="p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Dashboard Siswa
              </h1>
              <p className="text-gray-600">
                Selamat datang, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
              </p>
            </div>

            {/* Today's Attendance Card */}
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Absensi Hari Ini</h2>
                {todayAttendance ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        todayAttendance.status === 'hadir' ? 'bg-green-100' : 
                        todayAttendance.status === 'terlambat' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <i className={`${getMethodIcon(todayAttendance.metode)} text-xl ${
                          todayAttendance.status === 'hadir' ? 'text-green-600' : 
                          todayAttendance.status === 'terlambat' ? 'text-yellow-600' : 'text-gray-600'
                        }`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(todayAttendance.tanggal)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {todayAttendance.waktu} • {getStatusBadge(todayAttendance.status)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold text-gray-900 capitalize">{todayAttendance.status}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="ri-calendar-check-line text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 mb-4">Belum absen hari ini</p>
                    <Link
                      href="/kamera"
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 inline-flex items-center"
                    >
                      <i className="ri-camera-line mr-2"></i>
                      Absen Sekarang
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-check-line text-green-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Hadir</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.totalHadir}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i className="ri-time-line text-yellow-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Terlambat</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.totalTerlambat}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-file-text-line text-blue-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Izin</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.totalIzin}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="ri-hospital-line text-orange-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Sakit</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.totalSakit}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="ri-close-line text-red-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Alpha</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.totalAlpha}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <i className="ri-percent-line text-indigo-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Kehadiran</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.persentaseKehadiran}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Month Filter and Attendance History */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">Riwayat Absensi</h2>
                  <div className="flex items-center space-x-4">
                    <label htmlFor="month-filter" className="text-sm text-gray-600">
                      Filter Bulan:
                    </label>
                    <input
                      id="month-filter"
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Memuat data...</p>
                  </div>
                ) : attendanceRecords.length > 0 ? (
                  <div className="space-y-4">
                    {attendanceRecords.map((record) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <i className={`${getMethodIcon(record.metode)} text-gray-600`}></i>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatDate(record.tanggal)}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-500">{record.waktu}</span>
                                <span className="text-gray-300">•</span>
                                {getStatusBadge(record.status)}
                                {record.lokasi && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <i className="ri-map-pin-line text-green-600 text-sm" title="Dengan GPS"></i>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {record.keterangan && (
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Keterangan:</p>
                              <p className="text-sm text-gray-700">{record.keterangan}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="ri-calendar-line text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Tidak ada data absensi untuk bulan ini</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/kamera"
                className="bg-indigo-600 text-white rounded-lg p-6 hover:bg-indigo-700 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="ri-camera-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Absen dengan Kamera</h3>
                    <p className="text-sm text-indigo-100">Absensi menggunakan foto dan GPS</p>
                  </div>
                </div>
              </Link>

              <div className="bg-gray-600 text-white rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="ri-file-text-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Ajukan Izin</h3>
                    <p className="text-sm text-gray-100">Kirim permohonan izin (Coming Soon)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRouteSiswa>
  );
}
