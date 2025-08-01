'use client';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';
import StudentStatusList from '../components/StudentStatusList';
import RecentActivity from '../components/RecentActivity';
import ProtectedRoute from '../components/ProtectedRoute';
import { fetchStudents, fetchAbsensi } from '../lib/supabaseData';

export default function Home() {
  const [stats, setStats] = useState({
    totalSiswa: 0,
    hadirHariIni: 0,
    terlambat: 0,
    tidakHadir: 0,
    izin: 0,
    todayAbsensi: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    const [students, absensi] = await Promise.all([
      fetchStudents(),
      fetchAbsensi()
    ]);
    const totalSiswa = students.length;
    const today = new Date().toISOString().split('T')[0];
    const todayAbsensi = absensi.filter((item: any) => item.tanggal === today);
    const hadirHariIni = todayAbsensi.filter((item: any) => item.status === 'hadir').length;
    const terlambat = todayAbsensi.filter((item: any) => item.status === 'terlambat').length;
    const sakit = todayAbsensi.filter((item: any) => item.status === 'sakit').length;
    const alpha = todayAbsensi.filter((item: any) => item.status === 'alpha').length;
    const izin = todayAbsensi.filter((item: any) => item.status === 'izin').length;
    const tidakHadir = sakit + alpha;
    setStats({
      totalSiswa,
      hadirHariIni,
      terlambat,
      tidakHadir,
      izin,
      todayAbsensi: todayAbsensi.length,
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
      
      <main className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Dashboard Absensi</h1>
          <p className="text-sm lg:text-base text-gray-600">Selamat datang! Berikut ringkasan absensi siswa hari ini</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <StatCard 
            title="Total Siswa" 
            value={stats.totalSiswa.toString()} 
            icon="ri-user-line" 
            color="bg-blue-500"
            // change="+2% dari bulan lalu"
            change={`${stats.totalSiswa > 0 ? ((stats.todayAbsensi / stats.totalSiswa) * 100).toFixed(1) : '0.0'}% Total Siswa`}
          />
          <StatCard 
            title="Hadir Hari Ini" 
            value={stats.hadirHariIni.toString()} 
            icon="ri-user-line" 
            color="bg-green-500"
            change={`${stats.totalSiswa > 0 ? ((stats.hadirHariIni / stats.totalSiswa) * 100).toFixed(1) : '0.0'}% kehadiran`}
          />
          <StatCard 
            title="Terlambat" 
            value={stats.terlambat.toString()} 
            icon="ri-time-line" 
            color="bg-yellow-500"
            change={`${stats.totalSiswa > 0 ? ((stats.terlambat / stats.totalSiswa) * 100).toFixed(1) : '0.0'}% dari total`}
          />
          <StatCard 
            title="Tidak Hadir" 
            value={stats.tidakHadir.toString()} 
            icon="ri-user-unfollow-line" 
            color="bg-red-500"
            change={`${stats.totalSiswa > 0 ? ((stats.tidakHadir / stats.totalSiswa) * 100).toFixed(1) : '0.0'}% dari total`}
          />
          <StatCard 
            title="Izin" 
            value={stats.izin.toString()} 
            icon="ri-user-star-line" 
            color="bg-purple-500"
            change={`${stats.totalSiswa > 0 ? ((stats.izin / stats.totalSiswa) * 100).toFixed(1) : '0.0'}% dari total`}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <AttendanceChart />
          <StudentStatusList />
        </div>

        <RecentActivity />
      </main>
    </div>
    </ProtectedRoute>
  );
}