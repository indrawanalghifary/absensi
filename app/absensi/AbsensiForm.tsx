
'use client';
import { useState } from 'react';
import { STUDENTS_DATA } from '../../lib/dummyData';

interface AbsensiFormProps {
  selectedDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AbsensiForm({ selectedDate, onClose, onSuccess }: AbsensiFormProps) {
  const [formData, setFormData] = useState({
    siswaId: '',
    status: 'hadir',
    waktu: new Date().toTimeString().slice(0, 5),
    keterangan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi proses submit
    setTimeout(() => {
      const siswa = STUDENTS_DATA.find(s => s.id === parseInt(formData.siswaId));
      if (siswa) {
        // Simpan ke localStorage untuk simulasi database
        const existingData = JSON.parse(localStorage.getItem('absensiData') || '[]');
        const newAbsensi = {
          id: Date.now(),
          tanggal: selectedDate,
          siswaId: siswa.id,
          nama: siswa.nama,
          kelas: siswa.kelas,
          nis: siswa.nis,
          status: formData.status,
          waktu: formData.waktu,
          keterangan: formData.keterangan,
          timestamp: new Date().toISOString()
        };
        existingData.push(newAbsensi);
        localStorage.setItem('absensiData', JSON.stringify(existingData));
      }

      setIsSubmitting(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 lg:p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Input Absensi</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Siswa
            </label>
            <div className="relative">
              <select
                value={formData.siswaId}
                onChange={(e) => setFormData({...formData, siswaId: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 text-sm lg:text-base"
                required
              >
                <option value="">-- Pilih Siswa --</option>
                {STUDENTS_DATA.map(siswa => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.nama} - {siswa.kelas}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Kehadiran
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'hadir', label: 'Hadir', color: 'text-green-700 bg-green-50 border-green-200' },
                { value: 'terlambat', label: 'Terlambat', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
                { value: 'sakit', label: 'Sakit', color: 'text-blue-700 bg-blue-50 border-blue-200' },
                { value: 'alpha', label: 'Alpha', color: 'text-red-700 bg-red-50 border-red-200' }
              ].map(status => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setFormData({...formData, status: status.value})}
                  className={`p-2 lg:p-3 border rounded-lg text-xs lg:text-sm font-medium cursor-pointer whitespace-nowrap ${
                    formData.status === status.value
                      ? status.color
                      : 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waktu
            </label>
            <input
              type="time"
              value={formData.waktu}
              onChange={(e) => setFormData({...formData, waktu: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan (Opsional)
            </label>
            <textarea
              value={formData.keterangan}
              onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
              rows={3}
              maxLength={500}
              placeholder="Tambahkan keterangan jika diperlukan..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.keterangan.length}/500 karakter
            </p>
          </div>

          <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full lg:flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap text-sm lg:text-base"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.siswaId}
              className="w-full lg:flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap text-sm lg:text-base"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Absensi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
