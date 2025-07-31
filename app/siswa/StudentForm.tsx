
'use client';
import { useState } from 'react';
import { KELAS_OPTIONS, WALI_KELAS_OPTIONS } from '../../lib/dummyData';

interface Student {
  id: number;
  nama: string;
  nis: string;
  kelas: string;
  jenisKelamin: string;
  alamat: string;
  telepon: string;
  email: string;
  tanggalLahir: string;
  waliKelas: string;
  status: string;
}

interface StudentFormProps {
  student?: Student | null;
  onClose: () => void;
  onSuccess: (student: Omit<Student, 'id'>) => void;
}

export default function StudentForm({ student, onClose, onSuccess }: StudentFormProps) {
  const [formData, setFormData] = useState({
    nama: student?.nama || '',
    nis: student?.nis || '',
    kelas: student?.kelas || '',
    jenisKelamin: student?.jenisKelamin || 'L',
    alamat: student?.alamat || '',
    telepon: student?.telepon || '',
    email: student?.email || '',
    tanggalLahir: student?.tanggalLahir || '',
    waliKelas: student?.waliKelas || '',
    status: student?.status || 'Aktif'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama siswa wajib diisi';
    }

    if (!formData.nis.trim()) {
      newErrors.nis = 'NIS wajib diisi';
    } else if (formData.nis.length < 8) {
      newErrors.nis = 'NIS minimal 8 karakter';
    }

    if (!formData.kelas) {
      newErrors.kelas = 'Kelas wajib dipilih';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }

    if (!formData.telepon.trim()) {
      newErrors.telepon = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9+\\-\\s()]+$/.test(formData.telepon)) {
      newErrors.telepon = 'Format nomor telepon tidak valid';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.tanggalLahir) {
      newErrors.tanggalLahir = 'Tanggal lahir wajib diisi';
    }

    if (!formData.waliKelas) {
      newErrors.waliKelas = 'Wali kelas wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulasi proses submit
    setTimeout(() => {
      onSuccess(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-4 lg:p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {student ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => handleInputChange('nama', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base ${
                  errors.nama ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.nama && (
                <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIS <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nis}
                onChange={(e) => handleInputChange('nis', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base ${
                  errors.nis ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Masukkan NIS"
              />
              {errors.nis && (
                <p className="text-red-500 text-sm mt-1">{errors.nis}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kelas <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.kelas}
                  onChange={(e) => handleInputChange('kelas', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-8 text-sm lg:text-base ${
                    errors.kelas ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="">-- Pilih Kelas --</option>
                  {KELAS_OPTIONS.map(kelas => (
                    <option key={kelas} value={kelas}>{kelas}</option>
                  ))}
                </select>
              </div>
              {errors.kelas && (
                <p className="text-red-500 text-sm mt-1">{errors.kelas}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'L', label: 'Laki-laki' },
                  { value: 'P', label: 'Perempuan' }
                ].map(gender => (
                  <button
                    key={gender.value}
                    type="button"
                    onClick={() => handleInputChange('jenisKelamin', gender.value)}
                    className={`p-3 border rounded-lg text-xs lg:text-sm font-medium cursor-pointer whitespace-nowrap ${
                      formData.jenisKelamin === gender.value
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {gender.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.alamat}
              onChange={(e) => handleInputChange('alamat', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base ${
                errors.alamat ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              rows={3}
              maxLength={500}
              placeholder="Masukkan alamat lengkap"
            />
            {errors.alamat && (
              <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.alamat.length}/500 karakter
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.telepon}
                onChange={(e) => handleInputChange('telepon', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base ${
                  errors.telepon ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Masukkan nomor telepon"
              />
              {errors.telepon && (
                <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Masukkan email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => handleInputChange('tanggalLahir', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base ${
                  errors.tanggalLahir ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.tanggalLahir && (
                <p className="text-red-500 text-sm mt-1">{errors.tanggalLahir}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wali Kelas <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.waliKelas}
                  onChange={(e) => handleInputChange('waliKelas', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-8 text-sm lg:text-base ${
                    errors.waliKelas ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="">-- Pilih Wali Kelas --</option>
                  {WALI_KELAS_OPTIONS.map(wali => (
                    <option key={wali} value={wali}>{wali}</option>
                  ))}
                </select>
              </div>
              {errors.waliKelas && (
                <p className="text-red-500 text-sm mt-1">{errors.waliKelas}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Siswa
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'Aktif', label: 'Aktif' },
                { value: 'Nonaktif', label: 'Nonaktif' }
              ].map(status => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => handleInputChange('status', status.value)}
                  className={`p-3 border rounded-lg text-xs lg:text-sm font-medium cursor-pointer whitespace-nowrap ${
                    formData.status === status.value
                      ? status.value === 'Aktif' 
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-6 border-t sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap font-medium text-sm lg:text-base"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap font-medium text-sm lg:text-base"
            >
              {isSubmitting ? 'Menyimpan...' : student ? 'Update Data' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
