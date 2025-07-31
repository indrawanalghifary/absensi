'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchAbsensi } from '../lib/supabaseData';

interface ChartData {
  name: string;
  hadir: number;
  tidak: number;
}

export default function AttendanceChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    loadWeeklyData();
    // eslint-disable-next-line
  }, []);

  const loadWeeklyData = async () => {
    try {
      const absensiData = await fetchAbsensi();
      // Generate data untuk 7 hari terakhir
      const weekData: ChartData[] = [];
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayData = absensiData.filter((item: any) => item.tanggal === dateStr);
        const hadir = dayData.filter((item: any) => item.status === 'hadir').length;
        const terlambat = dayData.filter((item: any) => item.status === 'terlambat').length;
        const sakit = dayData.filter((item: any) => item.status === 'sakit').length;
        const alpha = dayData.filter((item: any) => item.status === 'alpha').length;
        const izin = dayData.filter((item: any) => item.status === 'izin').length;
        weekData.push({
          name: dayNames[date.getDay()],
          hadir: hadir + terlambat, // Terlambat dianggap hadir
          tidak: sakit + alpha + izin
        });
      }
      setChartData(weekData);
    } catch (err) {
      setChartData([]);
    }
  };

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 lg:mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Grafik Kehadiran Mingguan</h3>
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs lg:text-sm text-gray-600">Hadir</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-xs lg:text-sm text-gray-600">Tidak Hadir</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="hadir" 
            stackId="1"
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="tidak" 
            stackId="1"
            stroke="#ef4444" 
            fill="#ef4444" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}