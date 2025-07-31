
// Data terpusat untuk seluruh aplikasi
export interface Student {
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

export interface AbsensiRecord {
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

// Data siswa yang konsisten untuk seluruh aplikasi
export const STUDENTS_DATA: Student[] = [
  {
    id: 1,
    nama: 'Ahmad Rizki Maulana',
    nis: '12345001',
    kelas: 'XII IPA 1',
    jenisKelamin: 'L',
    alamat: 'Jl. Merdeka No. 123, Kebayoran Baru, Jakarta Selatan',
    telepon: '081234567890',
    email: 'ahmad.rizki@email.com',
    tanggalLahir: '2005-03-15',
    waliKelas: 'Bu Sari Indrawati',
    status: 'Aktif'
  },
  {
    id: 2,
    nama: 'Sari Dewi Anggraini',
    nis: '12345002',
    kelas: 'XII IPA 1',
    jenisKelamin: 'P',
    alamat: 'Jl. Sudirman No. 456, Menteng, Jakarta Pusat',
    telepon: '081234567891',
    email: 'sari.dewi@email.com',
    tanggalLahir: '2005-07-22',
    waliKelas: 'Bu Sari Indrawati',
    status: 'Aktif'
  },
  {
    id: 3,
    nama: 'Budi Santoso Wijaya',
    nis: '12345003',
    kelas: 'XII IPA 2',
    jenisKelamin: 'L',
    alamat: 'Jl. Thamrin No. 789, Tanah Abang, Jakarta Pusat',
    telepon: '081234567892',
    email: 'budi.santoso@email.com',
    tanggalLahir: '2005-01-10',
    waliKelas: 'Pak Budi Setiawan',
    status: 'Aktif'
  },
  {
    id: 4,
    nama: 'Maya Sari Putri',
    nis: '12345004',
    kelas: 'XII IPS 1',
    jenisKelamin: 'P',
    alamat: 'Jl. Gatot Subroto No. 321, Setiabudi, Jakarta Selatan',
    telepon: '081234567893',
    email: 'maya.sari@email.com',
    tanggalLahir: '2005-09-05',
    waliKelas: 'Bu Maya Kartika',
    status: 'Aktif'
  },
  {
    id: 5,
    nama: 'Doni Prasetyo Hadi',
    nis: '12345005',
    kelas: 'XII IPS 2',
    jenisKelamin: 'L',
    alamat: 'Jl. Kuningan No. 654, Kuningan, Jakarta Selatan',
    telepon: '081234567894',
    email: 'doni.prasetyo@email.com',
    tanggalLahir: '2004-12-18',
    waliKelas: 'Pak Doni Firmansyah',
    status: 'Aktif'
  },
  {
    id: 6,
    nama: 'Lisa Permata Sari',
    nis: '12345006',
    kelas: 'XII IPA 1',
    jenisKelamin: 'P',
    alamat: 'Jl. Rasuna Said No. 987, Kuningan, Jakarta Selatan',
    telepon: '081234567895',
    email: 'lisa.permata@email.com',
    tanggalLahir: '2005-04-30',
    waliKelas: 'Bu Sari Indrawati',
    status: 'Aktif'
  },
  {
    id: 7,
    nama: 'Andi Wijaya Kusuma',
    nis: '12345007',
    kelas: 'XII IPA 2',
    jenisKelamin: 'L',
    alamat: 'Jl. Pahlawan No. 147, Cempaka Putih, Jakarta Pusat',
    telepon: '081234567896',
    email: 'andi.wijaya@email.com',
    tanggalLahir: '2005-06-12',
    waliKelas: 'Pak Budi Setiawan',
    status: 'Aktif'
  },
  {
    id: 8,
    nama: 'Sinta Maharani',
    nis: '12345008',
    kelas: 'XII IPS 1',
    jenisKelamin: 'P',
    alamat: 'Jl. Veteran No. 258, Gambir, Jakarta Pusat',
    telepon: '081234567897',
    email: 'sinta.maharani@email.com',
    tanggalLahir: '2005-08-17',
    waliKelas: 'Bu Maya Kartika',
    status: 'Aktif'
  },
  {
    id: 9,
    nama: 'Rizky Firmansyah',
    nis: '12345009',
    kelas: 'XII IPS 2',
    jenisKelamin: 'L',
    alamat: 'Jl. Proklamasi No. 369, Menteng, Jakarta Pusat',
    telepon: '081234567898',
    email: 'rizky.firmansyah@email.com',
    tanggalLahir: '2005-02-28',
    waliKelas: 'Pak Doni Firmansyah',
    status: 'Aktif'
  },
  {
    id: 10,
    nama: 'Putri Anggraini',
    nis: '12345010',
    kelas: 'XII IPA 1',
    jenisKelamin: 'P',
    alamat: 'Jl. Diponegoro No. 741, Menteng, Jakarta Pusat',
    telepon: '081234567899',
    email: 'putri.anggraini@email.com',
    tanggalLahir: '2005-05-20',
    waliKelas: 'Bu Sari Indrawati',
    status: 'Aktif'
  },
  {
    id: 11,
    nama: 'Kevin Pratama',
    nis: '12345011',
    kelas: 'XII IPA 2',
    jenisKelamin: 'L',
    alamat: 'Jl. Kemang Raya No. 852, Kemang, Jakarta Selatan',
    telepon: '081234567800',
    email: 'kevin.pratama@email.com',
    tanggalLahir: '2005-11-03',
    waliKelas: 'Pak Budi Setiawan',
    status: 'Aktif'
  },
  {
    id: 12,
    nama: 'Indira Safitri',
    nis: '12345012',
    kelas: 'XII IPS 1',
    jenisKelamin: 'P',
    alamat: 'Jl. Senopati No. 963, Kebayoran Baru, Jakarta Selatan',
    telepon: '081234567801',
    email: 'indira.safitri@email.com',
    tanggalLahir: '2005-09-14',
    waliKelas: 'Bu Maya Kartika',
    status: 'Aktif'
  }
];

// Data absensi dummy yang konsisten dengan data siswa
export const ABSENSI_DATA: AbsensiRecord[] = [
  // Data untuk hari ini
  {
    id: 1,
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: 1,
    nama: 'Ahmad Rizki Maulana',
    kelas: 'XII IPA 1',
    nis: '12345001',
    status: 'hadir',
    waktu: '07:15',
    keterangan: '',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: 2,
    nama: 'Sari Dewi Anggraini',
    kelas: 'XII IPA 1',
    nis: '12345002',
    status: 'hadir',
    waktu: '07:20',
    keterangan: '',
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: 3,
    nama: 'Budi Santoso Wijaya',
    kelas: 'XII IPA 2',
    nis: '12345003',
    status: 'terlambat',
    waktu: '08:05',
    keterangan: 'Terjebak macet di jalan',
    timestamp: new Date().toISOString()
  },
  {
    id: 4,
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: 4,
    nama: 'Maya Sari Putri',
    kelas: 'XII IPS 1',
    nis: '12345004',
    status: 'hadir',
    waktu: '07:12',
    keterangan: '',
    timestamp: new Date().toISOString()
  },
  {
    id: 5,
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: 5,
    nama: 'Doni Prasetyo Hadi',
    kelas: 'XII IPS 2',
    nis: '12345005',
    status: 'alpha',
    waktu: '-',
    keterangan: 'Tanpa keterangan',
    timestamp: new Date().toISOString()
  },
  {
    id: 6,
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: 6,
    nama: 'Lisa Permata Sari',
    kelas: 'XII IPA 1',
    nis: '12345006',
    status: 'sakit',
    waktu: '-',
    keterangan: 'Sakit demam, ada surat dokter',
    timestamp: new Date().toISOString()
  },
  {
    id: 7,
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: 7,
    nama: 'Andi Wijaya Kusuma',
    kelas: 'XII IPA 2',
    nis: '12345007',
    status: 'hadir',
    waktu: '07:08',
    keterangan: '',
    timestamp: new Date().toISOString()
  },
  {
    id: 8,
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: 8,
    nama: 'Sinta Maharani',
    kelas: 'XII IPS 1',
    nis: '12345008',
    status: 'hadir',
    waktu: '07:18',
    keterangan: '',
    timestamp: new Date().toISOString()
  },
  // Data kemarin
  ...generatePastAbsensiData(1),
  // Data 2 hari lalu
  ...generatePastAbsensiData(2),
  // Data 3 hari lalu
  ...generatePastAbsensiData(3),
  // Data seminggu lalu
  ...generatePastAbsensiData(7),
  // Data 2 minggu lalu
  ...generatePastAbsensiData(14),
  // Data bulan lalu
  ...generatePastAbsensiData(30)
];

// Fungsi untuk generate data absensi masa lalu
function generatePastAbsensiData(daysAgo: number): AbsensiRecord[] {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const dateString = date.toISOString().split('T')[0];
  
  const baseId = daysAgo * 100;
  
  return [
    {
      id: baseId + 1,
      tanggal: dateString,
      siswaId: 1,
      nama: 'Ahmad Rizki Maulana',
      kelas: 'XII IPA 1',
      nis: '12345001',
      status: 'hadir',
      waktu: '07:10',
      keterangan: '',
      timestamp: date.toISOString()
    },
    {
      id: baseId + 2,
      tanggal: dateString,
      siswaId: 2,
      nama: 'Sari Dewi Anggraini',
      kelas: 'XII IPA 1',
      nis: '12345002',
      status: 'hadir',
      waktu: '07:15',
      keterangan: '',
      timestamp: date.toISOString()
    },
    {
      id: baseId + 3,
      tanggal: dateString,
      siswaId: 3,
      nama: 'Budi Santoso Wijaya',
      kelas: 'XII IPA 2',
      nis: '12345003',
      status: daysAgo % 3 === 0 ? 'terlambat' : 'hadir',
      waktu: daysAgo % 3 === 0 ? '08:00' : '07:25',
      keterangan: daysAgo % 3 === 0 ? 'Bangun kesiangan' : '',
      timestamp: date.toISOString()
    },
    {
      id: baseId + 4,
      tanggal: dateString,
      siswaId: 4,
      nama: 'Maya Sari Putri',
      kelas: 'XII IPS 1',
      nis: '12345004',
      status: 'hadir',
      waktu: '07:05',
      keterangan: '',
      timestamp: date.toISOString()
    },
    {
      id: baseId + 5,
      tanggal: dateString,
      siswaId: 6,
      nama: 'Lisa Permata Sari',
      kelas: 'XII IPA 1',
      nis: '12345006',
      status: daysAgo % 5 === 0 ? 'sakit' : 'hadir',
      waktu: daysAgo % 5 === 0 ? '-' : '07:22',
      keterangan: daysAgo % 5 === 0 ? 'Tidak enak badan' : '',
      timestamp: date.toISOString()
    },
    {
      id: baseId + 6,
      tanggal: dateString,
      siswaId: 7,
      nama: 'Andi Wijaya Kusuma',
      kelas: 'XII IPA 2',
      nis: '12345007',
      status: 'hadir',
      waktu: '07:12',
      keterangan: '',
      timestamp: date.toISOString()
    }
  ];
}

// Fungsi helper untuk mendapatkan data siswa by ID
export const getStudentById = (id: number): Student | undefined => {
  return STUDENTS_DATA.find(student => student.id === id);
};

// Fungsi untuk mendapatkan avatar inisial
export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Fungsi untuk inisialisasi data di localStorage jika belum ada
export const initializeLocalStorageData = () => {
  if (typeof window !== 'undefined') {
    const existingStudents = localStorage.getItem('studentData');
    if (!existingStudents) {
      localStorage.setItem('studentData', JSON.stringify(STUDENTS_DATA));
    }
    
    const existingAbsensi = localStorage.getItem('absensiData');
    if (!existingAbsensi) {
      localStorage.setItem('absensiData', JSON.stringify(ABSENSI_DATA));
    }
  }
};

// Opsi kelas yang tersedia
export const KELAS_OPTIONS = [
  'X IPA 1', 'X IPA 2', 'X IPA 3',
  'X IPS 1', 'X IPS 2', 'X IPS 3',
  'XI IPA 1', 'XI IPA 2', 'XI IPA 3',
  'XI IPS 1', 'XI IPS 2', 'XI IPS 3',
  'XII IPA 1', 'XII IPA 2', 'XII IPA 3',
  'XII IPS 1', 'XII IPS 2', 'XII IPS 3'
];

// Opsi wali kelas
export const WALI_KELAS_OPTIONS = [
  'Bu Sari Indrawati',
  'Pak Budi Setiawan', 
  'Bu Maya Kartika',
  'Pak Doni Firmansyah',
  'Bu Ani Susanti',
  'Pak Eko Prasetyo',
  'Bu Rina Wulandari',
  'Pak Joko Widodo'
];

// Status absensi
export const ABSENSI_STATUS = {
  HADIR: 'hadir',
  TERLAMBAT: 'terlambat',
  SAKIT: 'sakit',
  ALPHA: 'alpha'
} as const;

// Label status absensi
export const STATUS_LABELS = {
  [ABSENSI_STATUS.HADIR]: 'Hadir',
  [ABSENSI_STATUS.TERLAMBAT]: 'Terlambat',
  [ABSENSI_STATUS.SAKIT]: 'Sakit',
  [ABSENSI_STATUS.ALPHA]: 'Alpha'
};

// Warna status absensi
export const STATUS_COLORS = {
  [ABSENSI_STATUS.HADIR]: 'bg-green-100 text-green-800',
  [ABSENSI_STATUS.TERLAMBAT]: 'bg-yellow-100 text-yellow-800',
  [ABSENSI_STATUS.SAKIT]: 'bg-blue-100 text-blue-800',
  [ABSENSI_STATUS.ALPHA]: 'bg-red-100 text-red-800'
};
