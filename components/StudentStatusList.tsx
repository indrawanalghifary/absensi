'use client';
import { useState, useEffect } from 'react';
import { getInitials } from '../lib/dummyData';
import { fetchAbsensi } from '../lib/supabaseData';

interface StudentStatusData {
  id: number;
  name: string;
  class: string;
  status: 'Hadir' | 'Terlambat' | 'Sakit' | 'Alpha' | 'Izin';
  time: string;
  avatar: string;
}

export default function StudentStatusList() {
  const [filter, setFilter] = useState('Semua');
  const [studentStatusData, setStudentStatusData] = useState<StudentStatusData[]>([]);

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const loadTodayAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const absensiData = await fetchAbsensi();
      const todayAbsensi = absensiData.filter((item: any) => item.tanggal === today);
      const statusData: StudentStatusData[] = todayAbsensi.map((item: any) => ({
        id: item.siswaId,
        name: item.nama,
        class: item.kelas,
        status: getStatusDisplayName(item.status),
        time: item.waktu || '-',
        avatar: getInitials(item.nama)
      }));
      setStudentStatusData(statusData);
    } catch (err) {
      setStudentStatusData([]);
    }
  };

  const getStatusDisplayName = (status: string): 'Hadir' | 'Terlambat' | 'Sakit' | 'Alpha' | 'Izin' => {
    switch (status) {
      case 'hadir': return 'Hadir';
      case 'terlambat': return 'Terlambat';
      case 'sakit': return 'Sakit';
      case 'alpha': return 'Alpha';
      case 'izin': return 'Izin';
      default: return 'Hadir';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hadir': return 'bg-green-100 text-green-800';
      case 'Terlambat': return 'bg-yellow-100 text-yellow-800';
      case 'Sakit': return 'bg-blue-100 text-blue-800';
      case 'Alpha': return 'bg-red-100 text-red-800';
      case 'Izin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredData = filter === 'Semua' ? studentStatusData : studentStatusData.filter(s => s.status === filter);

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 lg:p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4 mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">Status Siswa Hari Ini</h3>
          <div className="text-xs lg:text-sm text-gray-500">
            Total: {studentStatusData.length} siswa
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Semua', 'Hadir', 'Terlambat', 'Sakit', 'Alpha', 'Izin'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 lg:p-6">
        <div className="space-y-3 lg:space-y-4 max-h-80 lg:max-h-96 overflow-y-auto">
          {filteredData.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs lg:text-sm">{student.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm lg:text-base font-medium text-gray-900 truncate">{student.name}</h4>
                  <p className="text-xs lg:text-sm text-gray-500">{student.class}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3 ml-3">
                <span className="text-xs lg:text-sm text-gray-600 hidden sm:inline">{student.time}</span>
                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}