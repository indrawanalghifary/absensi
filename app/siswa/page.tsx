
'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';
import StudentForm from './StudentForm';
import { getInitials } from '../../lib/dummyData';
import { fetchStudents, addStudent, updateStudent, deleteStudent } from '../../lib/supabaseData';

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
  foto?: string;
}

export default function SiswaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');

  useEffect(() => {
    fetchStudents().then(setStudents);
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, filterKelas, filterStatus]);

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nis.includes(searchTerm) ||
        student.kelas.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterKelas !== 'semua') {
      filtered = filtered.filter(student => student.kelas === filterKelas);
    }

    if (filterStatus !== 'semua') {
      filtered = filtered.filter(student => student.status.toLowerCase() === filterStatus);
    }

    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      try {
        await deleteStudent(id);
        const updated = await fetchStudents();
        setStudents(updated);
      } catch (err) {
        alert('Gagal menghapus siswa!');
      }
    }
  };

  const handleFormSuccess = async (studentData: Omit<Student, 'id'>) => {
    try {
      if (editingStudent) {
        await updateStudent({ ...studentData, id: editingStudent.id });
      } else {
        // id di Supabase auto increment, jadi tidak perlu set manual
        await addStudent(studentData as Student);
      }
      const updated = await fetchStudents();
      setStudents(updated);
      setShowForm(false);
    } catch (err) {
      alert('Gagal menyimpan data siswa!');
    }
  };

  const getUniqueKelas = () => {
    const kelasSet = new Set(students.map(student => student.kelas));
    return Array.from(kelasSet).sort();
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Nama', 'NIS', 'Kelas', 'Jenis Kelamin', 'Alamat', 'Telepon', 'Email', 'Tanggal Lahir', 'Wali Kelas', 'Status'].join(','),
      ...students.map(student =>
        [student.nama, student.nis, student.kelas, student.jenisKelamin, student.alamat, student.telepon, student.email, student.tanggalLahir, student.waliKelas, student.status].join(',')
      )
    ].join('\n');

    // Replace all \n with real newlines for correct CSV export
    const csvWithRealNewlines = csvContent.replace(/\\n/g, '\n');

    const blob = new Blob([csvWithRealNewlines], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data-siswa.csv';
    link.click();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

      <main className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Data Siswa</h1>
              <p className="text-sm lg:text-base text-gray-600">Kelola informasi lengkap data siswa</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 text-sm"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-download-line"></i>
                </div>
                <span>Export</span>
              </button>
              <button
                onClick={handleAddStudent}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 text-sm"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-add-line"></i>
                </div>
                <span>Tambah Siswa</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border mb-4 lg:mb-6">
          <div className="p-4 lg:p-6 border-b">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div className="bg-blue-50 p-3 lg:p-4 rounded-lg">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="ri-user-line text-white text-sm lg:text-base"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-blue-600">Total Siswa</p>
                    <p className="text-lg lg:text-2xl font-bold text-blue-900">{students.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-3 lg:p-4 rounded-lg">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <i className="ri-user-line text-white text-sm lg:text-base"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-green-600">Siswa Aktif</p>
                    <p className="text-lg lg:text-2xl font-bold text-green-900">
                      {students.filter(s => s.status === 'Aktif').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-3 lg:p-4 rounded-lg">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <i className="ri-men-line text-white text-sm lg:text-base"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-purple-600">Laki-laki</p>
                    <p className="text-lg lg:text-2xl font-bold text-purple-900">
                      {students.filter(s => s.jenisKelamin === 'L').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-pink-50 p-3 lg:p-4 rounded-lg">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <i className="ri-women-line text-white text-sm lg:text-base"></i>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-pink-600">Perempuan</p>
                    <p className="text-lg lg:text-2xl font-bold text-pink-900">
                      {students.filter(s => s.jenisKelamin === 'P').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-6">
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-4 lg:gap-4 mb-4 lg:mb-6">
              <div className="relative lg:col-span-2">
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
                  className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="relative">
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
                >
                  <option value="semua">Semua Kelas</option>
                  {getUniqueKelas().map(kelas => (
                    <option key={kelas} value={kelas}>{kelas}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
                >
                  <option value="semua">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <p className="text-sm text-gray-600">
                Menampilkan {filteredStudents.length} dari {students.length} siswa
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-600 mb-2">Tidak ada data siswa ditemukan</p>
              <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {getInitials(student.nama)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{student.nama}</h3>
                        <p className="text-sm text-gray-500">NIS: {student.nis}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      student.status === 'Aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 flex items-center justify-center mr-2">
                        <i className="ri-school-line text-gray-400"></i>
                      </div>
                      <span>{student.kelas} - {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 flex items-center justify-center mr-2">
                        <i className="ri-phone-line text-gray-400"></i>
                      </div>
                      <span>{student.telepon}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 flex items-center justify-center mr-2">
                        <i className="ri-user-heart-line text-gray-400"></i>
                      </div>
                      <span>Wali Kelas: {student.waliKelas}</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-3 border-t">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer text-sm flex items-center space-x-1"
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-edit-line"></i>
                      </div>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer text-sm flex items-center space-x-1"
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-delete-bin-line"></i>
                      </div>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border">
          <div className="overflow-x-auto">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-600 mb-2">Tidak ada data siswa ditemukan</p>
                <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wali Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {getInitials(student.nama)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.nama}</div>
                            <div className="text-sm text-gray-500">
                              {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.nis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.kelas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.telepon}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.waliKelas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          student.status === 'Aktif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            title="Edit"
                          >
                            <div className="w-8 h-8 flex items-center justify-center">
                              <i className="ri-edit-line"></i>
                            </div>
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Hapus"
                          >
                            <div className="w-8 h-8 flex items-center justify-center">
                              <i className="ri-delete-bin-line"></i>
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showForm && (
          <StudentForm
            student={editingStudent}
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />
        )}
      </main>
    </div>
    </ProtectedRoute>
  );
}
