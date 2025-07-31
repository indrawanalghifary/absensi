'use client';
import { useEffect, useState } from 'react';
import { getInitials, STUDENTS_DATA, ABSENSI_DATA } from '../lib/dummyData';

interface ActivityData {
  id: number;
  type: 'attendance' | 'student_add' | 'student_edit';
  message: string;
  user: string;
  time: string;
  icon: string;
  color: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityData[]>([]);

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = () => {
    const absensiData = JSON.parse(localStorage.getItem('absensiData') || JSON.stringify(ABSENSI_DATA));
    
    // Ambil 5 absensi terbaru berdasarkan timestamp
    const recentAbsensi = absensiData
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    const activityData: ActivityData[] = recentAbsensi.map((item: any, index: number) => ({
      id: item.id || index,
      type: 'attendance',
      message: `${item.nama} dicatat ${getStatusLabel(item.status)} pada ${new Date(item.tanggal).toLocaleDateString('id-ID')}`,
      user: 'Admin',
      time: formatTimeAgo(item.timestamp),
      icon: getStatusIcon(item.status),
      color: getStatusActivityColor(item.status)
    }));

    setActivities(activityData);
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'hadir': return 'hadir';
      case 'terlambat': return 'terlambat';
      case 'sakit': return 'sakit';
      case 'alpha': return 'alpha';
      default: return status;
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'hadir': return 'ri-user-check-line';
      case 'terlambat': return 'ri-time-line';
      case 'sakit': return 'ri-heart-pulse-line';
      case 'alpha': return 'ri-user-unfollow-line';
      default: return 'ri-user-check-line';
    }
  };

  const getStatusActivityColor = (status: string): string => {
    switch (status) {
      case 'hadir': return 'text-green-600 bg-green-50';
      case 'terlambat': return 'text-yellow-600 bg-yellow-50';
      case 'sakit': return 'text-blue-600 bg-blue-50';
      case 'alpha': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} menit yang lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else {
      return `${diffDays} hari yang lalu`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 lg:p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
          <div className="text-xs lg:text-sm text-gray-500">
            Pembaruan realtime sistem absensi
          </div>
        </div>
      </div>
      <div className="p-4 lg:p-6">
        <div className="space-y-3 lg:space-y-4 max-h-80 lg:max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                <i className={`${activity.icon} text-sm lg:text-base`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base text-gray-900 mb-1">{activity.message}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 lg:gap-2">
                  <p className="text-xs lg:text-sm text-gray-500">oleh {activity.user}</p>
                  <p className="text-xs lg:text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}