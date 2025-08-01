
'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';
import AbsensiForm from './AbsensiForm';
import AbsensiTable from './AbsensiTable';
import DateSelector from './DateSelector';

export default function AbsensiPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);

  const handleAbsensiSuccess = () => {
    setShowForm(false);
    setRefreshTable(prev => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
      
      <main className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Absensi Harian</h1>
              <p className="text-sm lg:text-base text-gray-600">Kelola absensi siswa untuk tanggal yang dipilih</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 lg:py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2 text-sm lg:text-base"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-add-line"></i>
              </div>
              <span>Input Absensi</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          <DateSelector 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          
          <AbsensiTable 
            selectedDate={selectedDate}
            refresh={refreshTable}
          />
        </div>

        {showForm && (
          <AbsensiForm
            selectedDate={selectedDate}
            onClose={() => setShowForm(false)}
            onSuccess={handleAbsensiSuccess}
          />
        )}
      </main>
    </div>
    </ProtectedRoute>
  );
}
