'use client';
import { useState, useEffect } from 'react';
import { fetchAbsensi, deleteAbsensi } from '../../lib/supabaseData';

interface AbsensiTableProps {
  selectedDate: string;
  refresh: number;
}

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
  timestamp: string;
}

export default function AbsensiTable({ selectedDate, refresh }: AbsensiTableProps) {
  const [absensiData, setAbsensiData] = useState<AbsensiData[]>([]);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAbsensiData();
    // eslint-disable-next-line
  }, [selectedDate, refresh]);

  const loadAbsensiData = async () => {
    const data = await fetchAbsensi();
    const filteredByDate = data.filter((item: AbsensiData) => item.tanggal === selectedDate);
    setAbsensiData(filteredByDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir': return 'bg-green-100 text-green-800';
      case 'terlambat': return 'bg-yellow-100 text-yellow-800';
      case 'sakit': return 'bg-blue-100 text-blue-800';
      case 'alpha': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'hadir': return 'Hadir';
      case 'terlambat': return 'Terlambat';
      case 'sakit': return 'Sakit';
      case 'alpha': return 'Alpha';
      default: return status;
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data absensi ini?')) {
      await deleteAbsensi(id);
      loadAbsensiData();
    }
  };

  const filteredData = absensiData.filter(item => {
    const matchesStatus = filterStatus === 'semua' || item.status === filterStatus;
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nis.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatistics = () => {
    const hadir = absensiData.filter(item => item.status === 'hadir').length;
    const terlambat = absensiData.filter(item => item.status === 'terlambat').length;
    const sakit = absensiData.filter(item => item.status === 'sakit').length;
    const alpha = absensiData.filter(item => item.status === 'alpha').length;

    return { hadir, terlambat, sakit, alpha, total: absensiData.length };
  };

  const stats = getStatistics();

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 lg:p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Data Absensi</h3>
            <p className="text-sm text-gray-600">
              {new Date(selectedDate).toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-sm text-gray-600">Total Data</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-white text-sm"></i>
              </div>
              <div>
                <p className="text-xs lg:text-sm text-green-600">Hadir</p>
                <p className="font-bold text-green-900">{stats.hadir}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-white text-sm"></i>
              </div>
              <div>
                <p className="text-xs lg:text-sm text-yellow-600">Terlambat</p>
                <p className="font-bold text-yellow-900">{stats.terlambat}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="ri-heart-pulse-line text-white text-sm"></i>
              </div>
              <div>
                <p className="text-xs lg:text-sm text-blue-600">Sakit</p>
                <p className="font-bold text-blue-900">{stats.sakit}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <i className="ri-user-unfollow-line text-white text-sm"></i>
              </div>
              <div>
                <p className="text-xs lg:text-sm text-red-600">Alpha</p>
                <p className="font-bold text-red-900">{stats.alpha}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line text-gray-400 text-sm"></i>
              </div>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari siswa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'semua', label: 'Semua' },
              { value: 'hadir', label: 'Hadir' },
              { value: 'terlambat', label: 'Terlambat' },
              { value: 'sakit', label: 'Sakit' },
              { value: 'alpha', label: 'Alpha' }
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap cursor-pointer ${
                  filterStatus === status.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-file-list-line text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-600">Belum ada data absensi untuk tanggal ini</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {item.nama.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                            <div className="text-sm text-gray-500">NIS: {item.nis}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.kelas}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.waktu}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {item.keterangan || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            <i className="ri-delete-bin-line"></i>
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {item.nama.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{item.nama}</div>
                        <div className="text-xs text-gray-500">NIS: {item.nis}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer p-2"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-delete-bin-line"></i>
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Kelas</span>
                      <span className="font-medium text-gray-900">{item.kelas}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Waktu</span>
                      <span className="font-medium text-gray-900">{item.waktu}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                    {item.keterangan && (
                      <div className="text-xs text-gray-500 max-w-32 truncate">
                        {item.keterangan}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
