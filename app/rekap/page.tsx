
'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useCallback } from 'react';
import { fetchAbsensi, fetchStudents } from '../../lib/supabaseData';

interface AbsensiData {
  id: number;
  tanggal: string;
  siswaId: number;
  nama: string;
  kelas: string;
  nis: string;
  status: string;
  waktu: string;
  keterangan: string;
}

export default function RekapPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [absensiData, setAbsensiData] = useState<AbsensiData[]>([]);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<any[]>([]);

  const loadMonthlyData = useCallback(async () => {
    setLoading(true);
    try {
      const [absensi, siswa] = await Promise.all([
        fetchAbsensi(),
        fetchStudents()
      ]);
      setStudents(siswa);
      const monthlyData = absensi.filter((item: AbsensiData) => item.tanggal.startsWith(selectedMonth));
      setAbsensiData(monthlyData);
    } catch (err) {
      setAbsensiData([]);
      setStudents([]);
    }
    setLoading(false);
  }, [selectedMonth]);

  useEffect(() => {
    loadMonthlyData();
  }, [selectedMonth, loadMonthlyData]);

  const getMonthlyStats = () => {
    const totalDays = new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]), 0).getDate();
    const uniqueDates = [...new Set(absensiData.map(item => item.tanggal))].length;

    const hadir = absensiData.filter(item => item.status === 'hadir').length;
    const terlambat = absensiData.filter(item => item.status === 'terlambat').length;
    const sakit = absensiData.filter(item => item.status === 'sakit').length;
    const alpha = absensiData.filter(item => item.status === 'alpha').length;
    const izin = absensiData.filter(item => item.status === 'izin').length;

    return {
      totalDays,
      activeDays: uniqueDates,
      hadir,
      terlambat,
      sakit,
      alpha,
      izin,
      total: absensiData.length
    };
  };

  const getStudentSummary = () => {
    const studentMap = new Map();
    students.forEach(student => {
      studentMap.set(student.id, {
        nama: student.nama,
        kelas: student.kelas,
        nis: student.nis,
        hadir: 0,
        terlambat: 0,
        sakit: 0,
        alpha: 0,
        izin: 0,
        total: 0
      });
    });
    absensiData.forEach(item => {
      if (studentMap.has(item.siswaId)) {
        const student = studentMap.get(item.siswaId);
        student[item.status]++;
        student.total++;
      }
    });
    return Array.from(studentMap.values())
      .filter(student => student.total > 0)
      .sort((a, b) => b.total - a.total);
  };

  const getDailyStats = () => {
    const dailyMap = new Map();

    absensiData.forEach(item => {
      if (!dailyMap.has(item.tanggal)) {
        dailyMap.set(item.tanggal, {
          tanggal: item.tanggal,
          hadir: 0,
          terlambat: 0,
          sakit: 0,
          alpha: 0,
          izin: 0,
          total: 0
        });
      }

      const daily = dailyMap.get(item.tanggal);
      daily[item.status]++;
      daily.total++;
    });

    return Array.from(dailyMap.values()).sort((a, b) => 
      new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
  };

  const exportToCSV = () => {
    const studentSummary = getStudentSummary();
    const csvContent = [
      ['Nama', 'Kelas', 'NIS', 'Hadir', 'Terlambat', 'Sakit', 'Alpha', 'Izin', 'Total'].join(','),
      ...studentSummary.map(student => 
        [student.nama, student.kelas, student.nis, student.hadir, student.terlambat, student.sakit, student.alpha, student.izin, student.total].join(',')
      )
    ].join('\n');

    // Replace all \n with real newlines for correct CSV export
    const csvWithRealNewlines = csvContent.replace(/\\n/g, '\n');

    const blob = new Blob([csvWithRealNewlines], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rekap-absensi-${selectedMonth}.csv`;
    link.click();
  };

  const stats = getMonthlyStats();
  const studentSummary = getStudentSummary();
  const dailyStats = getDailyStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Rekap Bulanan</h1>
              <p className="text-sm lg:text-base text-gray-600">Laporan kehadiran siswa per bulan dengan analisis lengkap</p>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 lg:py-3 rounded-lg font-medium hover:bg-green-700 cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 text-sm lg:text-base"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-download-line"></i>
              </div>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pilih Bulan</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan dan Tahun
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                />
              </div>
              <div className="flex items-end">
                <div className="bg-blue-50 p-3 rounded-lg w-full">
                  <p className="text-xs lg:text-sm text-blue-600 mb-1">Periode Terpilih</p>
                  <p className="text-sm lg:text-base font-semibold text-blue-900">
                    {new Date(selectedMonth + '-01').toLocaleDateString('id-ID', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i className="ri-calendar-line text-white text-sm lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">Total Hari Aktif</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.activeDays}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <i className="ri-user-line text-white text-sm lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">Hadir</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.hadir}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <i className="ri-time-line text-white text-sm lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">Terlambat</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.terlambat}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i className="ri-heart-pulse-line text-white text-sm lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">Sakit</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.sakit}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <i className="ri-user-unfollow-line text-white text-sm lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">Alpha</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.alpha}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 lg:p-6 rounded-xl shadow-sm border">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <i className="ri-user-star-line text-white text-sm lg:text-xl"></i>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">Izin</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.izin}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 lg:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Rekap Per Siswa</h3>
              </div>
              <div className="p-4 lg:p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : studentSummary.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-600">Belum ada data untuk bulan ini</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 lg:max-h-96 overflow-y-auto">
                    {studentSummary.map((student, index) => (
                      <div key={index} className="p-3 lg:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm lg:text-base font-medium text-gray-900 truncate">{student.nama}</h4>
                            <p className="text-xs lg:text-sm text-gray-500">{student.kelas} - {student.nis}</p>
                          </div>
                          <div className="text-right ml-3">
                            <p className="text-base lg:text-lg font-bold text-gray-900">{student.total}</p>
                            <p className="text-xs text-gray-500">total absensi</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 lg:gap-2 text-xs">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded whitespace-nowrap">
                            H: {student.hadir}
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded whitespace-nowrap">
                            T: {student.terlambat}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                            S: {student.sakit}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded whitespace-nowrap">
                            A: {student.alpha}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded whitespace-nowrap">
                            I: {student.izin}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 lg:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Rekap Harian</h3>
              </div>
              <div className="p-4 lg:p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : dailyStats.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-calendar-line text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-600">Belum ada data untuk bulan ini</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 lg:max-h-96 overflow-y-auto">
                    {dailyStats.map((day, index) => (
                      <div key={index} className="p-3 lg:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm lg:text-base font-medium text-gray-900">
                              {new Date(day.tanggal).toLocaleDateString('id-ID', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </h4>
                            <p className="text-xs lg:text-sm text-gray-500">{day.tanggal}</p>
                          </div>
                          <div className="text-right ml-3">
                            <p className="text-base lg:text-lg font-bold text-gray-900">{day.total}</p>
                            <p className="text-xs text-gray-500">total absensi</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 lg:gap-2 text-xs">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded whitespace-nowrap">
                            H: {day.hadir}
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded whitespace-nowrap">
                            T: {day.terlambat}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                            S: {day.sakit}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded whitespace-nowrap">
                            A: {day.alpha}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded whitespace-nowrap">
                            I: {day.izin}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
